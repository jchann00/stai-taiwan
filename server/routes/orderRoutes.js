import express from 'express';
import jwt from 'jsonwebtoken';
import { ordersController, CheckoutPaymentIntent, isConfigured } from '../paypalClient.js';
import { PLANS, getPlanDetails } from '../pricing.js';
import { memoryStore, saveOrderRecord } from '../models/db.js';
import { verifyAuth } from './authRoutes.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'stai-super-secret-jwt-key-2026';

/**
 * GET /api/config/paypal
 * 클라이언트에 PayPal 초기화에 필요한 정보 전달 (Client ID 등)
 */
router.get('/config/paypal', (req, res) => {
  res.json({
    configured: isConfigured,
    clientId: isConfigured ? process.env.PAYPAL_CLIENT_ID : 'test-sandbox-client-id',
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
    currency: 'USD'
  });
});

/**
 * GET /api/plans
 * 등록된 플랜 및 가격 목록 조회
 */
router.get('/plans', (req, res) => {
  res.json({
    plans: Object.values(PLANS)
  });
});

/**
 * GET /api/orders/history
 * 로그인 유저의 결제 주문 내역 조회
 */
router.get('/orders/history', verifyAuth, (req, res) => {
  const userOrders = (memoryStore.orders || []).filter(o => o.userId === req.user.id || o.userEmail === req.user.email);
  res.json({
    success: true,
    orders: userOrders
  });
});

/**
 * POST /api/orders
 * PayPal 주문 생성 엔드포인트
 * Body: { planId: 'starter' | 'pro' | 'clinic', cycle?: 'monthly' | 'yearly', currency?: 'USD' | 'TWD' }
 */
router.post('/orders', verifyAuth, async (req, res) => {
  try {
    const { planId = 'pro', cycle = 'monthly', currency = 'USD' } = req.body;

    // 1. 서버 측 가격 정책 검증 (클라이언트 조작 방지)
    const plan = getPlanDetails(planId, cycle, currency);

    console.log(`[Order Create] 플랜 요청: ${plan.name} (${plan.selectedAmount} ${plan.selectedCurrency}, ${plan.cycle}) - User: ${req.user.email}`);

    // 2. PayPal SDK 주문 생성
    if (isConfigured && ordersController) {
      const collect = {
        body: {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            {
              description: `${plan.name} - Posture AI Subscription`,
              customId: plan.id,
              amount: {
                currencyCode: plan.selectedCurrency,
                value: plan.selectedAmount,
              },
            },
          ],
        },
      };

      const { result, statusCode } = await ordersController.createOrder(collect);
      console.log(`[PayPal] 주문 생성 완료 - OrderID: ${result.id}, Status: ${result.status}`);

      return res.status(statusCode || 201).json({
        id: result.id,
        status: result.status,
        plan: plan.id,
        amount: plan.selectedAmount,
        currency: plan.selectedCurrency
      });
    }

    // 3. Mock 모드 (PayPal 키 미설정 시 개발/테스트용)
    const mockOrderId = `MOCK-ORDER-${Date.now()}`;
    console.log(`[PayPal Mock] API 키가 없어 시뮬레이션 주문을 생성합니다 - OrderID: ${mockOrderId}`);

    return res.status(201).json({
      id: mockOrderId,
      status: 'CREATED',
      mock: true,
      plan: plan.id,
      amount: plan.selectedAmount,
      currency: plan.selectedCurrency,
      message: 'PayPal Sandbox 키 미설정 상태의 시뮬레이션 주문입니다.'
    });

  } catch (error) {
    console.error('[PayPal Error] 주문 생성 실패:', error);
    return res.status(500).json({
      error: '주문 생성 중 오류가 발생했습니다.',
      message: error.message
    });
  }
});

/**
 * POST /api/orders/:orderId/capture
 * PayPal 결제 승인 후 최종 캡처(Capture) 처리
 */
