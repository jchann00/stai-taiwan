import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import mobileRoutes from './routes/mobileRoutes.js';
import { getDbStatus } from './models/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 정적 프론트엔드 파일 제공 (로컬 환경 및 Standalone 서버용)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// API 라우트 등록
app.use('/api', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/mobile', mobileRoutes);

// 서버 헬스체크 및 국가 감지 엔드포인트
app.get('/api/health', (req, res) => {
  const country = req.headers['x-country'] || req.headers['cf-ipcountry'] || 'UNKNOWN';
  res.json({
    status: 'OK',
    service: 'STAI Posture Platform - PayPal & Edge AI Service',
    database: getDbStatus(),
    detectedCountry: country,
    timestamp: new Date().toISOString()
  });
});

// 클라이언트 GeoIP 조회 API (Netlify / Cloudflare 국가 헤더 반영)
app.get('/api/geo', (req, res) => {
  const country = req.headers['x-country'] || req.headers['cf-ipcountry'] || '';
  res.json({ country });
});

// 루트 및 SPA 요청 시 index.html 서빙 (Express 5 호환)
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

export default app;
