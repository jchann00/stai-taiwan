// 서버 보안 가격 정책 (Client-side Price Tampering 방지)
// 클라이언트에서 임의로 가격을 수정할 수 없도록 서버에서 플랜 ID와 결제 주기(월간/연간)를 기준으로 금액을 강제합니다.

export const PLANS = {
  starter: {
    id: 'starter',
    name: 'STAI Starter (기본 집중 분석)',
    badge: '입문용',
    target: '일반 직장인 및 가벼운 독서 습관 형성',
    monthly: {
      USD: '4.99',
      TWD: '149.00'
    },
    yearly: {
      USD: '47.88', // 월 $3.99 상당 (20% 할인)
      TWD: '1428.00'
    },
    features: [
      '웹캠 기반 거북목 각도 기본 측정',
      '포모도로 집중 타이머 & 일일 리포트',
      '일일 3시간 연속 집중 보호 쉴드 (월 2개)'
    ]
  },
  pro: {
    id: 'pro',
    name: 'STAI Pro Focus (AI 실시간 코칭)',
    badge: '추천 플랜',
    target: '고시/수험생, 코딩 테스트 및 대학원 연구원',
    popular: true,
    monthly: {
      USD: '9.99',
      TWD: '299.00'
    },
    yearly: {
      USD: '95.88', // 월 $7.99 상당 (20% 할인)
      TWD: '2868.00'
    },
    features: [
      '30+ FPS 33개 신체 3D WorldLandmarks 정밀 추적',
      '이상 감지 디바운싱 버퍼 (얼굴 3s, 다중 4s)',
      'TF.js COCO-SSD 스마트폰 딴짓 실시간 감지',
      '연속 기록 동결 쉴드 (무제한 보충권)',
      '9:16 인스타 릴스/쇼츠 공부 타임랩스 비디오 내보내기'
    ]
  },
  clinic: {
    id: 'clinic',
    name: 'STAI Team & Clinic (전문가/클리닉)',
    badge: '전문가용',
    target: '도수치료/재활 클리닉, 스터디룸 및 기업 팀',
    monthly: {
      USD: '29.99',
      TWD: '899.00'
    },
    yearly: {
      USD: '287.88', // 월 $23.99 상당 (20% 할인)
      TWD: '8628.00'
    },
    features: [
      'Pro 플랜의 모든 기능 무제한 포함',
      '주간/월간 척추 경추 건강 종합 의학 리포트 PDF',
      '다중 사용자/자습실 개설 및 팀 관리자 대시보드',
      '원격 자세 코치 및 전문의 피드백 연동 API'
    ]
  }
};

/**
 * 플랜 ID, 결제 주기(월간/연간), 통화에 따라 검증된 주문 상세 정보를 반환합니다.
 * @param {string} planId - 'starter' | 'pro' | 'clinic'
 * @param {string} cycle - 'monthly' | 'yearly'
 * @param {string} currency - 'USD' | 'TWD'
 */
export function getPlanDetails(planId, cycle = 'monthly', currency = 'USD') {
  // 하위 호환성 (enterprise -> clinic 매핑)
  const normalizedId = planId === 'enterprise' ? 'clinic' : planId;
  const plan = PLANS[normalizedId];
  if (!plan) {
    throw new Error(`존재하지 않는 플랜입니다: ${planId}`);
  }

  const selectedCurrency = (currency || 'USD').toUpperCase();
  const selectedCycle = cycle === 'yearly' ? 'yearly' : 'monthly';
  const pricingTable = selectedCycle === 'yearly' ? plan.yearly : plan.monthly;
  const value = pricingTable[selectedCurrency] || pricingTable.USD;

  return {
    ...plan,
    id: normalizedId,
    cycle: selectedCycle,
    selectedCurrency,
    selectedAmount: value
  };
}
