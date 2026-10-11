# 💳 STAI Posture-Driven Focus Platform - PayPal 연동 모듈

본 프로젝트는 **STAI 자세 교정 및 집중도 플랫폼**을 위한 **PayPal 결제 시스템 연동 모듈**입니다.  
최신 **`@paypal/paypal-server-sdk (v2.5+)`** 및 **`PayPal JavaScript SDK`** 표준 베스트 프랙티스를 준수하여 제작되었습니다.

---

## 🌟 주요 특징

1. **보안 가격 정책 (Tamper-Proof Pricing)**
   - 결제 금액을 클라이언트에서 조작하지 못하도록 서버 측 플랜 정의(`server/pricing.js`)를 기준으로 주문을 강제 생성합니다.
2. **최신 PayPal Server SDK 연동**
   - `@paypal/paypal-server-sdk`의 `OrdersController.createOrder` 및 `OrdersController.captureOrder` 표준 API 탑재.
3. **듀얼 통화 지원 (USD / TWD)**
   - 대만 시장(TWD NT$) 및 글로벌 시장(USD $) 플랜 가격을 손쉽게 전환할 수 있습니다.
4. **시뮬레이션(Mock) 모드 내장**
   - PayPal 개발자 키를 아직 발급받지 않은 상태에서도 프론트엔드/백엔드 결제 및 영수증 모달 흐름을 1초 만에 테스트할 수 있습니다.

---

## 📁 디렉토리 구조

```
STAI(자세교정-대만)/
├── package.json
├── .env                  # PayPal 자격 증명 환경 변수
├── .env.example          # 환경 변수 템플릿
├── server/
│   ├── index.js          # Express 서버 엔트리포인트 (포트 3000)
│   ├── paypalClient.js   # @paypal/paypal-server-sdk 클라이언트 초기화
│   ├── pricing.js        # 서버 검증 플랜별 가격 정책
│   └── routes/
│       └── orderRoutes.js# /api/orders 및 /api/orders/:orderId/capture 라우트
└── public/
    ├── index.html        # 반응형 다크모드 결제 UI
    ├── style.css         # Glassmorphism 디자인 시스템
    └── app.js            # PayPal JS SDK & 플랜 선택 컨트롤러
```

---

## 🚀 빠른 시작 (Quick Start)

### 1. 패키지 설치 및 서버 실행
```bash
# 의존성 설치 (이미 완료됨)
npm install

# 서버 실행 (Express 백엔드 + 프론트엔드 동시 제공)
npm start
```

서버 실행 후 브라우저에서 **`http://localhost:3000`** 접속

---

## 🔑 PayPal Sandbox 키 발급 및 설정 방법

1. **[PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/sandbox)** 에 로그인합니다.
2. **Apps & Credentials** 메뉴에서 **Create App** 버튼을 클릭합니다.
   - App Name: `STAI Posture Platform`
   - App Type: `Merchant`
3. 생성된 앱의 **Client ID**와 **Secret Key**를 복사합니다.
4. 프로젝트 루트의 [`.env`](file:///c:/Users/jchan/Documents/ai/STAI%28%EC%9E%90%EC%84%B8%EA%B5%90%EC%A0%95-%EB%8C%80%EB%A7%8C%29/.env) 파일을 열고 입력합니다:

```env
PAYPAL_CLIENT_ID=복사한_CLIENT_ID
PAYPAL_CLIENT_SECRET=복사한_CLIENT_SECRET
PAYPAL_ENVIRONMENT=sandbox
PORT=3000
```

5. 서버를 재시작하면 브라우저에 **실제 PayPal 결제 버튼**이 즉시 렌더링됩니다!

---

## 📡 API 엔드포인트 명세

| Method | Endpoint | 설명 |
|---|---|---|
| `GET` | `/api/config/paypal` | 프론트엔드용 Client ID 및 활성화 상태 확인 |
| `GET` | `/api/plans` | 사용 가능한 플랜 및 가격 목록 조회 |
| `POST` | `/api/orders` | PayPal 주문 생성 (`planId`, `currency` 전달) |
| `POST` | `/api/orders/:orderId/capture` | 결제 승인 완료 후 최종 캡처 및 라이선스 발급 |
| `GET` | `/api/health` | 서버 헬스체크 |
