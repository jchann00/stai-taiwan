import https from 'https';
import selfsigned from 'selfsigned';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// 1. HTTP 서버 실행
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 STAI 자세교정 플랫폼 HTTP 서버 실행 완료!`);
  console.log(`📡 Local Web: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

// 2. 모바일 카메라 테스트용 HTTPS 서버 실행 (iOS Safari/Android Chrome 보안 카메라 규격)
try {
  const pems = await selfsigned.generate([{ name: 'commonName', value: 'localhost' }], { days: 365 });
  https.createServer({ key: pems.private, cert: pems.cert }, app).listen(HTTPS_PORT, () => {
    console.log(`🔒 모바일 카메라 지원 HTTPS 서버 실행 완료!`);
    console.log(`📱 HTTPS URL: https://localhost:${HTTPS_PORT}`);
    console.log(`=======================================================`);
  });
} catch (err) {
  console.warn('⚠️ HTTPS 서버 초기화 실패 (HTTP 포트로 계속 실행):', err.message);
}
