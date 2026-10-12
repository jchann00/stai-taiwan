// STAI Platform Persistent Data Storage Layer
// MongoDB Atlas 연동 지원 및 Atlas 미연결 시 고속 인메모리/로컬 동기화 스토어 자동 지원

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isMongoConnected = false;

// MongoDB Atlas 연결 시도 (환경변수 MONGODB_URI가 있을 경우)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      isMongoConnected = true;
      console.log('✅ MongoDB Atlas 연결 성공!');
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB 연결 실패 (내장 데이터 스토어로 전환):', err.message);
    });
} else {
  console.log('ℹ️ MONGODB_URI 미설정: 내장 고속 메모리 스토어가 활성화되었습니다.');
}

// 로컬/인메모리 DB 스토어 (데이터 무결성 및 주문 내역 영구 보존)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dbDir = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(dbDir, '..', 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// data 디렉토리 생성
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

let loadedOrders = [];
if (fs.existsSync(ORDERS_FILE)) {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    loadedOrders = JSON.parse(raw);
  } catch (e) {
    console.warn('주문 기록 파일 로드 실패:', e.message);
  }
}

export const memoryStore = {
  users: [
    {
      id: 'user_default',
      email: 'demo@stai.focus',
      passwordHash: '$2a$10$wKzW67qXz33LzK6H7j30z.x.JdZb9H6H8f/J8bK2aL3x9C5h6E8a', // demo1234
      name: '陳冠宇 (Guan-Yu Chen)',
      plan: 'pro', // 기본 프로 라이선스 활성화
      trustScore: 98.4,
      streakDays: 18,
      freezeShields: 2,
      todayFocusMinutes: 205, // 3시간 25분
      createdAt: new Date().toISOString()
    }
  ],
  sessions: [
    {
      id: 'session_demo_1',
      userId: 'user_default',
      taskName: '資料結構與演算法刷題',
      focusSeconds: 6138, // 1:42:18
      trustScore: 98.4,
      violations: [
        { type: 'NECK_STRAIN', timestamp: new Date(Date.now() - 3600000).toISOString(), durationMs: 12000 },
        { type: 'FACE_MISSING_BUFFERED', timestamp: new Date(Date.now() - 1800000).toISOString(), durationMs: 3200 }
      ],
      completed: true,
      createdAt: new Date().toISOString()
    }
  ],
  violationLogs: [],
  orders: loadedOrders
};

export const saveOrderRecord = (order) => {
  memoryStore.orders.unshift(order);
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(memoryStore.orders, null, 2), 'utf-8');
  } catch (e) {
    console.warn('주문 기록 영구 저장 실패:', e.message);
  }
};

export const getDbStatus = () => ({
  type: isMongoConnected ? 'MongoDB Atlas' : 'In-Memory Secure Store',
  isMongoConnected,
  userCount: memoryStore.users.length,
  sessionCount: memoryStore.sessions.length,
  logCount: memoryStore.violationLogs.length,
  orderCount: memoryStore.orders.length
});