router.post('/orders/:orderId/capture', verifyAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { planId = 'pro' } = req.body || {};
    console.log(`[Order Capture] 결제 승인 캡처 요청 - OrderID: ${orderId}, User: ${req.user.email}`);

    if (isConfigured && ordersController && !orderId.startsWith('MOCK-')) {
      try {
        const { result, statusCode } = await ordersController.captureOrder({
          id: orderId,
          body: {},
        });

        console.log(`[PayPal] 결제 캡처 성공 - OrderID: ${result.id}, Status: ${result.status}`);

        const payerEmail = result.payer?.email_address;
        const payerName = result.payer?.name 
          ? `${result.payer.name.given_name || ''} ${result.payer.name.surname || ''}`.trim() 
          : '';

        let targetUser = req.user;
        // 게스트 상태이거나 페이팔 결제자 계정과 로그인 이메일이 다를 경우 영구 유저 자동 생성/바인딩
        if (payerEmail && (req.user.id === 'user_default' || req.user.email !== payerEmail)) {
          let existing = memoryStore.users.find(u => u.email.toLowerCase() === payerEmail.toLowerCase());
          if (!existing) {
            existing = {
              id: `usr_${Date.now()}`,
              email: payerEmail,
              name: payerName || payerEmail.split('@')[0],
              passwordHash: 'oauth_paypal_guest',
              plan: planId,
              trustScore: 98,
              streakDays: 1,
              freezeShields: 5,
              todayFocusMinutes: 0,
              createdAt: new Date().toISOString()
            };
            memoryStore.users.push(existing);
          }
          targetUser = existing;
        }

        // 유저 플랜 승격 및 스트릭 방어 쉴드 3개 보너스 지급
        targetUser.plan = planId;
        targetUser.freezeShields = (targetUser.freezeShields || 0) + 3;

        // 결제 트랜잭션 기록 저장
        const captureInfo = result.purchase_units?.[0]?.payments?.captures?.[0];
        const orderRecord = {
          orderId: result.id,
          userId: targetUser.id,
          userEmail: targetUser.email,
          payerEmail: payerEmail || targetUser.email,
          payerName: payerName || targetUser.name,
          planId,
          amount: captureInfo?.amount?.value || '9.99',
          currency: captureInfo?.amount?.currency_code || 'USD',
          status: result.status,
          capturedAt: new Date().toISOString()
        };
        saveOrderRecord(orderRecord);

        // JWT 토큰 발급 (결제 완료 후 프론트엔드 자동 로그인 유지)
        const token = jwt.sign(
          { id: targetUser.id, email: targetUser.email },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        return res.status(statusCode || 200).json({
          success: true,
          token,
          orderId: result.id,
          status: result.status,
          plan: targetUser.plan,
          user: {
            id: targetUser.id,
            email: targetUser.email,
            name: targetUser.name,
            plan: targetUser.plan,
            freezeShields: targetUser.freezeShields
          },
          bonusShields: 3,
          details: result,
        });
      } catch (sdkErr) {
        console.warn(`[PayPal SDK Notice] 주문 승인 대기 중 (${orderId}):`, sdkErr.message);
        return res.status(400).json({
          success: false,
          error: 'ORDER_NOT_APPROVED',
          message: 'PayPal 팝업 창에서 결제 승인을 먼저 완료해주세요.',
          orderId
        });
      }
    }

    // Mock 캡처 처리
    console.log(`[PayPal Mock] 결제 캡처 시뮬레이션 성공 - OrderID: ${orderId}`);
    req.user.plan = planId;
    req.user.freezeShields = (req.user.freezeShields || 0) + 3;

    const mockOrderRecord = {
      orderId,
      userId: req.user.id,
      userEmail: req.user.email,
      planId,
      amount: '9.99',
      currency: 'USD',
      status: 'COMPLETED',
      mock: true,
      capturedAt: new Date().toISOString()
    };
    saveOrderRecord(mockOrderRecord);

    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      token,
      orderId,
      status: 'COMPLETED',
      plan: req.user.plan,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        plan: req.user.plan,
        freezeShields: req.user.freezeShields
      },
      bonusShields: 3,
      mock: true,
      message: '결제가 정상 완료되어 라이선스가 활성화되었습니다!'
    });

  } catch (error) {
    console.error('[PayPal Error] 결제 캡처 실패:', error);
    return res.status(500).json({
      error: '결제 캡처 중 오류가 발생했습니다.',
      message: error.message
    });
  }
});

export default router;
