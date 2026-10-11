import express from 'express';
import cors from 'cors';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import selfsigned from 'selfsigned';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import mobileRoutes from './routes/mobileRoutes.js';
import { getDbStatus } from './models/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 정적 프론트엔드 파일 제공
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// API 라우트 등록
app.use('/api', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/mobile', mobileRoutes);

// 서버 헬스체크
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'STAI Posture Platform - PayPal & Edge AI Service',
    database: getDbStatus(),
    timestamp: new Date().toISOString()
  });
});

// 루트 요청 시 index.html 제공 (Express 5 호환)
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

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
