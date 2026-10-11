import express from 'express';
import os from 'os';
import QRCode from 'qrcode';

const router = express.Router();

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // 가상 어댑터 제외
        if (!name.includes('vEthernet') && !name.includes('Tailscale') && !name.includes('Loopback')) {
          return iface.address;
        }
      }
    }
  }
  return 'localhost';
}

router.get('/network-info', async (req, res) => {
  const localIp = getLocalIp();
  const httpPort = process.env.PORT || 3000;
  const httpsPort = process.env.HTTPS_PORT || 3443;

  // 모바일 브라우저 카메라는 HTTPS 필수 (iOS Safari & Android Chrome 보안 정책)
  const httpsUrl = `https://${localIp}:${httpsPort}`;
  const httpUrl = `http://${localIp}:${httpPort}`;

  // 공용 인터넷 배포 터널 URL이 설정된 경우 공인 SSL 도메인 우선 적용
  const tunnelUrl = process.env.TUNNEL_URL || '';
  const preferredMobileUrl = tunnelUrl || httpsUrl;

  try {
    const qrDataUrl = await QRCode.toDataURL(preferredMobileUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0c1322',
        light: '#ffffff'
      }
    });

    res.json({
      localIp,
      httpUrl,
      httpsUrl,
      tunnelUrl,
      preferredMobileUrl,
      qrDataUrl,
      mobileCameraGuide: {
        ios: 'iOS Safari: 설정 열기 -> 카메라 권한 허용 (HTTPS 필수)',
        android: 'Android Chrome: 팝업 시 [카메라 권한 허용] 터치'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'QR 코드 생성 실패', message: err.message });
  }
});

export default router;
