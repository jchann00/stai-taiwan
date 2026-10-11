import express from 'express';
import { memoryStore } from '../models/db.js';
import { verifyAuth } from './authRoutes.js';

const router = express.Router();

/**
 * POST /api/session/start
 * 새로운 집중 세션 시작
 */
router.post('/start', verifyAuth, (req, res) => {
  const { taskName = '자유 집중 학습' } = req.body;
  const newSession = {
    id: `sess_${Date.now()}`,
    userId: req.user.id,
    taskName,
    focusSeconds: 0,
    trustScore: 100,
    violations: [],
    completed: false,
    startedAt: new Date().toISOString()
  };

  memoryStore.sessions.unshift(newSession);
  res.json({ success: true, session: newSession });
});

/**
 * POST /api/session/log-violation
 * Continuous Temporal Buffer 알고리즘에 의해 필터링 후 확정된 이상 감지 이벤트 기록
 */
router.post('/log-violation', verifyAuth, (req, res) => {
  const { sessionId, type, durationMs, details } = req.body;

  const logEntry = {
    id: `log_${Date.now()}`,
    sessionId,
    userId: req.user.id,
    type, // 'FACE_MISSING_3S', 'MULTIPLE_FACES_4S', 'SMARTPHONE_DETECTED', 'POOR_POSTURE_LEVEL2', 'POOR_POSTURE_LEVEL3'
    durationMs: durationMs || 0,
    details: details || {},
    timestamp: new Date().toISOString()
  };

  memoryStore.violationLogs.unshift(logEntry);

  // 세션이 있다면 세션에도 추가
  const session = memoryStore.sessions.find(s => s.id === sessionId);
  if (session) {
    session.violations.push(logEntry);
    // 트러스트 스코어 감점 로직 (가벼운 감점, 지속적 이탈 시 누적)
    if (type === 'SMARTPHONE_DETECTED') session.trustScore = Math.max(60, session.trustScore - 3.5);
    else if (type === 'FACE_MISSING_3S') session.trustScore = Math.max(70, session.trustScore - 2.0);
    else if (type === 'MULTIPLE_FACES_4S') session.trustScore = Math.max(75, session.trustScore - 1.5);
    else if (type.startsWith('POOR_POSTURE')) session.trustScore = Math.max(80, session.trustScore - 1.0);
  }

  console.log(`[Buffer Log] ${type} (지속: ${durationMs}ms) 기록 완료`);
  res.json({ success: true, log: logEntry });
});

/**
 * POST /api/session/complete
 * 세션 종료 및 일일 누적 집중 시간 갱신
 */
router.post('/complete', verifyAuth, (req, res) => {
  const { sessionId, focusSeconds = 0 } = req.body;
  const session = memoryStore.sessions.find(s => s.id === sessionId);

  if (session) {
    session.focusSeconds = focusSeconds;
    session.completed = true;
    session.completedAt = new Date().toISOString();
  }

  // 오늘 누적 집중 분 추가
  const addMinutes = Math.floor(focusSeconds / 60);
  req.user.todayFocusMinutes += addMinutes;

  res.json({
    success: true,
    session,
    todayFocusMinutes: req.user.todayFocusMinutes,
    trustScore: session ? session.trustScore : 98.4
  });
});

/**
 * POST /api/session/shield/use
 * 연속 기록 방어 쉴드(Freeze Shield) 사용
 */
router.post('/shield/use', verifyAuth, (req, res) => {
  if (req.user.freezeShields <= 0) {
    return res.status(400).json({ error: '사용 가능한 방어 쉴드가 없습니다.' });
  }

  req.user.freezeShields -= 1;
  res.json({
    success: true,
    remainingShields: req.user.freezeShields,
    message: '오늘 하루 결석/자세 불량 시 스트릭이 보호되는 방어막이 활성화되었습니다!'
  });
});

/**
 * GET /api/session/stats
 * 대시보드 통계 및 18일 연속 스트릭 데이터
 */
router.get('/stats', verifyAuth, (req, res) => {
  res.json({
    user: req.user,
    streakDays: req.user.streakDays,
    freezeShields: req.user.freezeShields,
    trustScore: req.user.trustScore,
    todayFocusMinutes: req.user.todayFocusMinutes,
    todayGoalMinutes: 300, // 5시간
    recentViolations: memoryStore.violationLogs.slice(0, 10),
    history: [
      { date: '2026-10-05', minutes: 280, trust: 99.1, status: 'success' },
      { date: '2026-10-06', minutes: 310, trust: 98.7, status: 'success' },
      { date: '2026-10-07', minutes: 240, trust: 95.4, status: 'shield_used' },
      { date: '2026-10-08', minutes: 320, trust: 99.4, status: 'success' },
      { date: '2026-10-09', minutes: 295, trust: 97.9, status: 'success' },
      { date: '2026-10-10', minutes: 305, trust: 98.2, status: 'success' },
      { date: '2026-10-11', minutes: req.user.todayFocusMinutes, trust: 98.4, status: 'in_progress' }
    ]
  });
});

export default router;
