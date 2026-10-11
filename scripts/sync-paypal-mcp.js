import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const envMode = (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase();

const isSandbox = envMode === 'sandbox';
const oauthUrl = isSandbox 
  ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token' 
  : 'https://api-m.paypal.com/v1/oauth2/token';

console.log('=======================================================');
console.log('🔄 PayPal 자격 증명 검증 및 MCP 토큰 동기화');
console.log('=======================================================');
console.log(`• 환경: ${envMode.toUpperCase()}`);
console.log(`• Client ID: ${clientId ? clientId.slice(0, 10) + '...' : '(미설정)'}`);
console.log(`• Client Secret: ${clientSecret ? clientSecret.slice(0, 10) + '...' : '(미설정)'}`);

if (!clientId || !clientSecret || clientId === 'YOUR_PAYPAL_CLIENT_ID') {
  console.error('\n❌ 오류: .env 파일에 유효한 PAYPAL_CLIENT_ID와 PAYPAL_CLIENT_SECRET이 필요합니다.');
  process.exit(1);
}

if (clientId === clientSecret) {
  console.error('\n❌ 주의: 현재 PAYPAL_CLIENT_ID와 PAYPAL_CLIENT_SECRET에 동일한 값이 입력되어 있습니다!');
  console.error('👉 PayPal 대시보드에서 Secret 항목 옆 [Show]를 클릭하여 별도의 Secret Key를 복사해 입력해주세요.');
  process.exit(1);
}

async function syncToken() {
  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await fetch(oauthUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('\n❌ PayPal OAuth 인증 실패:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    const accessToken = data.access_token;
    console.log('\n✅ PayPal OAuth 인증 성공!');
    console.log(`• Access Token 발급 완료 (만료 시간: ${data.expires_in}초)`);

    // mcp_config.json 파일 자동 업데이트
    const userHome = process.env.USERPROFILE || process.env.HOME;
    const mcpConfigPath = path.join(userHome, '.gemini', 'config', 'mcp_config.json');

    if (fs.existsSync(mcpConfigPath)) {
      const configRaw = fs.readFileSync(mcpConfigPath, 'utf-8');
      const config = JSON.parse(configRaw);

      if (config.mcpServers && config.mcpServers['paypal-mcp-server']) {
        config.mcpServers['paypal-mcp-server'].env = {
          PAYPAL_ACCESS_TOKEN: accessToken,
          PAYPAL_ENVIRONMENT: isSandbox ? 'SANDBOX' : 'PRODUCTION'
        };

        if (!config.mcpServers['paypal-mcp-server'].args.includes('--tools=all')) {
          config.mcpServers['paypal-mcp-server'].args.push('--tools=all');
        }

        fs.writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2), 'utf-8');
        console.log(`✅ mcp_config.json에 PAYPAL_ACCESS_TOKEN이 자동으로 동기화되었습니다!`);
      }
    }
  } catch (err) {
    console.error('동기화 처리 실패:', err.message);
  }
}

syncToken();
