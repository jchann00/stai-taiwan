// STAI DeepFocus Multi-Language Translation System (KO, ZH-TW, EN)

const translations = {
  ko: {
    // Header
    brandTitle: 'DeepFocus',
    brandSubtitle: 'Zero-Trust Edge AI • 30+ FPS',
    streakBadge: '연속 {days}일',
    proPlan: 'PRO 플랜',
    proActive: 'PRO 활성화됨',
    mobileConnectBtn: '📱 모바일 카메라 연결',
    appGuideBtn: '❓ 사용법',
    loginBtn: '로그인',

    // Tab Bar
    tabHud: '집중 타이머',
    tabPosture: '자세 피드백',
    tabStreak: '습관 기록',
    tabRoom: '온라인 자습실',

    // Tab 1: HUD
    aiVisionActive: '실시간 비전 센서 작동 중',
    btnWebcamStart: '카메라 켜기 (Zero-Trust)',
    btnWebcamStop: '카메라 끄기',
    btnWebcamFlip: '전/후면 전환',
    btnFlipCameraTitle: '카메라 전/후면 전환',
    taskNameDefault: '오늘의 집중 공부 & 독서',
    taskGoalDefault: 'D-Day 목표 달성',
    currentSession: 'CURRENT SESSION',
    trustScoreLabel: '집중도',
    pureFocusToday: '오늘 순수 집중',
    hoursGoal: '/ 5시간',
    unitHour: '시간',
    unitMinute: '분',
    btnStartStudy: '공부 시작',
    btnPause: '일시정지',
    btnResume: '계속하기',
    btnReset: '초기화',
    btnResetLabel: '초기화',
    btnShareSNS: 'SNS 인증 (9:16 Shorts)',
    btnShieldQuick: '방어 쉴드',
    autoLockTitle: '집중 이탈 자동 잠금 (Continuous Temporal Buffer)',
    autoLockDesc: '얼굴 이탈(3초) 또는 스마트폰 감지 시 타이머 일시정지 & 화면 블러',
    hudNeckTilt: '목 기울기',
    hudDistance: '거리',
    hudOptimal: '최적',
    hudDistanceOptimal: '최적',
    hudTooClose: '너무 가까움',
    hudTooFar: '너무 멂',
    hudNormal: '정상',
    hudWarning: '경고',
    guardNormal: '바른 자세 유지 중 • 순수 집중 시간 누적',
    guardPaused: '일시정지 (자리 비움/딴짓)',
    rateNormal: '+1초/초',

    // Camera Violations & Buffer
    violationFaceMissing: '얼굴 미감지 3초 경과 - 타이머가 일시정지되었습니다.',
    violationPhoneDetected: '스마트폰 사용 감지 ({score}%) - 자세 집중 방해',
    bufferReturnNotice: '✨ 얼굴 복귀 감지 - 순수 집중 타이머가 재개되었습니다.',

    // Tab 2: Posture Feedback
    postureCoachTitleGood: '우수한 자세를 유지하고 있습니다',
    postureCoachAdviceGood: '어깨와 귀가 중심축에 정렬되어 있습니다. 45분 집중 후 2분 스트레칭을 권장합니다.',
    postureCoachBadgeGood: '자세 양호 • 최적 상태',
    postureCoachTitleWarning: '자세를 바로잡아 주세요!',
    postureCoachAdviceWarning: '목 전방 기울기가 심합니다. 턱을 가볍게 당기고 허리를 펴세요.',
    postureCoachBadgeWarning: '거북목 2~3단계 감지',
    cervicalStrain: '경추 하중',
    statNeck: '목 전방 기울기',
    statShoulder: '양 어깨 높낮이차',
    statDist: '화면 거리',
    postureVisualizerTitle: '실시간 척추 & 상체 정렬 시각화',
    idealSpineAxis: '이상적 수직축 (0°)',
    currentNeckAxis: '현재 측정 각도',
    spineAngleOptimal: '경추 기울기: {angle}° (최적 정렬)',
    spineAngleWarning: '경추 기울기: {angle}° (주의 단계)',
    spineAngleDanger: '경추 기울기: {angle}° (거북목 위험)',

    stretchGuideTitle: '즉각 자세 교정 스트레칭 처방',
    btnStretchStart: '⚡ 10초 리셋 스트레칭 시작',
    stretchingProgress: '⏳ 스트레칭 중... {count}초',
    stretchingDone: '✨ 스트레칭 완료! 바른 자세 유지',
    chinTuckTitle: '턱 수평으로 당기기 (Chin Tuck)',
    chinTuckDesc: '턱을 가볍게 뒤로 밀어 넣어 목 뒤쪽을 길게 늘려주세요. 경추 C1~C7의 압박이 즉시 완화됩니다.',
    shoulderRollTitle: '날개뼈 모으기 & 어깨 펴기',
    shoulderRollDesc: '양쪽 어깨를 뒤로 젖히고 날개뼈를 가볍게 모아 굽은 등을 펴주세요.',

    // Blur Penalty Section
    blurSystemTitle: '🎯 실시간 시야 차단(블러) 페널티 시스템',
    blurSystemBadge: '블러 페널티 프리뷰',
    blurSystemDesc: '고개가 25° 이상 숙여지거나 스마트폰을 보면, 시야가 점진적으로 흐려져 즉시 허리를 펴도록 유도합니다.',
    studyDocTitle: '나의 학습 메모 & 독서 시야 공간',
    studyDocP1: '올바른 앉은 자세를 유지하면 뇌 혈류량이 18% 증가하고, 목과 어깨의 근육 피로도를 최대 40%까지 줄일 수 있습니다.',
    studyDocP2: '자세가 무너지면 이 화면이 실시간으로 흐려져(Progressive Blur), 자연스럽게 허리를 펴도록 시각적 피드백을 제공합니다.',
    blurGuideNote: '인체공학 표준: 모니터 상단을 눈높이에 맞추면 목 피로도가 40% 감소합니다.',
    blurSliderLabel: '블러 효과 강도 수동 테스트:',

    // Tab 3: Habits & Streak
    streakHeroTitle: '연속 집중 {days}일 달성',
    streakHeroDesc: '상위 5.8%의 고효율 수험생 및 연구원 집중 페이스',
    shieldTitle: '연속 기록 동결 쉴드 (Freeze Shield)',
    shieldDesc: '부득이한 사정으로 일일 5시간 목표 미달성 시 쉴드가 자동 소모되어 연속 일수를 보호합니다.',
    shieldRemaining: '잔여 {count}개',
    btnUseShield: '오늘 하루 쉴드 적용하기',
    btnBuyShield: '쉴드 충전 (+3)',
    weekCalendarTitle: '이번 주 집중 달성 현황',

    deskAlignmentGuide: '데스크 & 키보드 90° 정렬선',
    daysMon: '월',
    daysTue: '화',
    daysWed: '수',
    daysThu: '목',
    daysFri: '금',
    daysSat: '토',
    daysSun: '일',
    alertResetConfirm: '집중 타이머를 00:00:00으로 초기화하시겠습니까?',
    alertShieldSuccess: '🛡️ 방어 쉴드가 활성화되었습니다! 잔여: {count}개. 오늘 연속 기록이 보호됩니다.',

    // Tab 4: Study Room
    roomOnlineTitle: '타이베이 & 서울 고강도 자습실 #04',
    roomOnlineCount: '실시간 집중 중 (342명 접속)',
    changeRoomBtn: '방 변경',
    peerMe: '나 (User)',
    peerFocusMinutes: '집중 {m}분',
    peerPostureRate: '자세 {p}%',

    roomSwitchTitle: '🏛️ 집중 자습실 선택',
    roomSwitchDesc: '원하는 목표와 집중 분위기의 방을 선택하세요.',
    room1Title: '타이베이 & 서울 고강도 자습실 #04',
    room1Desc: '국가고시, 로스쿨, 연구원 수험생 전용',
    room2Title: '도쿄 & 실리콘밸리 코딩/AI 집중실 #02',
    room2Desc: '개발자 알고리즘 코딩테스트 및 논문 리딩',
    room3Title: '의치한약수 수험생 심야 자습실 #01',
    room3Desc: '순공 12시간 달성 목표의 침묵 자습실',
    room4Title: '글로벌 얼리버드 새벽 5시 기상 스터디실 #07',
    room4Desc: '기상 인증 및 아침 첫 집중 2시간 달성',
    btnJoinRoom: '이 방으로 입장하기',
    peerCheerModalTitle: '동료 집중 현황 & 응원하기',
    btnCheerClap: '👏 박수 보내기',
    btnCheerFire: '🔥 열정 불꽃',
    btnCheerCoffee: '☕ 커피 한 잔',
    cheerSuccessMsg: '{name}님에게 {type} 응원을 보냈습니다! 파이팅!',

    // Study Room Extension (방 만들기 & 친구 초대)
    btnCreateRoom: '방 만들기',
    btnInviteRoom: '친구 초대',
    createRoomTitle: '🏛️ 나만의 집중 자습실 개설',
    createRoomDesc: '친구, 스터디원과 함께할 실시간 AI 자세 교정 자습실을 만드세요.',
    inputRoomNameLabel: '자습실 이름',
    inputRoomNamePlaceholder: '예: 대만대 의대 & 수험생 심야 자습실',
    inputRoomCategoryLabel: '카테고리',
    catExam: '🎓 수험/고시/의치한',
    catDev: '💻 개발/알고리즘/AI',
    catLanguage: '🌍 어학/자격증/취준',
    catGeneral: '⚡ 자유 순공 집중',
    inputRoomDescLabel: '목표 및 자습실 규칙',
    inputRoomDescPlaceholder: '예: 순공 8시간 달성, 스마트폰 딴짓 금지, 카메라 ON',
    btnSubmitCreateRoom: '자습실 개설 완료',
    btnCancel: '취소',

    inviteModalTitle: '🔗 친구 초대하기',
    inviteModalDesc: '초대 링크를 친구에게 공유하면 같은 자습실에서 서로의 집중을 응원할 수 있습니다.',
    inviteCodeLabel: '자습실 고유 초대 코드',
    inviteUrlLabel: '원클릭 자동입장 초대 링크',
    btnCopyInviteLink: '📋 초대 링크 복사',
    btnCopyInviteCode: '코드 복사',
    inviteCopiedToast: '🎉 초대 링크가 클립보드에 복사되었습니다! 친구에게 공유해보세요.',
    inviteCodeCopiedToast: '✅ 초대 코드가 복사되었습니다.',

    enterByCodeTitle: '🔑 초대 코드로 빠른 입장',
    enterByCodePlaceholder: '초대 코드 입력 (예: STAI-8492)',
    btnEnterByCode: '입장',
    myRoomsTitle: '👑 내가 개설한 자습실',
    publicRoomsTitle: '🏛️ 추천 공용 자습실',
    myRoomBadge: '내 개설 방',
    hostBadge: '👑 방장 (나)',
    roomCreatedToast: '🎉 나만의 자습실이 성공적으로 개설되었습니다!',
    invalidCodeAlert: '유효한 초대 코드를 입력해주세요.',
    roomNotFoundAlert: '해당 초대 코드의 자습실을 찾을 수 없습니다.',

    // Guide Modal
    guideModalTitle: 'DeepFocus 초간단 3단계 사용법',
    guideStep1Title: '1. 카메라 연결 (Zero-Trust)',
    guideStep1Desc: '웹캠 또는 스마트폰 QR 스캔으로 연결하세요. 영상은 외부 서버로 전송되지 않고 브라우저 내에서만 30 FPS로 안전하게 처리됩니다.',
    guideStep2Title: '2. 0초부터 타이머 시작',
    guideStep2Desc: '[공부 시작]을 누르면 바른 자세를 유지하는 동안만 순수 집중 시간이 카운트업됩니다. 자세가 무너지면 타이머가 일시정지됩니다.',
    guideStep3Title: '3. 자세 교정 & SNS 바이럴 인증',
    guideStep3Desc: '거북목 발생 시 시야 블러 경고가 뜨며 10초 스트레칭으로 피로를 리셋할 수 있습니다. 공부 마감 후 9:16 Shorts 카드로 인스타에 자랑하세요!',
    guideCloseBtn: '확인하고 시작하기',

    // Goal Edit Modal
    editGoalModalTitle: '🎯 나의 목표 & D-Day 설정',
    editGoalLabel: '공부/독서 목표 이름',
    editDdayLabel: '목표 D-Day (예: D-12 또는 시험일)',
    editGoalPlaceholder: '예: 오늘의 집중 공부 & 독서, 토익 900점',
    editDdayPlaceholder: '예: D-12 코딩테스트, D-Day 목표 달성',
    editGoalSaveBtn: '저장하기',
    peerCheerSubtitle: '실시간 응원 스티커 보내기',

    // PayPal & Pricing Modal
    modalUpgradeTitle: 'STAI Pro 요금제 멤버십',
    modalUpgradeDesc: '자세 교정 AI 실시간 코칭 & SNS 타임랩스 잠금 해제',
    modalCurrUSD: 'USD ($)',
    modalCurrTWD: 'TWD (NT$)',
    modalCycleMonthly: '월간 결제',
    modalCycleYearly: '연간 결제',
    discount20: '20% 할인',
    perMonth: '/월',
    planStarterDesc: '입문용 • 직장인',
    planProDesc: '고시/수험생 추천',
    planClinicDesc: '전문가/클리닉',
    planBadgeRecommend: '추천 플랜',
    planFeatureTitleStarter: 'Starter 멤버십 혜택',
    planFeatureTitlePro: 'Pro Focus 멤버십 혜택',
    planFeatureTitleClinic: 'Clinic / Team 멤버십 혜택',
    billingMonthlySummary: '월간 자동 결제 (언제든 취소 가능)',
    billingYearlySummary: '연간 일괄 결제 (연 20% 할인 혜택)',
    featLandmarks: '✓ 33개 관절 3D WorldLandmarks 정밀 추적 (30+ FPS)',
    featDebounce: '✓ 얼굴 이탈 3초 & 다중 인원 디바운싱 버퍼 엔진',
    featPhone: '✓ TF.js 스마트폰 딴짓 실시간 감지',
    featTimelapse: '✓ 9:16 인스타 릴스/쇼츠 공부 타임랩스 비디오 내보내기',
    featShields: '✓ 연속 기록 방어 쉴드 무제한 제공',
    featStarterLimits: '✓ 기본 2D 관절 추적 & 일일 3회 연속 쉴드',
    featClinicFull: '✓ 다중 계정 관리 대시보드 & 체형 교정 분석 리포트',
    featStarter1: 'MediaPipe 기반 거북목 각도 실시간 측정',
    featStarter2: '포모도로 순수 집중 타이머 & 일일 통계 리포트',
    featStarter3: '일일 3시간 연속 집중 보호 쉴드 (월 2개 충전)',
    featStarter4: '3D AI 정밀 딴짓/스마트폰 디바운싱 미포함',
    featClinic1: 'Pro 플랜의 모든 기능 (3D 랜드마크 + SNS 타임랩스) 무제한',
    featClinic2: '주간/월간 척추 경추 건강 종합 의학 리포트 PDF 출력',
    featClinic3: '다인 자습실 개설 및 팀/수험생 관리자 대시보드',
    featClinic4: '원격 자세 코치 및 도수/재활 클리닉 연동 피드백',
    paymentAuthNotice: '💡 로그인 후 결제하시면 계정에 안전하게 라이선스가 영구 귀속됩니다.',
    btnModalQuickLogin: '로그인하기',
    paypalLoadingText: 'PayPal 결제 버튼 로드 중...',
    modalPayNote: '🔒 PayPal Server SDK v2.5 공식 기반 안전 결제 • 변조 방지 서버 검증 정책 적용',

    // Auth Modal
    authModalTitle: '간편 로그인',
    authModalRegisterTitle: '신규 회원가입',
    tabAuthLogin: '로그인',
    tabAuthRegister: '간편 가입',
    labelEmail: '이메일 주소',
    labelPassword: '비밀번호',
    labelName: '이름 / 닉네임',
    placeholderPassword: '비밀번호 입력',
    placeholderName: '예: 김집중',
    btnSubmitLogin: '로그인',
    btnSubmitRegister: '회원가입 완료',
    btnDemoLogin: '1초 데모 계정으로 바로 체험',
    logoutConfirm: '{email} 계정에서 로그아웃하시겠습니까?',
    alertLoginSuccess: '환영합니다, {name}님!',
    alertDemoSuccess: '🚀 데모 유저로 즉시 로그인되었습니다!',

    // SNS Viral Modal
    viralModalTitle: 'SNS 바이럴 스튜디오 (9:16 Shorts/Reels)',
    viralModalDesc: '인스타그램 릴스, 유튜브 쇼츠, 틱톡에 완벽 최적화된 9:16 공부 인증 카드를 생성합니다.',
    viralCardHeader: '오늘의 고밀도 집중 인증',
    viralCardStreak: '🔥 연속 18일 집중 달성',
    viralSpineAlignment: '척추 정렬 98.4%',
    viralCervicalLoad: '경추 하중 4.8kg',
    viralRankingLabel: '전국 고시/연구원 랭킹',
    viralRankingValue: '상위 1.2% (RANK #4)',
    btnSaveViralImage: '9:16 이미지 저장',
    btnShareViralWeb: '인스타/SNS 공유',
    btnExportTimelapseClip: '⚡ 10초 스터디 타임랩스 비디오 렌더링 내보내기',
    alertTimelapseCreated: '🎬 오늘의 30 FPS 스터디 스켈레톤 타임랩스 클립이 9:16 Shorts 형식으로 생성되었습니다! 인스타그램 릴스 업로드가 가능합니다.',
    alertShareCopied: '공유 문구와 링크가 클립보드에 복사되었습니다! 인스타그램 릴스/스토리에 붙여넣으세요 📱',
    shareTitle: 'STAI DeepFocus 순수 집중 인증',
    shareText: '오늘 STAI DeepFocus로 {time} 동안 척추 바른자세를 유지하며 순수 집중을 달성했습니다! (전국 상위 1.2%)\n#공스타 #공스타그램 #StudyWithMe #DeepFocus',

    // Mobile Modal
    mobileModalTitle: '📱 스마트폰 실제 카메라 테스트',
    mobileModalDesc: '스마트폰 카메라로 화면의 QR코드를 스캔하여 접속하세요.',
    mobileGuideHttps: '안내: 모바일 브라우저(Safari/Chrome) 보안 규정상 웹캠은 HTTPS 연결이 필수입니다.',
    mobileCopyBtn: '모바일 링크 복사',
    mobileCopied: '링크가 복사되었습니다!',
    mobileClose: '닫기',

    // Additional Global / UI Labels
    docTitle: 'DeepFocus - Edge AI 자세 교정 및 집중도 플랫폼 (STAI)',
    brandLogoTitle: 'DeepFocus STAI - 클릭하여 사용법 가이드 보기',
    btnFlipCameraTitle: '카메라 전/후면 전환',
    btnOpenGoalModalTitle: '클릭하여 목표 수정',
    btnOpenDdayModalTitle: '클릭하여 D-Day 수정',
    btnResetTimerTitle: '타이머 초기화',
    currentStreakLabel: '현재 연속 스트릭',
    pureFocusTimeLabel: '순수 집중 시간',
    livePreviewBadge: '실시간 프리뷰',
    peerPureFocusLabel: '순수 집중',
    peerPostureRateLabel: '자세 유지율',
    planStarterTitle: 'Starter 베이직',
    planProTitle: 'Pro Focus (추천)',
    planClinicTitle: 'Clinic / Team',
    planBillingCycleMonthly: '월간 결제',
    planBillingCycleYearly: '연간 결제 (30% 할인)',
    room1CountText: '342명 🟢',
    room2CountText: '289명 🟢',
    room3CountText: '512명 🟢',
    room4CountText: '198명 🟢',
    btnCheerShortClap: '👏 박수',
    btnCheerShortFire: '🔥 열정',
    btnCheerShortCoffee: '☕ 커피',
    paypalNoticeBound: '✓ <strong>{email}</strong> 계정으로 결제 라이선스가 영구 귀속됩니다.',
    paypalNoticeGuest: '💡 로그인 후 결제하시면 계정에 안전하게 라이선스가 영구 귀속됩니다.',
    paypalSimulateDevBtn: '🚀 1초 시뮬레이션 결제 (개발 모드)',
    paypalSdkLoadError: 'PayPal SDK 로드 실패. Sandbox 환경을 확인해주세요.',
    paypalPaymentSuccess: '🎉 [결제 완료] {plan} 플랜 라이선스와 방어 쉴드가 안전하게 활성화되었습니다!',
    shieldInsufficient: '쉴드가 부족합니다. Pro 플랜으로 충전하세요!',
    authFailed: '인증에 실패했습니다.',
    serverError: '서버 연결 중 오류가 발생했습니다.',
    onlineBadgeTitle: '온라인',
    hudNeckOptimalStatus: '• 정상',
    hudNeckAngleText: '목 기울기 {angle}°',
    hudDistanceText: '거리 {dist}cm',
    guideModalBtnTitle: '앱 사용 가이드',
    mobileModalBtnTitle: '스마트폰 실제 카메라 연결',
    authModalBtnTitle: '로그인'
  },

  'zh-TW': {
    // Header
    brandTitle: 'DeepFocus',
    brandSubtitle: 'Zero-Trust Edge AI • 30+ FPS',
    streakBadge: '連續 {days} 天',
    proPlan: 'PRO 方案',
    proActive: 'PRO 啟用中',
    mobileConnectBtn: '📱 手機相機連線',
    appGuideBtn: '❓ 使用說明',
    loginBtn: '登入',

    // Tab Bar
    tabHud: '專注階段',
    tabPosture: '坐姿反饋',
    tabStreak: '習慣紀錄',
    tabRoom: '自習室',

    // Tab 1: HUD
    aiVisionActive: '即時視覺感測運作中',
    btnWebcamStart: '開啟鏡頭 (Zero-Trust)',
    btnWebcamStop: '關閉鏡頭',
    btnWebcamFlip: '切換前後鏡頭',
    btnFlipCameraTitle: '切換前後鏡頭',
    taskNameDefault: '今日專注學習與閱讀',
    taskGoalDefault: 'D-Day 倒數衝刺',
    currentSession: 'CURRENT SESSION',
    trustScoreLabel: '專注度',
    pureFocusToday: '今日純專注',
    hoursGoal: '/ 5小時',
    unitHour: '小時',
    unitMinute: '分',
    btnStartStudy: '開始專注',
    btnPause: '暫停',
    btnResume: '繼續',
    btnReset: '重置',
    btnResetLabel: '重置',
    btnShareSNS: '社群分享 (9:16 限動)',
    btnShieldQuick: '防凍護盾',
    autoLockTitle: '防止虛假學習 自動鎖定 (Continuous Temporal Buffer)',
    autoLockDesc: '臉部偏離(3秒)或滑手機時自動暫停並模糊畫面',
    hudNeckTilt: '頸部傾斜',
    hudDistance: '距離',
    hudOptimal: '最佳',
    hudDistanceOptimal: '最佳',
    hudTooClose: '距離過近',
    hudTooFar: '距離過遠',
    hudNormal: '正常',
    hudWarning: '警告',
    guardNormal: '已辨識正確坐姿 • 純專注時間累積中',
    guardPaused: '暫停計時 (離席/分心)',
    rateNormal: '+1秒/秒',

    // Camera Violations & Buffer
    violationFaceMissing: '未偵測到臉部超過3秒 - 計時器已自動暫停',
    violationPhoneDetected: '偵測到使用手機 ({score}%) - 專注中斷',
    bufferReturnNotice: '✨ 臉部已恢復視野 - 純專注計時器已自動恢復',

    // Tab 2: Posture Feedback
    postureCoachTitleGood: '維持優異坐姿，頸椎負重正常',
    postureCoachAdviceGood: '雙肩與耳朵維持在正中軸線，脊椎受力均勻。每專注 45 分鐘建議進行 2 分鐘轉肩拉伸。',
    postureCoachBadgeGood: '姿勢良好 • 最佳水平',
    postureCoachTitleWarning: '需要立即調整坐姿囉！',
    postureCoachAdviceWarning: '頸椎負重超過 18kg！已觸發漸進式模糊反饋，請挺直背部放鬆肩頸。',
    postureCoachBadgeWarning: '偵測到烏龜頸 2~3 級',
    cervicalStrain: '頸椎負重',
    statNeck: '頸椎前傾',
    statShoulder: '雙肩高低差',
    statDist: '螢幕視距',
    postureVisualizerTitle: '即時脊椎與上肢體態可視化',
    idealSpineAxis: '理想鉛垂線 (0°)',
    currentNeckAxis: '當前測量軸',
    spineAngleOptimal: '頸椎傾斜: {angle}° (最佳狀態)',
    spineAngleWarning: '頸椎傾斜: {angle}° (警戒狀態)',
    spineAngleDanger: '頸椎傾斜: {angle}° (烏龜頸危險)',

    stretchGuideTitle: '即時校正 10秒伸展處方',
    btnStretchStart: '⚡ 啟動 10秒重置拉伸',
    stretchingProgress: '⏳ 拉伸中... {count}秒',
    stretchingDone: '✨ 拉伸完成！請挺直身軀',
    chinTuckTitle: '收下巴伸展 (Chin Tuck)',
    chinTuckDesc: '輕輕向後微收下頜，舒緩頸椎深層壓力，立即放鬆 C1~C7 頸椎。',
    shoulderRollTitle: '雙肩向後展開擴胸',
    shoulderRollDesc: '雙肩自然向下向後放鬆擴胸，糾正駝背及圓肩傾向。',

    // Blur Penalty Section
    blurSystemTitle: '🎯 即時視野模糊處罰系統',
    blurSystemBadge: '處罰預覽',
    blurSystemDesc: '當低頭角度大於 25° 時，閱讀區將即時模糊，提醒您挺直背部。',
    studyDocTitle: '我的學習筆記與閱讀視野',
    studyDocP1: '維持正確坐姿可增加腦部血流量達 18%，大幅減緩長時間閱讀與專注時的肩頸與眼睛疲勞。',
    studyDocP2: '當坐姿出現明顯前傾烏龜頸時，此閱讀視窗將漸進式模糊鎖定，引導您自然挺直背部。',
    blurGuideNote: '人體工學標準：螢幕上緣與眼平齊時，肩頸疲勞度可降低 40%。',
    blurSliderLabel: '測試模糊反饋強度:',

    // Tab 3: Habits & Streak
    streakHeroTitle: '連續專注 {days} 天',
    streakHeroDesc: '超越了全台灣 94.2% 的國考與研究所自習者',
    shieldTitle: '連續紀錄防凍護盾 (Freeze Shield)',
    shieldDesc: '若因突發事情無法達成當日 5 小時目標，護盾將自動消耗以保護連續天數。',
    shieldRemaining: '剩餘 {count} 枚',
    btnUseShield: '立即消耗 1 枚護盾為今日加保',
    btnBuyShield: '購買護盾 (+3)',
    weekCalendarTitle: '本週專注達成紀錄',

    deskAlignmentGuide: '桌面與鍵盤 90° 對齊線',
    daysMon: '一',
    daysTue: '二',
    daysWed: '三',
    daysThu: '四',
    daysFri: '五',
    daysSat: '六',
    daysSun: '日',
    alertResetConfirm: '確定要將專注計時器重置為 00:00:00 嗎？',
    alertShieldSuccess: '🛡️ 防凍護盾已啟用！剩餘: {count} 枚。今日連續紀錄已受到保護。',

    // Tab 4: Study Room
    roomOnlineTitle: '台北 & 台中 高強度專注自習室 #04',
    roomOnlineCount: '線上自習中 (342 位同儕在線)',
    changeRoomBtn: '切換房間',
    peerMe: '我 (User)',
    peerFocusMinutes: '專注 {m} 分鐘',
    peerPostureRate: '姿勢 {p}%',

    roomSwitchTitle: '🏛️ 選擇自習室',
    roomSwitchDesc: '選擇適合您目標與步調的同儕自習室。',
    room1Title: '台北 & 首爾 高強度專注自習室 #04',
    room1Desc: '國家考試、研究所與高壓備考者',
    room2Title: '東京 & 矽谷 軟體/AI 深度工作室 #02',
    room2Desc: '工程師刷題、演算法競賽與論文研讀',
    room3Title: '醫學院/公職 凌晨衝刺自習室 #01',
    room3Desc: '目標每日純自習 12小時極限專注室',
    room4Title: '全球晨型人 5AM 清晨共讀自習室 #07',
    room4Desc: '早起打卡、清晨黃金專注 2小時',
    btnJoinRoom: '進入此房間',
    peerCheerModalTitle: '同儕專注狀態 & 為他加油',
    btnCheerClap: '👏 送出鼓掌',
    btnCheerFire: '🔥 熱情火焰',
    btnCheerCoffee: '☕ 送杯咖啡',
    cheerSuccessMsg: '已向 {name} 送出 {type}！一起加油！',

    // Study Room Extension (開設自習室 & 邀請好友)
    btnCreateRoom: '開設自習室',
    btnInviteRoom: '邀請好友',
    createRoomTitle: '🏛️ 開設專屬專注自習室',
    createRoomDesc: '建立專屬自習室，與好友同步AI姿態即時監督與自習。',
    inputRoomNameLabel: '自習室名稱',
    inputRoomNamePlaceholder: '例如: 臺灣大學醫學系深夜自習室',
    inputRoomCategoryLabel: '專注類別',
    catExam: '🎓 升學/國家考試/醫學系',
    catDev: '💻 軟體工程/演算法/AI',
    catLanguage: '🌍 語言檢定/專業證照',
    catGeneral: '⚡ 自由純淨專注',
    inputRoomDescLabel: '目標與自律規則',
    inputRoomDescPlaceholder: '例如: 達成每日淨專注8小時、禁滑手機、鏡頭開啟',
    btnSubmitCreateRoom: '確認開設自習室',
    btnCancel: '取消',

    inviteModalTitle: '🔗 邀請好友加入',
    inviteModalDesc: '分享邀請連結，與好友在同個自習室互相監督與即時打氣加油。',
    inviteCodeLabel: '自習室專屬邀請碼',
    inviteUrlLabel: '一鍵自動進入邀請連結',
    btnCopyInviteLink: '📋 複製邀請連結',
    btnCopyInviteCode: '複製邀請碼',
    inviteCopiedToast: '🎉 邀請連結已複製到剪貼簿！立即傳送給好友。',
    inviteCodeCopiedToast: '✅ 邀請碼已複製。',

    enterByCodeTitle: '🔑 輸入邀請碼快速加入',
    enterByCodePlaceholder: '輸入邀請碼 (例如: STAI-8492)',
    btnEnterByCode: '加入',
    myRoomsTitle: '👑 我開設的自習室',
    publicRoomsTitle: '🏛️ 推薦公用自習室',
    myRoomBadge: '我的自習室',
    hostBadge: '👑 房長 (我)',
    roomCreatedToast: '🎉 專屬自習室已成功開設！',
    invalidCodeAlert: '請輸入有效的邀請碼。',
    roomNotFoundAlert: '查無此邀請碼對應的自習室。',

    // Guide Modal
    guideModalTitle: 'DeepFocus 極簡 3步驟上手指南',
    guideStep1Title: '1. 連接相機 (零信任隱私)',
    guideStep1Desc: '點擊上方相機按鈕或手機 QR Code 連線。影像絕不上傳伺服器，完全於本機 30 FPS 即時運算。',
    guideStep2Title: '2. 從 0秒開始累積純專注',
    guideStep2Desc: '按下【開始專注】，只要維持正確坐姿，純專注秒數即刻開始自動累積。姿勢不良時將自動暫停。',
    guideStep3Title: '3. 姿勢校正 & 社群分享認證',
    guideStep3Desc: '出現駝背時會觸發模糊處罰，點擊 10秒伸展即可放鬆。讀書結束後可一鍵匯出 9:16 限動酷炫圖卡！',
    guideCloseBtn: '了解並開始使用',

    // Goal Edit Modal
    editGoalModalTitle: '🎯 自訂專注目標與倒數日',
    editGoalLabel: '學習/閱讀目標名稱',
    editDdayLabel: '目標 D-Day (例如: D-12 或 考試日)',
    editGoalPlaceholder: '例如：今日深度專注讀書、托福 100分',
    editDdayPlaceholder: '例如：D-12 演算法考試、目標達成日',
    editGoalSaveBtn: '儲存設定',
    peerCheerSubtitle: '送出即時加油貼圖',

    // PayPal & Pricing Modal
    modalUpgradeTitle: 'STAI Pro 訂閱方案',
    modalUpgradeDesc: '解鎖 3D WorldLandmarks 正式版 & 專屬防凍護盾',
    modalCurrUSD: 'USD ($)',
    modalCurrTWD: 'TWD (NT$)',
    modalCycleMonthly: '月繳方案',
    modalCycleYearly: '年繳方案',
    discount20: '省 20%',
    perMonth: '/月',
    planStarterDesc: '入門首選 • 上班族',
    planProDesc: '國考/學生強力推薦',
    planClinicDesc: '專業診所/團體',
    planBadgeRecommend: '推薦方案',
    planFeatureTitleStarter: 'Starter 方案權益',
    planFeatureTitlePro: 'Pro Focus 尊榮方案權益',
    planFeatureTitleClinic: 'Clinic / Team 方案權益',
    billingMonthlySummary: '每月自動扣款 (隨時可取消)',
    billingYearlySummary: '年繳方案 (已享 20% 折扣優惠)',
    featLandmarks: '✓ 33個關節 3D WorldLandmarks 精密追蹤 (30+ FPS)',
    featDebounce: '✓ 臉部偏離3秒與多人干擾防誤判引擎',
    featPhone: '✓ TF.js 滑手機分心即時偵測',
    featTimelapse: '✓ 9:16 IG Reels / Shorts 讀書縮時影片匯出',
    featShields: '✓ 連續紀錄防凍護盾無限量提供',
    featStarterLimits: '✓ 基礎 2D 關節追蹤 & 每日3枚護盾',
    featClinicFull: '✓ 多帳號管理後台 & 體態健康分析報告',
    featStarter1: 'MediaPipe 基礎烏龜頸前傾角即時偵測',
    featStarter2: '番茄鐘純專注計時與每日分析報告',
    featStarter3: '每日 3小時防凍護盾 (每月發送2枚)',
    featStarter4: '未包含 3D 空間追蹤與手機分心防誤判',
    featClinic1: 'Pro 方案完整權益 (3D追蹤 + 縮時影像) 無限制',
    featClinic2: '週/月度 脊椎頸椎健康醫療級分析 PDF 匯出',
    featClinic3: '自訂團體自習室與成員後台儀表板',
    featClinic4: '遠距體態教練與復健診所專屬回饋',
    paymentAuthNotice: '💡 登入後購買，會員權限將永久綁定至您的帳號。',
    btnModalQuickLogin: '立即登入',
    paypalLoadingText: 'PayPal 安全結帳按鈕載入中...',
    modalPayNote: '🔒 PayPal Server SDK v2.5 基於安全支付 • 防竄改伺服器價格政策',

    // Auth Modal
    authModalTitle: '快速登入',
    authModalRegisterTitle: '註冊新帳號',
    tabAuthLogin: '登入',
    tabAuthRegister: '註冊',
    labelEmail: '電子信箱',
    labelPassword: '密碼',
    labelName: '姓名 / 暱稱',
    placeholderPassword: '請輸入密碼',
    placeholderName: '例如：林專注',
    btnSubmitLogin: '登入',
    btnSubmitRegister: '完成註冊',
    btnDemoLogin: '1秒免註冊體驗帳號',
    logoutConfirm: '確定要從 {email} 帳號登出嗎？',
    alertLoginSuccess: '歡迎回來，{name}！',
    alertDemoSuccess: '🚀 已使用體驗帳號立即登入！',

    // SNS Viral Modal
    viralModalTitle: '社群限動工作室 (9:16 Shorts/Reels)',
    viralModalDesc: '為 IG 限時動態、YouTube Shorts、TikTok 打造的 9:16 專注認證卡。',
    viralCardHeader: '今日高密度專注認證',
    viralCardStreak: '🔥 連續 18 天專注達成',
    viralSpineAlignment: '脊椎垂直對齊 98.4%',
    viralCervicalLoad: '頸椎負重 4.8kg',
    viralRankingLabel: '自習同儕排名',
    viralRankingValue: '前 1.2% (RANK #4)',
    btnSaveViralImage: '儲存 9:16 圖卡',
    btnShareViralWeb: '分享至 IG/社群',
    btnExportTimelapseClip: '⚡ 匯出 10秒縮時自習影片',
    alertTimelapseCreated: '🎬 今日 30 FPS 縮時專注自習影片 (9:16 限動格式) 已生成！可分享至 Instagram Reels。',
    alertShareCopied: '分享文字與連結已複製到剪貼簿！可直接貼在 IG 限時動態 📱',
    shareTitle: 'STAI DeepFocus 純專注認證',
    shareText: '今天使用 STAI DeepFocus 維持端正坐姿累計純專注 {time}！（超越 98.8% 同儕）\n#自習 #StudyWithMe #DeepFocus #國考',

    // Mobile Modal
    mobileModalTitle: '📱 手機真實相機測試連線',
    mobileModalDesc: '請使用手機相機掃描畫面的 QR Code 進行即時連線。',
    mobileGuideHttps: '提示：手機瀏覽器 (Safari/Chrome) 安全策略規定，存取鏡頭必須使用 HTTPS。',
    mobileCopyBtn: '複製手機連線網址',
    mobileCopied: '網址已複製到剪貼簿！',
    mobileClose: '關閉',

    // Additional Global / UI Labels
    docTitle: 'DeepFocus - Edge AI 坐姿校正與深度專注平台 (STAI)',
    brandLogoTitle: 'DeepFocus STAI - 點擊查看使用教學',
    btnFlipCameraTitle: '切換前/後置鏡頭',
    btnOpenGoalModalTitle: '點擊修改專注目標',
    btnOpenDdayModalTitle: '點擊修改 D-Day',
    btnResetTimerTitle: '重設計時器',
    currentStreakLabel: '當前連續紀錄',
    pureFocusTimeLabel: '純專注時間',
    livePreviewBadge: '即時預覽',
    peerPureFocusLabel: '純專注',
    peerPostureRateLabel: '坐姿維持率',
    planStarterTitle: 'Starter 基礎版',
    planProTitle: 'Pro Focus (推薦)',
    planClinicTitle: 'Clinic / 專業團隊',
    planBillingCycleMonthly: '按月計費',
    planBillingCycleYearly: '按年計費 (省 30%)',
    room1CountText: '342人 🟢',
    room2CountText: '289人 🟢',
    room3CountText: '512人 🟢',
    room4CountText: '198人 🟢',
    btnCheerShortClap: '👏 拍手',
    btnCheerShortFire: '🔥 熱情',
    btnCheerShortCoffee: '☕ 咖啡',
    paypalNoticeBound: '✓ 付費授權將永久綁定至 <strong>{email}</strong> 帳戶。',
    paypalNoticeGuest: '💡 登入後結帳即可將授權永久安全綁定至您的帳戶。',
    paypalSimulateDevBtn: '🚀 1秒模擬結帳 (開發測試)',
    paypalSdkLoadError: 'PayPal SDK 載入失敗，請檢查 Sandbox 環境。',
    paypalPaymentSuccess: '🎉 [結帳成功] {plan} 方案授權與守護盾已成功啟用！',
    shieldInsufficient: '守護盾不足，請升級 Pro 方案進行補充！',
    authFailed: '驗證失敗，請重試。',
    serverError: '連線伺服器時發生錯誤。',
    onlineBadgeTitle: '在線',
    hudNeckOptimalStatus: '• 良好',
    hudNeckAngleText: '頸椎傾斜 {angle}°',
    hudDistanceText: '距離 {dist}cm',
    guideModalBtnTitle: '使用教學',
    mobileModalBtnTitle: '手機相機即時連線',
    authModalBtnTitle: '登入帳戶'
  },

  en: {
    // Header
    brandTitle: 'DeepFocus',
    brandSubtitle: 'Zero-Trust Edge AI • 30+ FPS',
    streakBadge: '{days} Days Streak',
    proPlan: 'PRO PLAN',
    proActive: 'PRO ACTIVE',
    mobileConnectBtn: '📱 Mobile Camera Connect',
    appGuideBtn: '❓ Guide',
    loginBtn: 'Sign In',

    // Tab Bar
    tabHud: 'Focus HUD',
    tabPosture: 'Posture AI',
    tabStreak: 'Habits',
    tabRoom: 'Study Room',

    // Tab 1: HUD
    aiVisionActive: 'Neural Sensor Active',
    btnWebcamStart: 'Start Camera (Zero-Trust)',
    btnWebcamStop: 'Stop Camera',
    btnWebcamFlip: 'Flip Camera',
    btnFlipCameraTitle: 'Flip Front/Back Camera',
    taskNameDefault: 'Deep Study & Reading',
    taskGoalDefault: 'D-Day Goal Sprint',
    currentSession: 'CURRENT SESSION',
    trustScoreLabel: 'Focus Trust',
    pureFocusToday: 'Today Pure Focus',
    hoursGoal: '/ 5 Hours',
    unitHour: 'h',
    unitMinute: 'm',
    btnStartStudy: 'Start Focus',
    btnPause: 'Pause',
    btnResume: 'Resume',
    btnReset: 'Reset',
    btnResetLabel: 'Reset',
    btnShareSNS: 'Share (9:16 Shorts)',
    btnShieldQuick: 'Shield',
    autoLockTitle: 'Anti-Fake-Study Auto Lock (Continuous Temporal Buffer)',
    autoLockDesc: 'Auto pauses & blurs on 3s face missing or smartphone detection',
    hudNeckTilt: 'Neck Tilt',
    hudDistance: 'Distance',
    hudOptimal: 'Optimal',
    hudDistanceOptimal: 'Optimal',
    hudTooClose: 'Too Close',
    hudTooFar: 'Too Far',
    hudNormal: 'Normal',
    hudWarning: 'Alert',
    guardNormal: 'Optimal Posture Verified • Accumulating Pure Time',
    guardPaused: 'Paused (Absence / Distraction)',
    rateNormal: '+1s/s',

    // Camera Violations & Buffer
    violationFaceMissing: 'Face not detected for 3s - Timer paused',
    violationPhoneDetected: 'Smartphone detected ({score}%) - Distraction penalty',
    bufferReturnNotice: '✨ Face restored - Pure focus timer resumed.',

    // Tab 2: Posture Feedback
    postureCoachTitleGood: 'Great Posture Maintained',
    postureCoachAdviceGood: 'Shoulders and ears are aligned on the median axis. Take a 2-minute stretch every 45 mins.',
    postureCoachBadgeGood: 'Optimal Alignment',
    postureCoachTitleWarning: 'Posture Correction Needed!',
    postureCoachAdviceWarning: 'Significant forward head tilt detected (>18kg cervical load). Straighten up to clear blur.',
    postureCoachBadgeWarning: 'Turtle Neck Level 2~3',
    cervicalStrain: 'Cervical Load',
    statNeck: 'Neck Tilt',
    statShoulder: 'Shoulder Delta',
    statDist: 'Screen Distance',
    postureVisualizerTitle: 'Real-time Spine & Upper Body Alignment',
    idealSpineAxis: 'Ideal Vertical Axis (0°)',
    currentNeckAxis: 'Current Neck Angle',
    spineAngleOptimal: 'Neck Tilt: {angle}° (Optimal)',
    spineAngleWarning: 'Neck Tilt: {angle}° (Warning)',
    spineAngleDanger: 'Neck Tilt: {angle}° (Risk)',

    stretchGuideTitle: 'Instant Posture Relief Coaching',
    btnStretchStart: '⚡ Start 10s Reset Stretch',
    stretchingProgress: '⏳ Stretching... {count}s',
    stretchingDone: '✨ Stretch Done! Stay Upright',
    chinTuckTitle: 'Horizontal Chin Tuck',
    chinTuckDesc: 'Gently glide your chin backward to elongate the back of your neck. Immediately reduces C1~C7 cervical stress.',
    shoulderRollTitle: 'Scapular Retraction & Chest Open',
    shoulderRollDesc: 'Gently pinch your shoulder blades together and downward to relieve rounded shoulders.',

    // Blur Penalty Section
    blurSystemTitle: '🎯 Real-Time View Blur Penalty System',
    blurSystemBadge: 'Penalty Preview',
    blurSystemDesc: 'When forward head tilt exceeds 25° or phone is used, the reading view blurs to prompt sitting upright.',
    studyDocTitle: 'My Study Notes & Reading View',
    studyDocP1: 'Maintaining optimal upright posture enhances cerebral blood flow by up to 18% and reduces cervical muscle fatigue by 40%.',
    studyDocP2: 'When forward head posture or distraction is detected, this reading area progressively blurs to prompt you to sit upright naturally.',
    blurGuideNote: 'Ergonomic rule: Aligning monitor top with eye level reduces neck fatigue by 40%.',
    blurSliderLabel: 'Test Blur Intensity:',

    // Tab 3: Habits & Streak
    streakHeroTitle: '{days} Consecutive Days',
    streakHeroDesc: 'Higher consistency than 94.2% of self-directed researchers worldwide',
    shieldTitle: 'Streak Freeze Shield',
    shieldDesc: 'If unexpected events prevent your 5-hour goal, shields are consumed to preserve your streak.',
    shieldRemaining: '{count} Left',
    btnUseShield: 'Apply 1 Shield for Today',
    btnBuyShield: 'Recharge (+3)',
    weekCalendarTitle: 'Weekly Achievement Matrix',

    deskAlignmentGuide: 'Desk & Keyboard 90° Alignment',
    daysMon: 'Mon',
    daysTue: 'Tue',
    daysWed: 'Wed',
    daysThu: 'Thu',
    daysFri: 'Fri',
    daysSat: 'Sat',
    daysSun: 'Sun',
    alertResetConfirm: 'Reset focus timer to 00:00:00?',
    alertShieldSuccess: '🛡️ Streak Freeze Shield activated! Remaining: {count}. Today\'s streak is protected.',

    // Tab 4: Study Room
    roomOnlineTitle: 'Taipei & Global High-Focus Hall #04',
    roomOnlineCount: 'Study-With-Me (342 peers active)',
    changeRoomBtn: 'Switch Hall',
    peerMe: 'Me (User)',
    peerFocusMinutes: '{m} mins',
    peerPostureRate: '{p}% good',

    roomSwitchTitle: '🏛️ Select Study Room',
    roomSwitchDesc: 'Choose a room matching your goals and focus pace.',
    room1Title: 'Taipei & Seoul High-Focus Hall #04',
    room1Desc: 'National Exams, Law & Graduate Researchers',
    room2Title: 'Tokyo & Silicon Valley Dev/AI Sprint #02',
    room2Desc: 'Algorithm Sprints, LeetCode & Research Papers',
    room3Title: 'Med & Professional Night Owls Hall #01',
    room3Desc: 'Strict 12h Pure Focus Quiet Hall',
    room4Title: 'Global 5AM Early Bird Morning Sprint #07',
    room4Desc: 'Morning Wakeup Routine & Early 2h Sprint',
    btnJoinRoom: 'Enter Room',
    peerCheerModalTitle: 'Peer Focus & Send Encouragement',
    btnCheerClap: '👏 Send Clap',
    btnCheerFire: '🔥 Send Fire',
    btnCheerCoffee: '☕ Send Coffee',
    cheerSuccessMsg: 'Sent {type} cheer to {name}! Keep focusing!',

    // Study Room Extension (Create Room & Invite)
    btnCreateRoom: 'Create Room',
    btnInviteRoom: 'Invite Friends',
    createRoomTitle: '🏛️ Create Custom Study Room',
    createRoomDesc: 'Create a custom focus room and study together with AI posture supervision.',
    inputRoomNameLabel: 'Room Name',
    inputRoomNamePlaceholder: 'e.g., Stanford & Med Midnight Sprint',
    inputRoomCategoryLabel: 'Category',
    catExam: '🎓 Exams / Law / Medicine',
    catDev: '💻 Coding / Algorithms / AI',
    catLanguage: '🌍 Languages / Certifications',
    catGeneral: '⚡ General Pure Focus',
    inputRoomDescLabel: 'Goal & Focus Rules',
    inputRoomDescPlaceholder: 'e.g., 8-hour pure focus sprint, no phone, camera ON',
    btnSubmitCreateRoom: 'Create Study Room',
    btnCancel: 'Cancel',

    inviteModalTitle: '🔗 Invite Friends',
    inviteModalDesc: 'Share your invite link to focus together in the same room.',
    inviteCodeLabel: 'Room Invite Code',
    inviteUrlLabel: 'One-Click Direct Invite Link',
    btnCopyInviteLink: '📋 Copy Invite Link',
    btnCopyInviteCode: 'Copy Code',
    inviteCopiedToast: '🎉 Invite link copied to clipboard! Share it with friends.',
    inviteCodeCopiedToast: '✅ Invite code copied.',

    enterByCodeTitle: '🔑 Quick Join via Code',
    enterByCodePlaceholder: 'Enter Invite Code (e.g., STAI-8492)',
    btnEnterByCode: 'Join',
    myRoomsTitle: '👑 My Created Rooms',
    publicRoomsTitle: '🏛️ Recommended Public Halls',
    myRoomBadge: 'My Room',
    hostBadge: '👑 Host (You)',
    roomCreatedToast: '🎉 Custom study room created successfully!',
    invalidCodeAlert: 'Please enter a valid invite code.',
    roomNotFoundAlert: 'Study room not found for this code.',

    // Guide Modal
    guideModalTitle: 'DeepFocus 3-Step Quick Guide',
    guideStep1Title: '1. Connect Camera (Zero-Trust)',
    guideStep1Desc: 'Connect via webcam or smartphone QR. Video is processed 100% on-device at 30+ FPS and never uploaded.',
    guideStep2Title: '2. Count Up Pure Focus Time',
    guideStep2Desc: 'Press [Start Focus] to accumulate pure study time only while maintaining good posture. Auto pauses on bad posture.',
    guideStep3Title: '3. Posture Relief & SNS Viral',
    guideStep3Desc: 'When slouching, blur alerts trigger. Reset with 10s stretch and export 9:16 Shorts cards to Instagram!',
    guideCloseBtn: 'Got it, let\'s start!',

    // Goal Edit Modal
    editGoalModalTitle: '🎯 Set My Goal & D-Day',
    editGoalLabel: 'Study / Reading Goal Name',
    editDdayLabel: 'Target D-Day (e.g., D-12 or Exam Date)',
    editGoalPlaceholder: 'e.g. Deep Study & Reading, TOEFL 100',
    editDdayPlaceholder: 'e.g. D-12 Exam Sprint, Target Goal',
    editGoalSaveBtn: 'Save Goal',
    peerCheerSubtitle: 'Send Live Cheer Sticker',

    // PayPal & Pricing Modal
    modalUpgradeTitle: 'STAI Pro Membership Plan',
    modalUpgradeDesc: 'Real-time 3D AI Coaching & SNS Timelapse Unlock',
    modalCurrUSD: 'USD ($)',
    modalCurrTWD: 'TWD (NT$)',
    modalCycleMonthly: 'Monthly Plan',
    modalCycleYearly: 'Annual Plan',
    discount20: 'Save 20%',
    perMonth: '/mo',
    planStarterDesc: 'Entry • Professionals',
    planProDesc: 'Exams & Researchers',
    planClinicDesc: 'Clinic & Teams',
    planBadgeRecommend: 'Recommended',
    planFeatureTitleStarter: 'Starter Plan Benefits',
    planFeatureTitlePro: 'Pro Focus Plan Benefits',
    planFeatureTitleClinic: 'Clinic / Team Plan Benefits',
    billingMonthlySummary: 'Monthly Auto-Renewal (Cancel Anytime)',
    billingYearlySummary: 'Annual Billing (Save 20% Yearly)',
    featLandmarks: '✓ 33-Joint 3D WorldLandmarks Real-Time Tracking (30+ FPS)',
    featDebounce: '✓ 3s Face Missing & Multi-Face Continuous Buffer Engine',
    featPhone: '✓ TF.js Smartphone Distraction Edge Detection',
    featTimelapse: '✓ 9:16 Instagram Reels / Shorts Video Export',
    featShields: '✓ Unlimited Streak Freeze Shields',
    featStarterLimits: '✓ Basic 2D Joint Tracking & 3 Shields/day',
    featClinicFull: '✓ Multi-Seat Team Dashboard & Posture Analysis Reports',
    featStarter1: 'Real-time forward head tilt tracking via MediaPipe',
    featStarter2: 'Pomodoro pure focus timer & daily reports',
    featStarter3: '3-hour daily streak freeze shield (2/mo)',
    featStarter4: 'Excludes 3D spatial tracking & smartphone engine',
    featClinic1: 'All Pro features (3D landmarks + timelapse) unlimited',
    featClinic2: 'Weekly/Monthly spine medical report PDF export',
    featClinic3: 'Multi-seat study room creation & admin dashboard',
    featClinic4: 'Remote posture coaching & clinic rehab feedback',
    paymentAuthNotice: '💡 Sign in before checkout to bind Pro license permanently to your account.',
    btnModalQuickLogin: 'Sign In Now',
    paypalLoadingText: 'Loading Secure PayPal Checkout...',
    modalPayNote: '🔒 Official PayPal Server SDK v2.5 Secure Checkout',

    // Auth Modal
    authModalTitle: 'Quick Sign In',
    authModalRegisterTitle: 'Create Account',
    tabAuthLogin: 'Sign In',
    tabAuthRegister: 'Register',
    labelEmail: 'Email Address',
    labelPassword: 'Password',
    labelName: 'Full Name / Nickname',
    placeholderPassword: 'Enter password',
    placeholderName: 'e.g. Alex',
    btnSubmitLogin: 'Sign In',
    btnSubmitRegister: 'Sign Up',
    btnDemoLogin: '1-Click Instant Demo Login',
    logoutConfirm: 'Log out of {email}?',
    alertLoginSuccess: 'Welcome back, {name}!',
    alertDemoSuccess: '🚀 Signed in with 1-click Demo Account!',

    // SNS Viral Modal
    viralModalTitle: 'SNS Viral Studio (9:16 Shorts/Reels)',
    viralModalDesc: 'Generate 9:16 focus milestone cards optimized for Instagram Reels & YouTube Shorts.',
    viralCardHeader: 'Daily Deep Focus Milestone',
    viralCardStreak: '🔥 {days}-Day Focus Streak',
    viralSpineAlignment: 'Spine Alignment 98.4%',
    viralCervicalLoad: 'Cervical Load 4.8kg',
    viralRankingLabel: 'Global Focus Ranking',
    viralRankingValue: 'Top 1.2% (RANK #4)',
    btnSaveViralImage: 'Save 9:16 Image',
    btnShareViralWeb: 'Share to Instagram',
    btnExportTimelapseClip: '⚡ Export 10s Timelapse Clip',
    alertTimelapseCreated: '🎬 Today\'s 30 FPS study timelapse clip (9:16 Shorts format) has been exported! Ready for Instagram Reels.',
    alertShareCopied: 'Share caption and link copied to clipboard! Paste into Instagram Stories 📱',
    shareTitle: 'STAI DeepFocus Pure Focus Verified',
    shareText: 'Today I achieved {time} pure focus with healthy upright posture using STAI DeepFocus! (Top 1.2% worldwide)\n#StudyWithMe #DeepFocus #FocusTimer',

    // Mobile Modal
    mobileModalTitle: '📱 Mobile Camera Connection',
    mobileModalDesc: 'Scan the QR code with your smartphone camera to connect instantly.',
    mobileGuideHttps: 'Notice: WebRTC camera access requires HTTPS on mobile browsers.',
    mobileCopyBtn: 'Copy Mobile Link',
    mobileCopied: 'Link copied!',
    mobileClose: 'Close',

    // Additional Global / UI Labels
    docTitle: 'DeepFocus - Edge AI Posture Correction & Focus Platform (STAI)',
    brandLogoTitle: 'DeepFocus STAI - Click to view guide',
    btnFlipCameraTitle: 'Flip Front/Rear Camera',
    btnOpenGoalModalTitle: 'Click to edit focus goal',
    btnOpenDdayModalTitle: 'Click to edit D-Day',
    btnResetTimerTitle: 'Reset focus timer',
    currentStreakLabel: 'CURRENT STREAK',
    pureFocusTimeLabel: 'PURE FOCUS TIME',
    livePreviewBadge: 'LIVE PREVIEW',
    peerPureFocusLabel: 'PURE FOCUS',
    peerPostureRateLabel: 'POSTURE RATE',
    planStarterTitle: 'Starter Basic',
    planProTitle: 'Pro Focus (Popular)',
    planClinicTitle: 'Clinic / Team',
    planBillingCycleMonthly: 'Billed Monthly',
    planBillingCycleYearly: 'Billed Yearly (Save 30%)',
    room1CountText: '342 Online 🟢',
    room2CountText: '289 Online 🟢',
    room3CountText: '512 Online 🟢',
    room4CountText: '198 Online 🟢',
    btnCheerShortClap: '👏 Clap',
    btnCheerShortFire: '🔥 Fire',
    btnCheerShortCoffee: '☕ Coffee',
    paypalNoticeBound: '✓ Pro license is permanently tied to <strong>{email}</strong>.',
    paypalNoticeGuest: '💡 Sign in before checkout to safely bind your license to your account.',
    paypalSimulateDevBtn: '🚀 1-Sec Test Payment (Dev Mode)',
    paypalSdkLoadError: 'Failed to load PayPal SDK. Please check sandbox settings.',
    paypalPaymentSuccess: '🎉 [Payment Completed] {plan} plan license and shields are now active!',
    shieldInsufficient: 'Insufficient shields. Upgrade to Pro to refill!',
    authFailed: 'Authentication failed.',
    serverError: 'An error occurred while connecting to server.',
    onlineBadgeTitle: 'Online',
    hudNeckOptimalStatus: '• Good',
    hudNeckAngleText: 'Neck Tilt {angle}°',
    hudDistanceText: 'Distance {dist}cm',
    guideModalBtnTitle: 'App Guide',
    mobileModalBtnTitle: 'Connect Mobile Camera',
    authModalBtnTitle: 'Sign In'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = this.detectInitialLanguage();
  }

  detectInitialLanguage() {
    // 1. URL 쿼리 파라미터 우선 (?lang=zh-TW, ?lang=tw, ?lang=en, ?lang=ko)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qLang = urlParams.get('lang');
      if (qLang) {
        const l = qLang.toLowerCase();
        if (l.includes('zh') || l === 'tw' || l.includes('hant')) return 'zh-TW';
        if (l.startsWith('ko')) return 'ko';
        if (l.startsWith('en')) return 'en';
      }
    } catch (e) {}

    // 2. 사용자가 이전에 직접 선택하여 저장한 설정
    const saved = localStorage.getItem('stai_lang');
    if (saved && translations[saved]) {
      return saved;
    }

    // 3. 브라우저 언어 환경 조사 (대만/홍콩/번체중문 우선 감지)
    try {
      const navLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
      for (const raw of navLangs) {
        if (!raw) continue;
        const l = raw.toLowerCase();
        if (l.includes('zh') || l.includes('tw') || l.includes('hk') || l.includes('hant') || l.includes('mo')) {
          return 'zh-TW';
        }
      }
    } catch (e) {}

    // 4. 시스템 타임존 조사 (대만 사용자는 무조건 Asia/Taipei)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Taipei') {
        return 'zh-TW';
      }
      if (tz === 'Asia/Seoul') {
        return 'ko';
      }
    } catch (e) {}

    // 5. 기타 브라우저 언어 감지 (한국어 vs 영문/글로벌)
    try {
      const navLangs = navigator.languages || [navigator.language || ''];
      for (const raw of navLangs) {
        if (!raw) continue;
        const l = raw.toLowerCase();
        if (l.startsWith('ko')) return 'ko';
        if (l.startsWith('en')) return 'en';
      }
    } catch (e) {}

    // 6. 기본값: 대만 타겟 서비스이므로 zh-TW(번체 중국어) 기본 적용
    return 'zh-TW';
  }

  t(key, params = {}) {
    const langDict = translations[this.currentLang] || translations['ko'];
    let text = langDict[key] || translations['ko'][key] || key;

    // 파라미터 보간 ({param} 치환)
    Object.keys(params).forEach(pKey => {
      text = String(text).replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
    });

    return text;
  }

  setLanguage(lang) {
    if (!translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('stai_lang', lang);
    this.applyTranslations();

    // 언어 버튼 UI 갱신
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('bg-indigo-600', 'text-white', 'font-bold');
        btn.classList.remove('text-on-surface-variant');
      } else {
        btn.classList.remove('bg-indigo-600', 'text-white', 'font-bold');
        btn.classList.add('text-on-surface-variant');
      }
    });

    // 동적 텍스트 전체 갱신 (시간/분, 각도, 타이머, 스트레칭 등)
    if (window.updateDynamicTexts) {
      window.updateDynamicTexts();
    }
  }

  applyTranslations() {
    // 1. data-i18n 텍스트 치환
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // 2. data-i18n-placeholder 속성 치환
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    // 3. data-i18n-title 속성 치환
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });

    // 4. HTML document title & lang attribute
    const titleKey = document.querySelector('title[data-i18n]');
    if (titleKey) {
      document.title = this.t('docTitle');
    }
    document.documentElement.lang = this.currentLang === 'zh-TW' ? 'zh-TW' : (this.currentLang === 'en' ? 'en' : 'ko');
  }
}

window.i18n = new I18nManager();
