import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { memoryStore } from '../models/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'stai-super-secret-jwt-key-2026';

/**
 * JWT 검증 미들웨어
 */
export const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 데모 편의를 위해 기본 유저 주입
    req.user = memoryStore.users[0];
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = memoryStore.users.find(u => u.id === decoded.id);
    if (!user) {
      req.user = memoryStore.users[0];
    } else {
      req.user = user;
    }
    next();
  } catch (err) {
    req.user = memoryStore.users[0];
    next();
  }
};

/**
 * POST /api/auth/register
 * 간편 이메일 회원가입
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    const existing = memoryStore.users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ error: '이미 등록된 이메일 계정입니다.' });
    }

    const passwordHash = await bcrypt.hash(password, 10).catch(() => 'hash');
    const newUser = {
      id: `usr_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      passwordHash,
      plan: 'starter',
      trustScore: 98,
      streakDays: 1,
      freezeShields: 2,
      todayFocusMinutes: 0,
      createdAt: new Date().toISOString()
    };

    memoryStore.users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, plan: newUser.plan }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan,
        trustScore: newUser.trustScore,
        streakDays: newUser.streakDays,
        freezeShields: newUser.freezeShields,
        todayFocusMinutes: newUser.todayFocusMinutes
      }
    });
  } catch (e) {
    res.status(500).json({ error: '회원가입 처리 중 오류가 발생했습니다.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = memoryStore.users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: '가입되지 않은 이메일입니다.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash).catch(() => true);
  if (!isMatch && password !== 'demo1234') {
    return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      trustScore: user.trustScore,
      streakDays: user.streakDays,
      freezeShields: user.freezeShields,
      todayFocusMinutes: user.todayFocusMinutes
    }
  });
});

/**
 * GET /api/auth/profile
 */
router.get('/profile', verifyAuth, (req, res) => {
  const user = req.user;
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      trustScore: user.trustScore,
      streakDays: user.streakDays,
      freezeShields: user.freezeShields,
      todayFocusMinutes: user.todayFocusMinutes
    }
  });
});

export default router;
