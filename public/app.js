// STAI DeepFocus App Controller (Frontend + Edge AI + i18n + Mobile Camera + PayPal + Auth + Viral Studio)

let postureEngine = null;
let currentPlan = 'pro';
let currentBillingCycle = 'monthly'; // 'monthly' | 'yearly'
let currentCurrency = 'USD';
let paypalConfig = null;
let paypalButtonsInstance = null;
let currentUser = null;
let currentFreezeShields = 2;
let currentRoomId = 1;
let selectedPeerForCheer = null;
let loadedPayPalLocale = null;
let selectedCategoryForNewRoom = 'exam';

// Timer State - 0초부터 누적 카운트업 (Count-Up)
let timerSeconds = 0;
let isTimerRunning = false;
let timerInterval = null;
let autoLockEnabled = true;

document.addEventListener('DOMContentLoaded', async () => {
  // 1. 다국어 즉시 전면 적용 (대만 접속 시 zh-TW 번체 중국어 최우선 자동 적용)
  const initialLang = window.i18n ? window.i18n.currentLang : 'zh-TW';
  if (window.i18n) {
    window.i18n.setLanguage(initialLang);
  }

  // 대만 사용자면 결제 통화를 TWD(NT$)로 자동 연동
  if (initialLang === 'zh-TW') {
    currentCurrency = 'TWD';
  } else {
    currentCurrency = 'USD';
  }
  initLanguageSwitcher();
  initNavigationTabs();
  initTimer();
  initPostureEngine();
  initBlurWorkspaceSlider();
  initStretchGuide();
  initGuideModal();
  initGoalCustomizer();
  initAuthModal();
  initViralModal();
  initPayPalModal();
  initMobileModal();
  initStudyRoomController();
  initPeerCheerController();
  updateDynamicTexts();

  try { await checkAuthStatus(); } catch (e) { console.warn(e); }
  try { await loadSessionStats(); } catch (e) { console.warn(e); }
  try { await initPayPalConfig(); } catch (e) { console.warn(e); }
});

// 1. 다국어(i18n) 언어 선택 핸들러
function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = btn.getAttribute('data-lang');
      if (window.i18n && selectedLang) {
        window.i18n.setLanguage(selectedLang);
      }
    });
  });
}

function updateDynamicTexts() {
  const t = (key, params) => window.i18n ? window.i18n.t(key, params) : key;
  
  // 1) 타이머 재생/일시정지 및 리셋 버튼
  const btnPauseText = document.getElementById('btnPauseText');
  if (btnPauseText) {
    if (timerSeconds === 0 && !isTimerRunning) {
      btnPauseText.textContent = t('btnStartStudy');
    } else {
      btnPauseText.textContent = isTimerRunning ? t('btnPause') : t('btnResume');
    }
  }

  const btnResetTimer = document.getElementById('btnResetTimer');
  if (btnResetTimer) {
    const span = btnResetTimer.querySelector('span:not(.material-symbols-outlined)');
    if (span) span.textContent = t('btnReset');
  }

  // 2) 웹캠 제어 버튼
  const btnWebcamText = document.getElementById('btnWebcamText');
  if (btnWebcamText && postureEngine) {
    btnWebcamText.textContent = postureEngine.isWebcamActive ? t('btnWebcamStop') : t('btnWebcamStart');
  }

  // 3) 10초 스트레칭 버튼 텍스트
  const btn10sStretchLabel = document.getElementById('btn10sStretchLabel');
  if (btn10sStretchLabel && (!btn10sStretchLabel.dataset.stretchingActive || btn10sStretchLabel.dataset.stretchingActive === 'false')) {
    btn10sStretchLabel.textContent = t('btnStretchStart');
  }

  // 4) 통계 헤더, 스트릭, 연속 보호 쉴드
  const headerStreak = document.getElementById('headerStreak');
  if (headerStreak) {
    headerStreak.textContent = t('streakBadge', { days: 18 });
  }

  const streakHeroTitle = document.getElementById('streakHeroTitle');
  if (streakHeroTitle) {
    streakHeroTitle.textContent = t('streakHeroTitle', { days: 18 });
  }

  const shieldCountBadge = document.getElementById('shieldCountBadge');
  if (shieldCountBadge) {
    shieldCountBadge.textContent = t('shieldRemaining', { count: currentFreezeShields });
  }

  const sessionTrustScore = document.getElementById('sessionTrustScore');
  if (sessionTrustScore) {
    sessionTrustScore.textContent = `${t('trustScoreLabel')} 98.4%`;
  }

  // 5) 일일 누적 집중 시간 (시간, 분 단위)
  const todayMinutesText = document.getElementById('todayMinutesText');
  const todayProgressText = document.getElementById('todayProgressText');
  if (todayMinutesText && todayProgressText) {
    const totalMins = Math.floor(timerSeconds / 60);
    const dispHours = Math.floor(totalMins / 60);
    const dispMins = totalMins % 60;
    todayMinutesText.textContent = `${dispHours}${t('unitHour')} ${dispMins}${t('unitMinute')}`;
    const pct = Math.min(100, Math.round((timerSeconds / (5 * 3600)) * 100));
    todayProgressText.textContent = `${pct}% ${t('hoursGoal')}`;
  }

  // 6) 사용자 목표 및 D-Day 위젯 (저장값 우선, 없으면 언어별 기본값)
  const displayTaskName = document.getElementById('displayTaskName');
  const displayTaskGoal = document.getElementById('displayTaskGoal');
  const savedTaskName = localStorage.getItem('stai_task_name');
  const savedTaskGoal = localStorage.getItem('stai_task_goal');

  if (displayTaskName) {
    displayTaskName.textContent = savedTaskName || t('taskNameDefault');
  }
  if (displayTaskGoal) {
    displayTaskGoal.textContent = savedTaskGoal || t('taskGoalDefault');
  }

  // 7) 척추 비주얼라이저 데스크 안내선 및 각도 상태 텍스트
  const spineDeskGuideText = document.getElementById('spineDeskGuideText');
  if (spineDeskGuideText) {
    spineDeskGuideText.textContent = t('deskAlignmentGuide');
  }

  // 8) HUD 거리 상태 및 각도 기본값 (비작동 시에도 다국어 즉시 반영)
  const hudNeckAngle = document.getElementById('hudNeckAngle');
  const hudNeckStatus = document.getElementById('hudNeckStatus');
  const hudDistance = document.getElementById('hudDistance');
  const hudDistanceStatus = document.getElementById('hudDistanceStatus');
  if (hudNeckAngle && (!postureEngine || !postureEngine.isWebcamActive)) {
    hudNeckAngle.textContent = t('hudNeckAngleText', { angle: 3 });
  }
  if (hudNeckStatus && (!postureEngine || !postureEngine.isWebcamActive)) {
    hudNeckStatus.textContent = t('hudNeckOptimalStatus');
  }
  if (hudDistance && (!postureEngine || !postureEngine.isWebcamActive)) {
    hudDistance.textContent = t('hudDistanceText', { dist: 55 });
  }
  if (hudDistanceStatus) {
    hudDistanceStatus.textContent = `• ${t('hudDistanceOptimal')}`;
  }

  // Posture Card 기본값 다국어 갱신
  const coachBadge = document.getElementById('postureLevelBadge');
  const coachTitle = document.getElementById('postureCoachTitle');
  const coachAdvice = document.getElementById('postureCoachAdvice');
  const strainWeight = document.getElementById('postureStrainWeight');
  if (coachBadge && (!postureEngine || !postureEngine.isWebcamActive)) {
    coachBadge.textContent = t('postureCoachBadgeGood');
  }
  if (coachTitle && (!postureEngine || !postureEngine.isWebcamActive)) {
    coachTitle.textContent = t('postureCoachTitleGood');
  }
  if (coachAdvice && (!postureEngine || !postureEngine.isWebcamActive)) {
    coachAdvice.textContent = t('postureCoachAdviceGood');
  }
  if (strainWeight && (!postureEngine || !postureEngine.isWebcamActive)) {
    strainWeight.textContent = `${t('cervicalStrain')}: 4.8 kg`;
  }

  const btnShareSNS = document.querySelector('[data-i18n="btnShareSNS"]');
  if (btnShareSNS) {
    btnShareSNS.textContent = t('btnShareSNS');
  }

  const weekCalendarTitle = document.querySelector('[data-i18n="weekCalendarTitle"]');
  if (weekCalendarTitle) {
    weekCalendarTitle.textContent = t('weekCalendarTitle');
  }

  if (postureEngine && postureEngine.lastMetrics) {
    updateSpineVisualizer(postureEngine.lastMetrics.neckAngle, postureEngine.lastMetrics.shoulderAngle);
  } else {
    updateSpineVisualizer(3, 0);
  }

  // 9) 7일 캘린더 요일 헤더 동적 갱신
  refreshCalendarDayNames();

  // 10) PayPal 요금제 상세 혜택 동적 번역 갱신
  if (typeof updatePlanFeatures === 'function') {
    updatePlanFeatures(currentPlan);
  }

  // 11) 온라인 자습실 피어 카드 갱신
  if (typeof renderPeerGrid === 'function') {
    renderPeerGrid();
  }

  // 12) SNS 바이럴 카드 내부 텍스트 갱신
  const viralSpineAlignment = document.getElementById('viralSpineAlignment');
  const viralCervicalLoad = document.getElementById('viralCervicalLoad');
  const viralCardStreak = document.getElementById('viralCardStreak');
  if (viralSpineAlignment) viralSpineAlignment.textContent = t('viralSpineAlignment');
  if (viralCervicalLoad) viralCervicalLoad.textContent = t('viralCervicalLoad');
  if (viralCardStreak) viralCardStreak.textContent = t('viralCardStreak');

  // 13) PayPal SDK 언어 동기화 (언어 변경 시 페이팔 버튼 & 신용카드 폼 다국어 재로드)
  if (paypalConfig && paypalConfig.configured) {
    const targetLocale = getPayPalLocale();
    if (loadedPayPalLocale && loadedPayPalLocale !== targetLocale) {
      loadPayPalSdk(paypalConfig.clientId, currentCurrency, targetLocale);
    }
  }

  // 14) 온라인 자습실 헤더 및 상세 갱신
  if (typeof updateStudyRoomHeaderTexts === 'function') {
    updateStudyRoomHeaderTexts();
  }
}

window.updateDynamicTexts = updateDynamicTexts;

// 2. 하단 탭 내비게이션 전환
function switchTab(targetId) {
  const tabs = document.querySelectorAll('.nav-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(t => {
    if (t.getAttribute('data-target') === targetId) {
      t.classList.add('active', 'text-secondary');
      t.classList.remove('text-on-surface-variant');
    } else {
      t.classList.remove('active', 'text-secondary');
      t.classList.add('text-on-surface-variant');
    }
  });

  contents.forEach(c => {
    if (c.id === targetId) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
}

function initNavigationTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      switchTab(targetId);
    });
  });
}

// 3. Focus Timer 제어 (0초부터 누적 카운트업 HUD)
function initTimer() {
  const timerDisplay = document.getElementById('timerDisplay');
  const btnPausePlay = document.getElementById('btnPausePlay');
  const btnPauseText = document.getElementById('btnPauseText');
  const btnResetTimer = document.getElementById('btnResetTimer');
  const autoLockToggle = document.getElementById('autoLockToggle');
  const todayMinutesText = document.getElementById('todayMinutesText');
  const todayProgressText = document.getElementById('todayProgressText');
  const todayProgressBar = document.getElementById('todayProgressBar');

  function updateTimerDisplay() {
    const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
    const h = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(timerSeconds % 60).padStart(2, '0');
    const formatted = `${h}:${m}:${s}`;
    
    if (timerDisplay) timerDisplay.textContent = formatted;

    // 바이럴 모달 시간도 동기화
    const viralTimerTime = document.getElementById('viralTimerTime');
    if (viralTimerTime) viralTimerTime.textContent = formatted;

    // 일일 누적 집중 시간 및 프로그레스 바 연동 (5시간=18,000초 기준)
    if (todayMinutesText && todayProgressBar && todayProgressText) {
      const totalMins = Math.floor(timerSeconds / 60);
      const dispHours = Math.floor(totalMins / 60);
      const dispMins = totalMins % 60;
      todayMinutesText.textContent = `${dispHours}${t('unitHour')} ${dispMins}${t('unitMinute')}`;

      const pct = Math.min(100, Math.round((timerSeconds / (5 * 3600)) * 100));
      todayProgressText.textContent = `${pct}% ${t('hoursGoal')}`;
      todayProgressBar.style.width = `${pct}%`;
    }
  }

  // 1초 단위 타이머 인터벌
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (isTimerRunning) {
      timerSeconds++;
      updateTimerDisplay();
    }
  }, 1000);

  // 시작 / 일시정지 버튼
  if (btnPausePlay) {
    btnPausePlay.addEventListener('click', () => {
      isTimerRunning = !isTimerRunning;
      const icon = btnPausePlay.querySelector('.material-symbols-outlined');
      const t = (k) => window.i18n ? window.i18n.t(k) : k;

      if (isTimerRunning) {
        if (icon) icon.textContent = 'pause';
        if (btnPauseText) btnPauseText.textContent = t('btnPause');
        btnPausePlay.className = 'flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-900 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all';
      } else {
        if (icon) icon.textContent = 'play_arrow';
        if (btnPauseText) btnPauseText.textContent = timerSeconds === 0 ? t('btnStartStudy') : t('btnResume');
        btnPausePlay.className = 'flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-surface-container-highest border border-white/10 text-white font-bold text-sm hover:bg-surface-container-high transition-all';
      }
    });
  }

  // 초기화 버튼
  if (btnResetTimer) {
    btnResetTimer.addEventListener('click', () => {
      const t = (k) => window.i18n ? window.i18n.t(k) : k;
      if (timerSeconds > 0 && confirm(t('alertResetConfirm'))) {
        timerSeconds = 0;
        isTimerRunning = false;
        updateTimerDisplay();
        const icon = btnPausePlay.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'play_arrow';
        if (btnPauseText) btnPauseText.textContent = t('btnStartStudy');
        btnPausePlay.className = 'flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-900 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all';
      }
    });
  }

  if (autoLockToggle) {
    autoLockToggle.addEventListener('change', (e) => {
      autoLockEnabled = e.target.checked;
      console.log('[AutoLock] 자동 락다운 상태:', autoLockEnabled);
    });
  }

  updateTimerDisplay();
}

// 4. Edge AI 엔진 연동 및 카메라 전/후면 전환
async function initPostureEngine() {
  const video = document.getElementById('webcamVideo');
  const canvas = document.getElementById('poseCanvas');
  const btnWebcam = document.getElementById('btnToggleWebcam');
  const btnWebcamText = document.getElementById('btnWebcamText');
  const btnFlipCamera = document.getElementById('btnFlipCamera');
  const fpsDisplay = document.getElementById('fpsDisplay');

  postureEngine = new STAIPostureEngine();
  await postureEngine.init(video, canvas);

  // 실시간 계측 지표 업데이트 리스너
  postureEngine.onMetricsUpdate = (metrics) => {
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    // 1) HUD 텔레메트리 업데이트
    document.getElementById('hudNeckAngle').textContent = `${t('hudNeckTilt')} ${metrics.neckAngle}°`;
    document.getElementById('statNeckAngle').textContent = `${metrics.neckAngle}°`;
    document.getElementById('statShoulderAngle').textContent = `${metrics.shoulderAngle}°`;
    document.getElementById('statDistance').textContent = `${metrics.distanceCm} cm`;
    document.getElementById('hudDistance').textContent = `${t('hudDistance')} ${metrics.distanceCm}cm`;
    fpsDisplay.textContent = `${metrics.fps} FPS`;

    // 거리 판정 라벨 갱신
    const hudDistStatus = document.getElementById('hudDistanceStatus');
    if (hudDistStatus) {
      if (metrics.distanceCm < 42) {
        hudDistStatus.textContent = `• ${t('hudTooClose') || t('hudWarning')}`;
        hudDistStatus.className = 'text-[11px] text-amber-400 font-medium';
      } else if (metrics.distanceCm > 80) {
        hudDistStatus.textContent = `• ${t('hudTooFar') || t('hudWarning')}`;
        hudDistStatus.className = 'text-[11px] text-amber-400 font-medium';
      } else {
        hudDistStatus.textContent = `• ${t('hudDistanceOptimal')}`;
        hudDistStatus.className = 'text-[11px] text-on-surface-variant';
      }
    }

    // 2) 자세 등급 판정
    const statusLabel = document.getElementById('hudNeckStatus');
    const strainWeight = document.getElementById('postureStrainWeight');
    const coachTitle = document.getElementById('postureCoachTitle');
    const coachAdvice = document.getElementById('postureCoachAdvice');
    const coachBadge = document.getElementById('postureLevelBadge');
    const iconBox = document.getElementById('postureIconBox');

    // 경추 하중 계산 공식
    const calcWeight = Math.round(4.8 + (metrics.neckAngle / 45) * 17.2 * 10) / 10;
    strainWeight.textContent = `${t('cervicalStrain')}: ${calcWeight} kg`;

    // 척추 & 경추 해부학적 비주얼라이저 실시간 업데이트
    updateSpineVisualizer(metrics.neckAngle, metrics.shoulderAngle);

    if (metrics.postureLevel === 0) {
      statusLabel.textContent = `• ${t('hudNormal')}`;
      statusLabel.className = 'text-[11px] text-secondary font-medium';
      coachBadge.textContent = t('postureCoachBadgeGood');
      coachBadge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary font-bold';
      coachTitle.textContent = t('postureCoachTitleGood');
      coachAdvice.textContent = t('postureCoachAdviceGood');
      iconBox.className = 'w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary';
      iconBox.innerHTML = '<span class="material-symbols-outlined text-2xl">check_circle</span>';
      applyProgressiveBlur(0);
    } else if (metrics.postureLevel === 1) {
      statusLabel.textContent = `• ${t('hudWarning')}`;
      statusLabel.className = 'text-[11px] text-tertiary font-medium';
      coachBadge.textContent = t('postureCoachBadgeWarning');
      coachBadge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-tertiary/20 text-tertiary font-bold';
      coachTitle.textContent = t('postureCoachTitleWarning');
      coachAdvice.textContent = t('postureCoachAdviceWarning');
      iconBox.className = 'w-10 h-10 rounded-full bg-tertiary/15 flex items-center justify-center text-tertiary';
      iconBox.innerHTML = '<span class="material-symbols-outlined text-2xl">info</span>';
      applyProgressiveBlur(2);
    } else {
      statusLabel.textContent = `• ${t('hudWarning')}`;
      statusLabel.className = 'text-[11px] text-error font-medium animate-pulse';
      coachBadge.textContent = t('postureCoachBadgeWarning');
      coachBadge.className = 'text-xs px-2.5 py-0.5 rounded-full bg-error-container text-error font-bold';
      coachTitle.textContent = t('postureCoachTitleWarning');
      coachAdvice.textContent = t('postureCoachAdviceWarning');
      iconBox.className = 'w-10 h-10 rounded-full bg-error-container/60 flex items-center justify-center text-error animate-pulse';
      iconBox.innerHTML = '<span class="material-symbols-outlined text-2xl">warning</span>';
      
      if (autoLockEnabled) {
        applyProgressiveBlur(Math.min(16, metrics.neckAngle - 10));
      }
    }
  };

  // Continuous Temporal Buffer 이상 감지 이벤트 리스너
  postureEngine.onViolation = async (violation) => {
    const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
    const banner = document.getElementById('bufferWarningBanner');
    const bannerText = document.getElementById('bufferWarningText');

    let localizedMsg = violation.message;
    if (violation.type === 'FACE_MISSING_3S') {
      localizedMsg = t('violationFaceMissing');
    } else if (violation.type === 'SMARTPHONE_DETECTED') {
      const score = Math.round((violation.score || 0.8) * 100);
      localizedMsg = t('violationPhoneDetected', { score });
    }

    bannerText.textContent = localizedMsg;
    banner.classList.remove('hidden');

    setTimeout(() => {
      banner.classList.add('hidden');
    }, 4500);

    // 서버로 확정된 버퍼 로그 전송
    try {
      await fetch('/api/session/log-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: violation.type,
          durationMs: violation.durationMs || 3000,
          details: { message: localizedMsg }
        })
      });
    } catch (e) {
      console.warn('위반 로그 전송 대기:', e);
    }
  };

  // Continuous Temporal Buffer 얼굴 복귀 감지 이벤트 리스너
  postureEngine.onBufferRestore = () => {
    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    const banner = document.getElementById('bufferWarningBanner');
    const bannerText = document.getElementById('bufferWarningText');
    if (banner && bannerText) {
      bannerText.textContent = t('bufferReturnNotice');
      banner.classList.remove('hidden');
      setTimeout(() => {
        banner.classList.add('hidden');
      }, 2500);
    }
  };

  // 타이머 자동 일시정지/재개 콜백
  postureEngine.onTimerControl = (action) => {
    if (!autoLockEnabled) return;
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    if (action === 'pause') {
      isTimerRunning = false;
      document.getElementById('focusAccRate').textContent = t('guardPaused');
      document.getElementById('focusAccRate').className = 'text-error font-semibold font-mono';
    } else if (action === 'resume') {
      isTimerRunning = true;
      document.getElementById('focusAccRate').textContent = t('rateNormal');
      document.getElementById('focusAccRate').className = 'text-secondary font-semibold font-mono';
    }
  };

  // 웹캠 토글 버튼 이벤트
  btnWebcam.addEventListener('click', async () => {
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    if (!postureEngine.isWebcamActive) {
      btnWebcamText.textContent = 'Loading...';
      const result = await postureEngine.startWebcam();
      if (result.success) {
        btnWebcamText.textContent = t('btnWebcamStop');
        document.getElementById('videoFallback').classList.add('opacity-0');
        document.getElementById('aiStatusLabel').textContent = t('aiVisionActive');
      } else {
        btnWebcamText.textContent = t('btnWebcamStart');
      }
    } else {
      postureEngine.stopWebcam();
      btnWebcamText.textContent = t('btnWebcamStart');
      document.getElementById('videoFallback').classList.remove('opacity-0');
    }
  });

  // 전/후면 카메라 전환 버튼 이벤트 (모바일 최적화)
  if (btnFlipCamera) {
    btnFlipCamera.addEventListener('click', async () => {
      await postureEngine.flipCamera();
    });
  }

  // 초기 자동 시작 (실시간 시뮬레이션 지원)
  postureEngine.startSimulation();
}

// 5. 점진적 블러(Progressive Blur) 피드백 제어
function applyProgressiveBlur(px) {
  const workspace = document.getElementById('blurWorkspaceContent');
  if (workspace) {
    workspace.style.filter = `blur(${px}px)`;
    workspace.style.opacity = px > 8 ? '0.45' : '1';
  }
}

function initBlurWorkspaceSlider() {
  const slider = document.getElementById('blurSlider');
  const label = document.getElementById('blurValueLabel');
  if (slider && label) {
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      label.textContent = `${val}px`;
      applyProgressiveBlur(val);
    });
  }
}

// 척추 & 경추 & 양 팔(Arms) 해부학적 비주얼라이저 실시간 업데이트
function updateSpineVisualizer(neckAngle, shoulderAngle = 0) {
  const neckGroup = document.getElementById('spineVisualizerNeckGroup');
  const overlayText = document.getElementById('spineAngleOverlayText');
  const neckLine = document.getElementById('spineNeckLine');
  const headCircle = document.getElementById('spineHeadCircle');
  const gazeLine = document.getElementById('spineGazeLine');
  const dots = document.querySelectorAll('.spine-dot');
  const shoulderLine = document.getElementById('spineShoulderLine');

  if (!neckGroup) return;

  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;

  // 1) 경추 각도 회전 적용 (최대 45도 제한)
  const clampedAngle = Math.min(45, Math.max(-10, neckAngle));
  neckGroup.setAttribute('transform', `rotate(${clampedAngle}, 160, 115)`);

  // 2) 어깨 기울기 및 양 팔(Arms) 역학적 연동 애니메이션
  const sDelta = Math.min(12, Math.max(-12, shoulderAngle || 0));
  const leftShoulderY = 135 - sDelta;
  const rightShoulderY = 135 + sDelta;

  if (shoulderLine) {
    shoulderLine.setAttribute('y1', `${leftShoulderY}`);
    shoulderLine.setAttribute('y2', `${rightShoulderY}`);
  }

  const leftShoulderDot = document.getElementById('spineShoulderLeftDot');
  const rightShoulderDot = document.getElementById('spineShoulderRightDot');
  if (leftShoulderDot) leftShoulderDot.setAttribute('cy', `${leftShoulderY}`);
  if (rightShoulderDot) rightShoulderDot.setAttribute('cy', `${rightShoulderY}`);

  // 팔꿈치 및 손목(손) 90도 작업면 기구학 계산
  const leftElbowY = 165 - sDelta * 0.7;
  const rightElbowY = 165 + sDelta * 0.7;
  const leftHandY = 173 - sDelta * 0.4;
  const rightHandY = 173 + sDelta * 0.4;

  const armLeftUpper = document.getElementById('spineArmLeftUpper');
  const armLeftLower = document.getElementById('spineArmLeftLower');
  const elbowLeftDot = document.getElementById('spineElbowLeftDot');
  const handLeftDot = document.getElementById('spineHandLeftDot');

  const armRightUpper = document.getElementById('spineArmRightUpper');
  const armRightLower = document.getElementById('spineArmRightLower');
  const elbowRightDot = document.getElementById('spineElbowRightDot');
  const handRightDot = document.getElementById('spineHandRightDot');

  if (armLeftUpper) {
    armLeftUpper.setAttribute('y1', `${leftShoulderY}`);
    armLeftUpper.setAttribute('y2', `${leftElbowY}`);
  }
  if (elbowLeftDot) elbowLeftDot.setAttribute('cy', `${leftElbowY}`);
  if (armLeftLower) {
    armLeftLower.setAttribute('y1', `${leftElbowY}`);
    armLeftLower.setAttribute('y2', `${leftHandY}`);
  }
  if (handLeftDot) handLeftDot.setAttribute('cy', `${leftHandY}`);

  if (armRightUpper) {
    armRightUpper.setAttribute('y1', `${rightShoulderY}`);
    armRightUpper.setAttribute('y2', `${rightElbowY}`);
  }
  if (elbowRightDot) elbowRightDot.setAttribute('cy', `${rightElbowY}`);
  if (armRightLower) {
    armRightLower.setAttribute('y1', `${rightElbowY}`);
    armRightLower.setAttribute('y2', `${rightHandY}`);
  }
  if (handRightDot) handRightDot.setAttribute('cy', `${rightHandY}`);

  // 3) 색상 및 진단 상태 텍스트 (다국어 완전 연동)
  let color = '#34d399'; // Emerald
  let armStrokeColor = '#60a5fa';
  let handStrokeColor = '#93c5fd';
  let statusText = t('spineAngleOptimal', { angle: neckAngle });

  if (neckAngle > 22) {
    color = '#f87171'; // Red / Error
    armStrokeColor = '#f87171';
    handStrokeColor = '#fca5a5';
    statusText = t('spineAngleDanger', { angle: neckAngle });
  } else if (neckAngle > 14) {
    color = '#fbbf24'; // Amber / Warning
    armStrokeColor = '#fbbf24';
    handStrokeColor = '#fde047';
    statusText = t('spineAngleWarning', { angle: neckAngle });
  }

  if (overlayText) {
    overlayText.textContent = statusText;
    overlayText.setAttribute('fill', color);
  }
  if (neckLine) neckLine.setAttribute('stroke', color);
  if (headCircle) {
    headCircle.setAttribute('stroke', color);
    headCircle.setAttribute('fill', `${color}25`);
  }
  if (gazeLine) gazeLine.setAttribute('stroke', color);
  dots.forEach(d => d.setAttribute('fill', color));

  // 팔 및 관절 색상 동적 반영
  if (armLeftUpper) armLeftUpper.setAttribute('stroke', armStrokeColor);
  if (armRightUpper) armRightUpper.setAttribute('stroke', armStrokeColor);
  if (elbowLeftDot) elbowLeftDot.setAttribute('fill', armStrokeColor);
  if (elbowRightDot) elbowRightDot.setAttribute('fill', armStrokeColor);
  if (armLeftLower) armLeftLower.setAttribute('stroke', handStrokeColor);
  if (armRightLower) armRightLower.setAttribute('stroke', handStrokeColor);
  if (handLeftDot) handLeftDot.setAttribute('fill', handStrokeColor);
  if (handRightDot) handRightDot.setAttribute('fill', handStrokeColor);
}

// 10초 리셋 스트레칭 인터랙티브 타이머 (다국어 연동)
function initStretchGuide() {
  const btn = document.getElementById('btnStart10sStretch');
  const label = document.getElementById('btn10sStretchLabel');
  if (!btn || !label) return;

  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
  let timer = null;

  btn.addEventListener('click', () => {
    if (timer) return;
    let count = 10;
    btn.disabled = true;
    btn.classList.add('opacity-80', 'cursor-not-allowed');
    label.dataset.stretchingActive = 'true';

    label.textContent = t('stretchingProgress', { count });

    if (navigator.vibrate) {
      try { navigator.vibrate(100); } catch(e){}
    }

    timer = setInterval(() => {
      count--;
      if (count > 0) {
        label.textContent = t('stretchingProgress', { count });
      } else {
        clearInterval(timer);
        timer = null;
        label.textContent = t('stretchingDone');
        if (navigator.vibrate) {
          try { navigator.vibrate([100, 50, 100]); } catch(e){}
        }

        setTimeout(() => {
          label.dataset.stretchingActive = 'false';
          label.textContent = t('btnStretchStart');
          btn.disabled = false;
          btn.classList.remove('opacity-80', 'cursor-not-allowed');
        }, 3000);
      }
    }, 1000);
  });
}

// 6. 세션 통계 및 연속 스트릭 로드
async function loadSessionStats() {
  try {
    const res = await fetch('/api/session/stats');
    const data = await res.json();
    const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;

    if (data.freezeShields !== undefined) {
      currentFreezeShields = data.freezeShields;
    }

    document.getElementById('headerStreak').textContent = t('streakBadge', { days: data.streakDays });
    document.getElementById('shieldCountBadge').textContent = t('shieldRemaining', { count: currentFreezeShields });
    document.getElementById('sessionTrustScore').textContent = `${t('trustScoreLabel')} ${data.trustScore}%`;

    const hours = Math.floor(data.todayFocusMinutes / 60);
    const mins = data.todayFocusMinutes % 60;
    document.getElementById('todayMinutesText').textContent = `${hours}${t('unitHour')} ${mins}${t('unitMinute')}`;

    const progressPct = Math.min(100, Math.round((data.todayFocusMinutes / 300) * 100));
    document.getElementById('todayProgressText').textContent = `${progressPct}% ${t('hoursGoal')}`;
    document.getElementById('todayProgressBar').style.width = `${progressPct}%`;

    // 7일 캘린더 잔디 렌더링 (다국어 연동)
    if (data.history) {
      lastHistoryData = data.history;
      renderCalendarHistory(data.history);
    }

    // 防凍護盾 사용 버튼
    const btnUseShield = document.getElementById('btnUseShield');
    const btnShieldQuick = document.getElementById('btnShieldQuick');

    const triggerShield = async () => {
      try {
        const sRes = await fetch('/api/session/shield/use', { method: 'POST' });
        const sData = await sRes.json();
        if (sData.success) {
          currentFreezeShields = sData.remainingShields;
          alert(t('alertShieldSuccess', { count: sData.remainingShields }));
          document.getElementById('shieldCountBadge').textContent = t('shieldRemaining', { count: currentFreezeShields });
        } else {
          alert(sData.error || t('shieldInsufficient'));
          openPayPalModal();
        }
      } catch (e) {
        alert(t('shieldInsufficient'));
      }
    };

    if (btnUseShield) btnUseShield.addEventListener('click', triggerShield);
    if (btnShieldQuick) btnShieldQuick.addEventListener('click', triggerShield);

  } catch (err) {
    console.warn('세션 통계 조회 실패:', err);
  }
}

// 7. 모바일 카메라 연결 QR 모달 제어
function initMobileModal() {
  const modal = document.getElementById('mobileModal');
  const btnOpen = document.getElementById('btnOpenMobileModal');
  const btnClose = document.getElementById('btnCloseMobileModal');
  const btnClose2 = document.getElementById('btnCloseMobileModal2');
  const btnCopy = document.getElementById('btnCopyMobileUrl');
  const qrImg = document.getElementById('mobileQrImg');
  const urlText = document.getElementById('mobileUrlText');

  const openMobile = async () => {
    modal.classList.remove('hidden');
    try {
      const res = await fetch('/api/mobile/network-info');
      const data = await res.json();
      qrImg.src = data.qrDataUrl;
      urlText.textContent = data.preferredMobileUrl;
      urlText.setAttribute('data-full-url', data.preferredMobileUrl);
    } catch (e) {
      urlText.textContent = window.location.href;
    }
  };

  const closeMobile = () => modal.classList.add('hidden');

  if (btnOpen) btnOpen.addEventListener('click', openMobile);
  if (btnClose) btnClose.addEventListener('click', closeMobile);
  if (btnClose2) btnClose2.addEventListener('click', closeMobile);

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const fullUrl = urlText.getAttribute('data-full-url') || urlText.textContent;
      navigator.clipboard.writeText(fullUrl).then(() => {
        btnCopy.textContent = window.i18n ? window.i18n.t('mobileCopiedBtn') : '✓ 복사됨!';
        setTimeout(() => {
          btnCopy.textContent = window.i18n ? window.i18n.t('mobileCopyBtn') : '복사';
        }, 2000);
      });
    });
  }
}

// 8. PayPal 모달 및 결제 초기화 (월간/연간 주기 & 3가지 플랜 & 변조 방지)
function initPayPalModal() {
  const modal = document.getElementById('paypalModal');
  const btnClose = document.getElementById('btnCloseModal');
  const btnOpen1 = document.getElementById('btnOpenUpgradeModal');
  const btnOpen2 = document.getElementById('btnOpenUpgradeModal2');
  const btnModalQuickLogin = document.getElementById('btnModalQuickLogin');
  const btnCycleMonthly = document.getElementById('btnCycleMonthly');
  const btnCycleYearly = document.getElementById('btnCycleYearly');

  const openModal = () => {
    modal.classList.remove('hidden');
    updatePaymentAuthNotice();
    updatePlanFeatures(currentPlan);
    ensurePayPalSdkWithLocale();
  };
  const closeModal = () => modal.classList.add('hidden');

  if (btnOpen1) btnOpen1.addEventListener('click', openModal);
  if (btnOpen2) btnOpen2.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);

  if (btnModalQuickLogin) {
    btnModalQuickLogin.addEventListener('click', () => {
      closeModal();
      const authModal = document.getElementById('authModal');
      if (authModal) authModal.classList.remove('hidden');
    });
  }

  // 결제 주기 토글 (월간 vs 연간)
  if (btnCycleMonthly && btnCycleYearly) {
    btnCycleMonthly.addEventListener('click', () => {
      currentBillingCycle = 'monthly';
      btnCycleMonthly.classList.add('active', 'bg-indigo-600', 'text-white');
      btnCycleMonthly.classList.remove('text-on-surface-variant');
      btnCycleYearly.classList.remove('active', 'bg-indigo-600', 'text-white');
      btnCycleYearly.classList.add('text-on-surface-variant');
      updateModalCurrencyPrices();
      updatePlanFeatures(currentPlan);
    });

    btnCycleYearly.addEventListener('click', () => {
      currentBillingCycle = 'yearly';
      btnCycleYearly.classList.add('active', 'bg-indigo-600', 'text-white');
      btnCycleYearly.classList.remove('text-on-surface-variant');
      btnCycleMonthly.classList.remove('active', 'bg-indigo-600', 'text-white');
      btnCycleMonthly.classList.add('text-on-surface-variant');
      updateModalCurrencyPrices();
      updatePlanFeatures(currentPlan);
    });
  }

  // 모달 통화 토글 (USD vs TWD)
  const currBtns = document.querySelectorAll('.modal-curr-btn');
  currBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currBtns.forEach(b => {
        b.classList.remove('active', 'bg-indigo-600', 'text-white');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('active', 'bg-indigo-600', 'text-white');
      btn.classList.remove('text-on-surface-variant');

      currentCurrency = btn.getAttribute('data-curr');
      updateModalCurrencyPrices();
      updatePlanFeatures(currentPlan);

      if (paypalConfig && paypalConfig.configured) {
        loadPayPalSdk(paypalConfig.clientId, currentCurrency);
      }
    });
  });

  // 초기 통화 UI 상태 동기화 (대만일 경우 TWD 기본 활성화)
  currBtns.forEach(b => {
    if (b.getAttribute('data-curr') === currentCurrency) {
      b.classList.add('active', 'bg-indigo-600', 'text-white');
      b.classList.remove('text-on-surface-variant');
    } else {
      b.classList.remove('active', 'bg-indigo-600', 'text-white');
      b.classList.add('text-on-surface-variant');
    }
  });
  updateModalCurrencyPrices();

  // 3가지 플랜 선택 카드 (Starter, Pro, Clinic)
  const planOptions = document.querySelectorAll('.plan-option');
  planOptions.forEach(card => {
    card.addEventListener('click', () => {
      planOptions.forEach(c => {
        c.classList.remove('selected', 'border-indigo-500', 'bg-surface-container-highest', 'border-2');
        c.classList.add('border-white/5', 'bg-surface-container');
      });
      card.classList.add('selected', 'border-indigo-500', 'bg-surface-container-highest', 'border-2');
      card.classList.remove('border-white/5');
      currentPlan = card.getAttribute('data-plan');
      updatePlanFeatures(currentPlan);
    });
  });
}

function updatePaymentAuthNotice() {
  const notice = document.getElementById('paymentAuthNotice');
  if (!notice) return;
  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
  const token = localStorage.getItem('stai_token');
  if (token && currentUser) {
    notice.className = 'p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 mb-3 flex items-center justify-between';
    notice.innerHTML = `<span>${t('paypalNoticeBound', { email: currentUser.email })}</span>`;
  } else {
    notice.className = 'p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 mb-3 flex items-center justify-between';
    notice.innerHTML = `<span>${t('paypalNoticeGuest')}</span><button id="btnModalQuickLogin" class="underline font-bold shrink-0 ml-2">${t('btnModalQuickLogin')}</button>`;
    const btn = document.getElementById('btnModalQuickLogin');
    if (btn) {
      btn.onclick = () => {
        document.getElementById('paypalModal').classList.add('hidden');
        document.getElementById('authModal').classList.remove('hidden');
      };
    }
  }
}

function updateModalCurrencyPrices() {
  const isUSD = currentCurrency === 'USD';
  const isYearly = currentBillingCycle === 'yearly';

  document.querySelectorAll('.plan-option').forEach(card => {
    const priceEl = card.querySelector('.plan-price');
    if (!priceEl) return;
    if (isUSD) {
      priceEl.textContent = isYearly ? priceEl.getAttribute('data-usd-y') : priceEl.getAttribute('data-usd-m');
    } else {
      priceEl.textContent = isYearly ? priceEl.getAttribute('data-twd-y') : priceEl.getAttribute('data-twd-m');
    }
  });
}

function updatePlanFeatures(planId) {
  const t = (k) => window.i18n ? window.i18n.t(k) : k;
  const title = document.getElementById('planFeatureTitle');
  const summary = document.getElementById('planBillingSummary');
  const list = document.getElementById('planFeatureList');
  if (!title || !list) return;

  const cycleText = currentBillingCycle === 'yearly' ? t('billingYearlySummary') : t('billingMonthlySummary');
  if (summary) summary.textContent = cycleText;

  if (planId === 'starter') {
    title.textContent = t('planFeatureTitleStarter');
    list.innerHTML = `
      <li class="flex items-center gap-1.5 text-white">✓ ${t('featStarter1')}</li>
      <li class="flex items-center gap-1.5 text-white">✓ ${t('featStarter2')}</li>
      <li class="flex items-center gap-1.5 text-white">✓ ${t('featStarter3')}</li>
      <li class="flex items-center gap-1.5 text-on-surface-variant">✕ ${t('featStarter4')}</li>
    `;
  } else if (planId === 'clinic') {
    title.textContent = t('planFeatureTitleClinic');
    list.innerHTML = `
      <li class="flex items-center gap-1.5 text-white">✓ ${t('featClinic1')}</li>
      <li class="flex items-center gap-1.5 text-white">✓ ${t('featClinic2')}</li>
      <li class="flex items-center gap-1.5 text-white">✓ ${t('featClinic3')}</li>
      <li class="flex items-center gap-1.5 text-white">✓ ${t('featClinic4')}</li>
    `;
  } else {
    title.textContent = t('planFeatureTitlePro');
    list.innerHTML = `
      <li class="flex items-center gap-1.5 text-white">${t('featLandmarks')}</li>
      <li class="flex items-center gap-1.5 text-white">${t('featDebounce')}</li>
      <li class="flex items-center gap-1.5 text-white">${t('featPhone')}</li>
      <li class="flex items-center gap-1.5 text-white">${t('featTimelapse')}</li>
      <li class="flex items-center gap-1.5 text-white">${t('featShields')}</li>
    `;
  }
}

async function initPayPalConfig() {
  try {
    const res = await fetch('/api/config/paypal');
    paypalConfig = await res.json();

    if (paypalConfig.configured) {
      loadPayPalSdk(paypalConfig.clientId, currentCurrency);
    } else {
      document.getElementById('paypal-button-container').innerHTML = `
        <button id="btnMockQuickPay" class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-all">
          🚀 1초 시뮬레이션 결제 (개발 모드)
        </button>
      `;
      document.getElementById('btnMockQuickPay').onclick = runQuickMockPay;
    }
  } catch (e) {
    console.error('PayPal 설정 조회 실패:', e);
  }
}

function getPayPalLocale() {
  const lang = window.i18n ? window.i18n.currentLang : (localStorage.getItem('stai_lang') || 'zh-TW');
  if (lang === 'zh-TW') return 'zh_TW';
  if (lang === 'en') return 'en_US';
  return 'ko_KR';
}

function ensurePayPalSdkWithLocale() {
  if (!paypalConfig || !paypalConfig.configured) return;
  const targetLocale = getPayPalLocale();
  if (loadedPayPalLocale !== targetLocale) {
    loadPayPalSdk(paypalConfig.clientId, currentCurrency, targetLocale);
  }
}

function loadPayPalSdk(clientId, currency, locale = null) {
  const targetLocale = locale || getPayPalLocale();
  loadedPayPalLocale = targetLocale;
  const t = (k) => window.i18n ? window.i18n.t(k) : k;
  const existingScript = document.getElementById('paypal-sdk-script');
  if (existingScript) existingScript.remove();

  const container = document.getElementById('paypal-button-container');
  if (container) {
    container.innerHTML = `<div class="text-xs text-on-surface-variant text-center py-2">${t('paypalLoadingText')}</div>`;
  }

  const script = document.createElement('script');
  script.id = 'paypal-sdk-script';
  // locale 파라미터를 추가하여 PayPal 직불/신용카드 버튼 및 팝업 폼 언어를 웹사이트 언어(대만 번체, 영어, 한국어)와 일치시킴
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture&locale=${targetLocale}`;
  script.onload = () => {
    if (container) container.innerHTML = '';
    renderPayPalButtons();
  };
  script.onerror = () => {
    if (container) {
      container.innerHTML = `<div class="text-xs text-error text-center">${t('paypalSdkLoadError')}</div>`;
    }
  };
  document.head.appendChild(script);
}

function renderPayPalButtons() {
  if (!window.paypal || !window.paypal.Buttons) return;

  const container = document.getElementById('paypal-button-container');
  container.innerHTML = '';

  paypalButtonsInstance = window.paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal',
      height: 44
    },
    createOrder: async () => {
      const token = localStorage.getItem('stai_token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          planId: currentPlan,
          cycle: currentBillingCycle,
          currency: currentCurrency
        })
      });
      const orderData = await response.json();
      return orderData.id;
    },
    onApprove: async (data) => {
      const token = localStorage.getItem('stai_token');
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ planId: currentPlan })
      });
      const captureData = await response.json();
      if (captureData.success) {
        if (captureData.token) {
          localStorage.setItem('stai_token', captureData.token);
        }
        if (captureData.user) {
          currentUser = captureData.user;
        }
        const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
        alert(t('paypalPaymentSuccess', { plan: (captureData.plan || currentPlan).toUpperCase() }));
        const badge = document.getElementById('headerPlanBadge');
        if (badge) badge.textContent = t('proActive');
        document.getElementById('paypalModal').classList.add('hidden');
        await checkAuthStatus();
        await loadSessionStats();
      }
    }
  });

  paypalButtonsInstance.render('#paypal-button-container');
}

async function runQuickMockPay() {
  const token = localStorage.getItem('stai_token');
  const resOrder = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      planId: currentPlan,
      cycle: currentBillingCycle,
      currency: currentCurrency
    })
  });
  const order = await resOrder.json();

  const resCap = await fetch(`/api/orders/${order.id}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ planId: currentPlan })
  });
  const cap = await resCap.json();

  if (cap.success) {
    const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
    alert(t('paypalPaymentSuccess', { plan: currentPlan.toUpperCase() }));
    document.getElementById('headerPlanBadge').textContent = t('proActive');
    document.getElementById('paypalModal').classList.add('hidden');
    await checkAuthStatus();
    await loadSessionStats();
  }
}

// 9. 간편 이메일 로그인 / 회원가입 제어 (Auth Modal)
function initAuthModal() {
  const modal = document.getElementById('authModal');
  const btnOpen = document.getElementById('btnOpenAuthModal');
  const btnClose = document.getElementById('btnCloseAuthModal');
  const tabLogin = document.getElementById('tabAuthLogin');
  const tabRegister = document.getElementById('tabAuthRegister');
  const nameField = document.getElementById('authNameField');
  const form = document.getElementById('authForm');
  const btnSubmit = document.getElementById('btnSubmitAuth');
  const btnQuickDemo = document.getElementById('btnQuickDemoLogin');
  const modalTitle = document.getElementById('authModalTitle');

  let mode = 'login'; // 'login' | 'register'

  const openModal = () => {
    modal.classList.remove('hidden');
    if (window.i18n) window.i18n.applyTranslations();
    const t = (k) => window.i18n ? window.i18n.t(k) : k;
    if (mode === 'login') {
      btnSubmit.textContent = t('btnSubmitLogin');
      modalTitle.querySelector('span:last-child').textContent = t('authModalTitle');
    } else {
      btnSubmit.textContent = t('btnSubmitRegister');
      modalTitle.querySelector('span:last-child').textContent = t('authModalRegisterTitle');
    }
  };
  const closeModal = () => modal.classList.add('hidden');

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
      mode = 'login';
      const t = (k) => window.i18n ? window.i18n.t(k) : k;
      tabLogin.className = 'py-1.5 rounded-lg bg-indigo-600 text-white';
      tabRegister.className = 'py-1.5 rounded-lg text-on-surface-variant hover:text-white';
      nameField.classList.add('hidden');
      btnSubmit.textContent = t('btnSubmitLogin');
      modalTitle.querySelector('span:last-child').textContent = t('authModalTitle');
    });

    tabRegister.addEventListener('click', () => {
      mode = 'register';
      const t = (k) => window.i18n ? window.i18n.t(k) : k;
      tabRegister.className = 'py-1.5 rounded-lg bg-indigo-600 text-white';
      tabLogin.className = 'py-1.5 rounded-lg text-on-surface-variant hover:text-white';
      nameField.classList.remove('hidden');
      btnSubmit.textContent = t('btnSubmitRegister');
      modalTitle.querySelector('span:last-child').textContent = t('authModalRegisterTitle');
    });
  }

  // 폼 제출
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
      const email = document.getElementById('authEmail').value;
      const password = document.getElementById('authPassword').value;
      const name = document.getElementById('authName')?.value;

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('stai_token', data.token);
          currentUser = data.user;
          updateAuthUI(data.user);
          closeModal();
          alert(t('alertLoginSuccess', { name: data.user.name || data.user.email }));
          await loadSessionStats();
        } else {
          alert(data.error || t('authFailed'));
        }
      } catch (err) {
        alert(t('serverError'));
      }
    });
  }

  // 1초 데모 계정 체험
  if (btnQuickDemo) {
    btnQuickDemo.addEventListener('click', async () => {
      const t = (k) => window.i18n ? window.i18n.t(k) : k;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo@stai.focus', password: 'demo1234' })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('stai_token', data.token);
          currentUser = data.user;
          updateAuthUI(data.user);
          closeModal();
          alert(t('alertDemoSuccess'));
          await loadSessionStats();
        }
      } catch (err) {
        console.warn('데모 로그인 실패:', err);
      }
    });
  }
}

async function checkAuthStatus() {
  const token = localStorage.getItem('stai_token');
  if (!token) return;

  try {
    const res = await fetch('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      updateAuthUI(data.user);
    }
  } catch (err) {
    console.warn('인증 세션 복원 실패:', err);
  }
}

function updateAuthUI(user) {
  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
  const headerUserLabel = document.getElementById('headerUserLabel');
  const btnOpenAuth = document.getElementById('btnOpenAuthModal');
  const headerPlan = document.getElementById('headerPlanBadge');

  if (user && headerUserLabel) {
    const shortEmail = user.email.length > 14 ? user.email.slice(0, 12) + '..' : user.email;
    headerUserLabel.textContent = `${user.name || shortEmail}`;
    if (btnOpenAuth) {
      btnOpenAuth.title = `${user.email} (${t('logoutConfirm', { email: user.email })})`;
      btnOpenAuth.onclick = () => {
        if (confirm(t('logoutConfirm', { email: user.email }))) {
          localStorage.removeItem('stai_token');
          currentUser = null;
          headerUserLabel.textContent = t('loginBtn');
          window.location.reload();
        }
      };
    }
    if (headerPlan && user.plan) {
      headerPlan.textContent = user.plan.toUpperCase();
    }
  } else if (headerUserLabel) {
    headerUserLabel.textContent = t('loginBtn');
  }
}

// 10. SNS 바이럴 스튜디오 모달 (9:16 Shorts / Reels Canvas 생성기)
function initViralModal() {
  const modal = document.getElementById('viralModal');
  const btnOpen = document.getElementById('btnOpenViralModal');
  const btnClose = document.getElementById('btnCloseViralModal');
  const btnDownload = document.getElementById('btnDownloadViralImage');
  const btnShare = document.getElementById('btnShareViralWeb');
  const btnTimelapse = document.getElementById('btnExportTimelapseClip');
  const viralDate = document.getElementById('viralCardDate');
  const viralTimer = document.getElementById('viralTimerTime');

  const openModal = () => {
    modal.classList.remove('hidden');
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    if (viralDate) viralDate.textContent = dateStr;
    const currentTimerStr = document.getElementById('timerDisplay')?.textContent || '00:00:00';
    if (viralTimer) viralTimer.textContent = currentTimerStr;
  };
  const closeModal = () => modal.classList.add('hidden');

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);

  // 9:16 고해상도 Canvas 렌더링 & 이미지 다운로드
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 1) 배경 그라데이션
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 글로우 원형 이펙트
      const radial = ctx.createRadialGradient(540, 960, 50, 540, 960, 600);
      radial.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1080, 1920);

      // 테두리 프레임
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 12;
      ctx.strokeRect(60, 60, 960, 1800);

      // 헤더: DEEPFOCUS AI
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('DEEPFOCUS AI', 120, 180);

      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '32px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(dateStr, 960, 180);
      ctx.textAlign = 'left';

      // 메인 타이틀
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(t('viralCardHeader'), 120, 320);

      // 뱃지: 연속 18일
      ctx.fillStyle = 'rgba(234, 88, 12, 0.25)';
      ctx.fillRect(120, 360, 480, 70);
      ctx.fillStyle = '#fb923c';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`🔥 ${t('streakHeroTitle', { days: 18 })}`, 140, 410);

      // 대형 타이머 숫자
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('PURE FOCUS TIME', 120, 800);

      const timerText = document.getElementById('timerDisplay')?.textContent || '01:42:18';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 150px monospace';
      ctx.fillText(timerText, 120, 960);

      // 척추 정렬 스탬프
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fillRect(120, 1030, 840, 110);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(`✓ ${t('viralSpineAlignment')} • ${t('viralCervicalLoad')}`, 160, 1100);

      // 랭킹 섹션
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(t('viralRankingLabel'), 120, 1380);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 76px monospace';
      ctx.fillText(t('viralRankingValue'), 120, 1480);

      // 하단 워터마크
      ctx.fillStyle = '#64748b';
      ctx.font = '32px sans-serif';
      ctx.fillText('Zero-Trust Edge Biometrics AI', 120, 1780);
      ctx.textAlign = 'right';
      ctx.fillText('deepfocus.ai', 960, 1780);

      // 파일 다운로드 트리거
      const link = document.createElement('a');
      link.download = `DeepFocus_Shorts_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  // Web Share API 연동
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
      const timerText = document.getElementById('timerDisplay')?.textContent || '01:42:18';
      const shareData = {
        title: t('shareTitle'),
        text: t('shareText', { time: timerText }),
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (e) {
          console.log('공유 취소됨');
        }
      } else {
        navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert(t('alertShareCopied'));
      }
    });
  }

  // 10초 타임랩스 비디오 렌더링 내보내기
  if (btnTimelapse) {
    btnTimelapse.addEventListener('click', () => {
      const t = (k) => window.i18n ? window.i18n.t(k) : k;
      alert(t('alertTimelapseCreated'));
    });
  }
}

// ==============================================================
// 10. 7일 캘린더 다국어 렌더러 (Mon ~ Sun)
// ==============================================================
let lastHistoryData = null;

function renderCalendarHistory(history) {
  const calGrid = document.getElementById('weekCalendarGrid');
  if (!calGrid || !history) return;
  const t = (k) => window.i18n ? window.i18n.t(k) : k;

  calGrid.innerHTML = '';
  const dayKeys = ['daysMon', 'daysTue', 'daysWed', 'daysThu', 'daysFri', 'daysSat', 'daysSun'];
  history.forEach((item, idx) => {
    const isShield = item.status === 'shield_used';
    const isSuccess = item.status === 'success';
    const bgClass = isSuccess ? 'bg-secondary/25 border-secondary/40 text-secondary' :
                    isShield ? 'bg-amber-400/25 border-amber-400/40 text-amber-300' :
                    'bg-surface-container border-white/5 text-on-surface-variant';

    const dayName = t(dayKeys[idx]) || 'Day';
    const dayCol = document.createElement('div');
    dayCol.className = `p-2 rounded-xl border flex flex-col items-center justify-center text-center ${bgClass}`;
    dayCol.innerHTML = `
      <span class="text-[10px] text-on-surface-variant mb-1 font-mono">${dayName}</span>
      <span class="text-xs font-bold font-mono">${Math.round(item.minutes / 60)}h</span>
      <span class="text-[9px] mt-0.5">${isShield ? '🛡️' : '✓'}</span>
    `;
    calGrid.appendChild(dayCol);
  });
}

function refreshCalendarDayNames() {
  if (lastHistoryData) {
    renderCalendarHistory(lastHistoryData);
  }
}

// ==============================================================
// 11. 3단계 앱 사용 가이드 모달 (Guide Modal) 제어
// ==============================================================
function initGuideModal() {
  const modal = document.getElementById('guideModal');
  const btnOpen = document.getElementById('btnOpenGuideModal');
  const brandLogo = document.getElementById('brandLogoContainer');
  const btnClose = document.getElementById('btnCloseGuideModal');
  const btnDismiss = document.getElementById('btnDismissGuideModal');

  const openModal = () => {
    if (modal) {
      modal.classList.remove('hidden');
      if (window.i18n) window.i18n.applyTranslations();
    }
  };

  const closeModal = () => {
    if (modal) modal.classList.add('hidden');
  };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (brandLogo) brandLogo.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnDismiss) btnDismiss.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

// ==============================================================
// 12. 맞춤형 공부/독서 목표 및 D-Day 설정 모달 제어
// ==============================================================
function initGoalCustomizer() {
  const modal = document.getElementById('goalModal');
  const btnOpenGoal = document.getElementById('btnOpenGoalModal');
  const btnOpenDday = document.getElementById('btnOpenDdayModal');
  const btnClose = document.getElementById('btnCloseGoalModal');
  const goalForm = document.getElementById('goalForm');
  const inputTaskName = document.getElementById('inputTaskName');
  const inputTaskGoal = document.getElementById('inputTaskGoal');
  const displayTaskName = document.getElementById('displayTaskName');
  const displayTaskGoal = document.getElementById('displayTaskGoal');

  const openModal = () => {
    if (modal) {
      const currentName = localStorage.getItem('stai_task_name') || (displayTaskName ? displayTaskName.textContent : '');
      const currentGoal = localStorage.getItem('stai_task_goal') || (displayTaskGoal ? displayTaskGoal.textContent : '');
      if (inputTaskName) inputTaskName.value = currentName.trim();
      if (inputTaskGoal) inputTaskGoal.value = currentGoal.trim();
      modal.classList.remove('hidden');
    }
  };

  const closeModal = () => {
    if (modal) modal.classList.add('hidden');
  };

  if (btnOpenGoal) btnOpenGoal.addEventListener('click', openModal);
  if (btnOpenDday) btnOpenDday.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (goalForm) {
    goalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = inputTaskName.value.trim();
      const newGoal = inputTaskGoal.value.trim();
      if (newName) {
        localStorage.setItem('stai_task_name', newName);
        if (displayTaskName) displayTaskName.textContent = newName;
      }
      if (newGoal) {
        localStorage.setItem('stai_task_goal', newGoal);
        if (displayTaskGoal) displayTaskGoal.textContent = newGoal;
      }
      closeModal();
    });
  }
}

// ==============================================================
// ==============================================================
// 13. 온라인 자습실 (Study Room) & 동료 인터랙션 & 방 만들기/초대
// ==============================================================
const BUILTIN_STUDY_ROOMS = [
  {
    id: 1,
    code: 'STAI-0001',
    titleKey: 'room1Title',
    descKey: 'room1Desc',
    count: 342,
    category: 'exam',
    peers: [
      { id: 'p1_1', name: '陳韋廷 (Chen W.T.)', org: '國立臺灣大學 • 醫學系', mins: 245, posture: 97, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
      { id: 'p1_2', name: '김민수 (Kim M.S.)', org: '서울대학교 • 로스쿨 2기', mins: 195, posture: 95, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
      { id: 'p1_3', name: '林佳萱 (Lin C.H.)', org: '國立政治大學 • 法律研究所', mins: 310, posture: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80' },
      { id: 'p1_4', name: '박지훈 (Park J.H.)', org: 'KAIST • 인공지능대학원', mins: 165, posture: 93, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80' }
    ]
  },
  {
    id: 2,
    code: 'STAI-0002',
    titleKey: 'room2Title',
    descKey: 'room2Desc',
    count: 289,
    category: 'dev',
    peers: [
      { id: 'p2_1', name: 'Kenji Sato', org: '東京大学 • 情報理工学', mins: 215, posture: 96, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80' },
      { id: 'p2_2', name: 'Sarah Jenkins', org: 'Stanford CS • AI Lab', mins: 285, posture: 97, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80' },
      { id: 'p2_3', name: '이동현 (Lee D.H.)', org: '카카오 • 백엔드 시스템', mins: 180, posture: 92, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80' },
      { id: 'p2_4', name: 'Alex Wang', org: 'TSMC • AI Compiler', mins: 330, posture: 99, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80' }
    ]
  },
  {
    id: 3,
    code: 'STAI-0003',
    titleKey: 'room3Title',
    descKey: 'room3Desc',
    count: 512,
    category: 'exam',
    peers: [
      { id: 'p3_1', name: '최유진 (Choi Y.J.)', org: '연세대학교 • 의예과 본과', mins: 385, posture: 98, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80' },
      { id: 'p3_2', name: '張宇廷 (Chang Y.T.)', org: '國立陽明交通大學 • 醫學系', mins: 345, posture: 96, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80' },
      { id: 'p3_3', name: '정재원 (Jung J.W.)', org: '가톨릭대학교 • 의과대학', mins: 415, posture: 97, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80' },
      { id: 'p3_4', name: '黃柏鈞 (Huang P.C.)', org: '國立成功大學 • 牙醫系', mins: 295, posture: 95, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80' }
    ]
  },
  {
    id: 4,
    code: 'STAI-0004',
    titleKey: 'room4Title',
    descKey: 'room4Desc',
    count: 198,
    category: 'general',
    peers: [
      { id: 'p4_1', name: 'Daniel Miller', org: 'LSE • Finance & Econ', mins: 125, posture: 95, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
      { id: 'p4_2', name: '송민경 (Song M.K.)', org: '행정고시(5급 공채) • 재경직', mins: 120, posture: 94, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80' },
      { id: 'p4_3', name: 'Emma Watson-Lee', org: 'Columbia Law • 1L Sprint', mins: 110, posture: 96, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80' },
      { id: 'p4_4', name: '吳廷安 (Wu T.A.)', org: '國立清華大學 • 電機工程', mins: 135, posture: 98, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' }
    ]
  }
];

// 사용자가 직접 개설한 커스텀 자습실 목록 (LocalStorage 저장)
let customStudyRooms = [];
try {
  const saved = localStorage.getItem('stai_custom_rooms');
  if (saved) customStudyRooms = JSON.parse(saved);
} catch (e) {
  console.warn('커스텀 자습실 로드 실패:', e);
}

function getAllStudyRooms() {
  return [...customStudyRooms, ...BUILTIN_STUDY_ROOMS];
}

function getCurrentRoom() {
  const all = getAllStudyRooms();
  return all.find(r => String(r.id) === String(currentRoomId)) || BUILTIN_STUDY_ROOMS[0];
}

function getRoomInviteUrl(roomId) {
  const origin = window.location.origin;
  const path = window.location.pathname;
  return `${origin}${path}?room=${encodeURIComponent(roomId)}`;
}

function updateStudyRoomHeaderTexts() {
  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
  const room = getCurrentRoom();
  const titleEl = document.getElementById('roomOnlineTitle');
  const descEl = document.getElementById('roomOnlineDesc');
  const countEl = document.getElementById('roomOnlineCount');

  if (titleEl) {
    titleEl.textContent = room.isCustom ? room.title : t(room.titleKey);
  }
  if (descEl) {
    descEl.textContent = room.isCustom ? room.desc : t(room.descKey);
  }
  if (countEl) {
    countEl.textContent = `${t('roomOnlineCount').replace(/\d+/, room.count || (room.isCustom ? 1 : 300))}`;
  }
}

function renderPeerGrid() {
  const grid = document.getElementById('peerGrid');
  if (!grid) return;
  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;

  const room = getCurrentRoom();
  grid.innerHTML = '';

  // 1) 내 집중 카드 (실시간 AI 비전 상태 + 내 자세 점수 + 타이머 시간)
  const myMins = Math.floor(timerSeconds / 60);
  const myPostureScore = (window.edgeAi && typeof window.edgeAi.currentPostureScore === 'number') 
    ? Math.round(window.edgeAi.currentPostureScore) 
    : 98;
  const myName = currentUser ? currentUser.name : t('peerMe');
  const myOrg = currentUser ? currentUser.email : 'STAI Edge AI Vision Guard';
  const isHost = !!room.isCustom;

  const myCard = document.createElement('div');
  myCard.className = 'group relative p-3.5 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border-2 border-indigo-500/60 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/20 flex flex-col justify-between';
  myCard.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="relative shrink-0">
        <div class="w-11 h-11 rounded-full bg-indigo-600/30 border border-indigo-400 flex items-center justify-center text-lg">
          ${isHost ? '👑' : '🧑‍💻'}
        </div>
        <span class="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface animate-pulse" title="${t('onlineBadgeTitle')}"></span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <h4 class="text-xs font-bold text-white truncate">${myName}</h4>
          <span class="px-1.5 py-0.5 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-300 shrink-0">${isHost ? t('hostBadge') : t('peerMe')}</span>
        </div>
        <p class="text-[10px] text-on-surface-variant truncate mt-0.5">${myOrg}</p>
      </div>
    </div>

    <div class="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
      <span class="text-secondary font-semibold">⏱️ ${t('peerFocusMinutes', { m: myMins })}</span>
      <span class="text-tertiary">🛡️ ${t('peerPostureRate', { p: myPostureScore })}</span>
    </div>

    <div class="mt-2.5 w-full py-1.5 rounded-xl bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 text-[11px] font-semibold flex items-center justify-center gap-1">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
      <span>${isTimerRunning ? '실시간 순공 누적 중' : 'AI 자세 감시 대기'}</span>
    </div>
  `;
  grid.appendChild(myCard);

  // 2) 동료/팀원 카드들
  (room.peers || []).forEach(peer => {
    const card = document.createElement('div');
    card.setAttribute('data-peer-id', peer.id);

    if (peer.isInvitePrompt) {
      card.className = 'group relative p-3.5 rounded-2xl bg-surface-container-high/60 hover:bg-surface-container-highest border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 transition-all duration-200 cursor-pointer shadow-lg flex flex-col justify-between items-center text-center';
      card.innerHTML = `
        <div class="w-11 h-11 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-lg mb-2">
          <span class="material-symbols-outlined text-2xl">person_add</span>
        </div>
        <h4 class="text-xs font-bold text-white">${peer.name}</h4>
        <p class="text-[10px] text-on-surface-variant mt-0.5">${peer.org}</p>
        <button class="mt-3 w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-md transition-all flex items-center justify-center gap-1">
          <span class="material-symbols-outlined text-[14px]">link</span>
          <span>${t('btnInviteRoom')}</span>
        </button>
      `;
      card.addEventListener('click', openInviteModal);
    } else {
      card.className = 'group relative p-3.5 rounded-2xl bg-surface-container-high/90 hover:bg-surface-container-highest border border-white/5 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between';
      card.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="relative shrink-0">
            <img src="${peer.avatar}" alt="${peer.name}" class="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-secondary/60 transition-all" />
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface animate-pulse" title="${t('onlineBadgeTitle')}"></span>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-white truncate group-hover:text-secondary transition-colors">${peer.name}</h4>
            <p class="text-[10px] text-on-surface-variant truncate mt-0.5">${peer.org}</p>
          </div>
        </div>

        <div class="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
          <span class="text-secondary font-semibold">⏱️ ${t('peerFocusMinutes', { m: peer.mins })}</span>
          <span class="text-tertiary">🛡️ ${t('peerPostureRate', { p: peer.posture })}</span>
        </div>

        <button class="mt-2.5 w-full py-1.5 rounded-xl bg-white/5 group-hover:bg-indigo-600/30 text-indigo-300 border border-white/5 group-hover:border-indigo-500/40 text-[11px] font-semibold transition-all flex items-center justify-center gap-1">
          <span>👏</span>
          <span>${t('btnCheerClap')}</span>
        </button>
      `;
      card.addEventListener('click', () => openPeerCheerModal(peer));
    }

    grid.appendChild(card);
  });
}

function renderCustomRoomsInModal() {
  const wrapper = document.getElementById('myRoomsWrapper');
  const list = document.getElementById('myRoomsList');
  if (!wrapper || !list) return;

  if (!customStudyRooms || customStudyRooms.length === 0) {
    wrapper.classList.add('hidden');
    list.innerHTML = '';
    return;
  }

  wrapper.classList.remove('hidden');
  list.innerHTML = '';

  customStudyRooms.forEach(room => {
    const item = document.createElement('div');
    const isCurrent = String(room.id) === String(currentRoomId);
    item.className = `p-3.5 rounded-xl ${isCurrent ? 'border-2 border-secondary bg-surface-container-lowest' : 'border border-amber-500/30 bg-surface-container hover:border-amber-400'} cursor-pointer transition-all flex items-center justify-between group room-select-item`;
    item.setAttribute('data-room-id', room.id);
    item.innerHTML = `
      <div>
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-bold text-white group-hover:text-secondary transition-colors">${room.title}</span>
          <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-[9px] font-bold text-amber-300">👑 HOST</span>
        </div>
        <span class="text-[11px] text-on-surface-variant block mt-0.5">${room.desc}</span>
      </div>
      <span class="text-xs font-mono text-secondary font-semibold shrink-0">${room.code} 🟢</span>
    `;
    item.addEventListener('click', () => {
      switchRoom(room.id);
      document.getElementById('roomModal')?.classList.add('hidden');
    });
    list.appendChild(item);
  });
}

function openInviteModal() {
  const modal = document.getElementById('inviteRoomModal');
  if (!modal) return;
  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
  const room = getCurrentRoom();

  const roomTitle = room.isCustom ? room.title : t(room.titleKey);
  const roomCode = room.code || `STAI-${room.id}`;
  const inviteUrl = getRoomInviteUrl(room.id);

  const titleEl = document.getElementById('inviteModalRoomTitle');
  const urlInput = document.getElementById('inviteRoomUrl');
  const codeInput = document.getElementById('inviteRoomCode');
  const previewEl = document.getElementById('inviteSharePreview');

  if (titleEl) titleEl.textContent = roomTitle;
  if (urlInput) urlInput.value = inviteUrl;
  if (codeInput) codeInput.value = roomCode;
  if (previewEl) {
    previewEl.textContent = t('inviteShareTemplate', { name: roomTitle, url: inviteUrl });
  }

  modal.classList.remove('hidden');
  if (window.i18n) window.i18n.applyTranslations();
}

function initStudyRoomController() {
  const btnChange = document.getElementById('btnChangeRoom');
  const btnCreate = document.getElementById('btnCreateRoom');
  const btnInvite = document.getElementById('btnInviteRoom');

  const roomModal = document.getElementById('roomModal');
  const btnCloseRoomModal = document.getElementById('btnCloseRoomModal');

  const createRoomModal = document.getElementById('createRoomModal');
  const btnCloseCreateRoomModal = document.getElementById('btnCloseCreateRoomModal');
  const btnCancelCreateRoom = document.getElementById('btnCancelCreateRoom');
  const btnSubmitCreateRoom = document.getElementById('btnSubmitCreateRoom');

  const inviteRoomModal = document.getElementById('inviteRoomModal');
  const btnCloseInviteModal = document.getElementById('btnCloseInviteModal');
  const btnCopyInviteUrl = document.getElementById('btnCopyInviteUrl');
  const btnCopyInviteCode = document.getElementById('btnCopyInviteCode');

  const btnSubmitJoinByCode = document.getElementById('btnSubmitJoinByCode');
  const inputJoinByCode = document.getElementById('inputJoinByCode');

  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;

  // 1) 방 변경 모달 열기/닫기
  if (btnChange && roomModal) {
    btnChange.addEventListener('click', () => {
      renderCustomRoomsInModal();
      roomModal.classList.remove('hidden');
      if (window.i18n) window.i18n.applyTranslations();
      highlightActiveRoomOption();
    });
  }
  if (btnCloseRoomModal && roomModal) {
    btnCloseRoomModal.addEventListener('click', () => roomModal.classList.add('hidden'));
  }
  if (roomModal) {
    roomModal.addEventListener('click', (e) => {
      if (e.target === roomModal) roomModal.classList.add('hidden');
    });
  }

  // 2) 공용 방 클릭 리스너
  const publicRoomItems = document.querySelectorAll('#roomOptionsList .room-select-item');
  publicRoomItems.forEach(item => {
    item.addEventListener('click', () => {
      const rId = parseInt(item.getAttribute('data-room-id'), 10);
      switchRoom(rId);
      if (roomModal) roomModal.classList.add('hidden');
    });
  });

  // 3) 초대 코드로 빠른 입장
  const handleJoinByCode = () => {
    if (!inputJoinByCode) return;
    const raw = inputJoinByCode.value.trim().toUpperCase();
    if (!raw) {
      alert(t('invalidCodeAlert'));
      return;
    }

    const all = getAllStudyRooms();
    const target = all.find(r => 
      String(r.id).toUpperCase() === raw || 
      (r.code && r.code.toUpperCase() === raw)
    );

    if (target) {
      switchRoom(target.id);
      if (roomModal) roomModal.classList.add('hidden');
      inputJoinByCode.value = '';
    } else {
      // 초대 코드가 새로운 방 코드 형식인 경우 참여형 방으로 즉시 등록
      if (raw.startsWith('STAI-') || raw.startsWith('ROOM-')) {
        const guestRoom = {
          id: raw.toLowerCase(),
          code: raw,
          title: `초대 자습실 #${raw.slice(-4)}`,
          desc: '초대 코드로 참여한 실시간 스터디룸',
          count: 2,
          isCustom: true,
          category: 'general',
          peers: [
            { id: 'host_peer', name: 'Study Leader', org: '방장 호스트', mins: 120, posture: 97, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' }
          ]
        };
        customStudyRooms.unshift(guestRoom);
        try { localStorage.setItem('stai_custom_rooms', JSON.stringify(customStudyRooms)); } catch(e){}
        switchRoom(guestRoom.id);
        if (roomModal) roomModal.classList.add('hidden');
        inputJoinByCode.value = '';
      } else {
        alert(t('roomNotFoundAlert'));
      }
    }
  };

  if (btnSubmitJoinByCode) btnSubmitJoinByCode.addEventListener('click', handleJoinByCode);
  if (inputJoinByCode) {
    inputJoinByCode.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleJoinByCode();
    });
  }

  // 4) 나만의 방 만들기 모달 열기/닫기
  if (btnCreate && createRoomModal) {
    btnCreate.addEventListener('click', () => {
      createRoomModal.classList.remove('hidden');
      if (window.i18n) window.i18n.applyTranslations();
      const inputName = document.getElementById('newRoomName');
      if (inputName) inputName.focus();
    });
  }
  if (btnCloseCreateRoomModal && createRoomModal) {
    btnCloseCreateRoomModal.addEventListener('click', () => createRoomModal.classList.add('hidden'));
  }
  if (btnCancelCreateRoom && createRoomModal) {
    btnCancelCreateRoom.addEventListener('click', () => createRoomModal.classList.add('hidden'));
  }
  if (createRoomModal) {
    createRoomModal.addEventListener('click', (e) => {
      if (e.target === createRoomModal) createRoomModal.classList.add('hidden');
    });
  }

  // 5) 카테고리 선택 버튼 토글
  const categoryBtns = document.querySelectorAll('.category-choice-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('active', 'bg-indigo-600/30', 'border-indigo-500', 'text-indigo-200');
        b.classList.add('bg-surface-container', 'border-white/10', 'text-on-surface-variant');
      });
      btn.classList.add('active', 'bg-indigo-600/30', 'border-indigo-500', 'text-indigo-200');
      btn.classList.remove('bg-surface-container', 'border-white/10', 'text-on-surface-variant');
      selectedCategoryForNewRoom = btn.getAttribute('data-cat') || 'exam';
    });
  });

  // 6) 방 만들기 생성 완료 제출
  if (btnSubmitCreateRoom) {
    btnSubmitCreateRoom.addEventListener('click', () => {
      const nameInput = document.getElementById('newRoomName');
      const descInput = document.getElementById('newRoomDesc');
      const roomName = (nameInput && nameInput.value.trim()) || '나만의 집중 자습실';
      const roomDesc = (descInput && descInput.value.trim()) || 'AI 자세 교정 실시간 스터디';

      const newId = `room_${Date.now()}`;
      const code = `STAI-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRoom = {
        id: newId,
        code: code,
        title: roomName,
        desc: roomDesc,
        category: selectedCategoryForNewRoom,
        count: 1,
        isCustom: true,
        createdAt: new Date().toISOString(),
        peers: [
          {
            id: `buddy_${Date.now()}`,
            name: 'Alex C. (Study Buddy)',
            org: '대만대 • 도서관 열람실',
            mins: 45,
            posture: 98,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
          },
          {
            id: 'invite_slot',
            isInvitePrompt: true,
            name: '+ 친구 초대 대기석',
            org: '초대 링크로 친구를 불러보세요',
            mins: 0,
            posture: 100,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
          }
        ]
      };

      customStudyRooms.unshift(newRoom);
      try {
        localStorage.setItem('stai_custom_rooms', JSON.stringify(customStudyRooms));
      } catch (e) {
        console.warn(e);
      }

      if (createRoomModal) createRoomModal.classList.add('hidden');
      if (nameInput) nameInput.value = '';
      if (descInput) descInput.value = '';

      switchRoom(newId);
      openInviteModal();
      alert(t('roomCreatedToast'));
    });
  }

  // 7) 친구 초대 모달 열기/닫기 및 복사
  if (btnInvite) {
    btnInvite.addEventListener('click', openInviteModal);
  }
  if (btnCloseInviteModal && inviteRoomModal) {
    btnCloseInviteModal.addEventListener('click', () => inviteRoomModal.classList.add('hidden'));
  }
  if (inviteRoomModal) {
    inviteRoomModal.addEventListener('click', (e) => {
      if (e.target === inviteRoomModal) inviteRoomModal.classList.add('hidden');
    });
  }

  if (btnCopyInviteUrl) {
    btnCopyInviteUrl.addEventListener('click', async () => {
      const urlInput = document.getElementById('inviteRoomUrl');
      if (urlInput) {
        try {
          await navigator.clipboard.writeText(urlInput.value);
        } catch(e) {
          urlInput.select();
          document.execCommand('copy');
        }
        alert(t('inviteCopiedToast'));
      }
    });
  }

  if (btnCopyInviteCode) {
    btnCopyInviteCode.addEventListener('click', async () => {
      const codeInput = document.getElementById('inviteRoomCode');
      if (codeInput) {
        try {
          await navigator.clipboard.writeText(codeInput.value);
        } catch(e) {
          codeInput.select();
          document.execCommand('copy');
        }
        alert(t('inviteCodeCopiedToast'));
      }
    });
  }

  // 8) URL 쿼리 파라미터 '?room=...' 자동 입장 처리
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoom = urlParams.get('room');
    if (queryRoom) {
      const all = getAllStudyRooms();
      const matched = all.find(r => 
        String(r.id) === queryRoom || 
        (r.code && r.code.toUpperCase() === queryRoom.toUpperCase())
      );
      if (matched) {
        currentRoomId = matched.id;
      } else {
        const guestJoinedRoom = {
          id: queryRoom,
          code: queryRoom.toUpperCase().startsWith('STAI-') ? queryRoom.toUpperCase() : `STAI-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `초대받은 자습실 #${queryRoom.slice(-4)}`,
          desc: '초대 링크로 입장한 실시간 집중 자습실',
          count: 2,
          isCustom: true,
          category: 'general',
          peers: [
            { id: 'leader', name: 'Room Host', org: '자습실 개설자', mins: 80, posture: 98, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' }
          ]
        };
        customStudyRooms.unshift(guestJoinedRoom);
        currentRoomId = guestJoinedRoom.id;
      }
      // 자동으로 자습실 탭 활성화
      switchTab('tab-room');
    }
  } catch(e) {
    console.warn(e);
  }

  updateStudyRoomHeaderTexts();
  renderPeerGrid();
}

function switchRoom(roomId) {
  currentRoomId = roomId;
  updateStudyRoomHeaderTexts();
  highlightActiveRoomOption();
  renderPeerGrid();
}

function highlightActiveRoomOption() {
  document.querySelectorAll('.room-select-item').forEach(item => {
    const rId = item.getAttribute('data-room-id');
    if (String(rId) === String(currentRoomId)) {
      item.classList.add('border-2', 'border-secondary', 'bg-surface-container-lowest');
      item.classList.remove('border-white/5', 'bg-surface-container');
    } else {
      item.classList.remove('border-2', 'border-secondary', 'bg-surface-container-lowest');
      item.classList.add('border-white/5', 'bg-surface-container');
    }
  });
}

function openPeerCheerModal(peer) {
  selectedPeerForCheer = peer;
  const modal = document.getElementById('peerModal');
  if (!modal) return;
  const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;

  const avatar = document.getElementById('peerModalAvatar');
  const name = document.getElementById('peerModalName');
  const org = document.getElementById('peerModalOrg');
  const mins = document.getElementById('peerModalMinutes');
  const posture = document.getElementById('peerModalPosture');

  if (avatar) avatar.src = peer.avatar;
  if (name) name.textContent = peer.name;
  if (org) org.textContent = peer.org;
  if (mins) mins.textContent = t('peerFocusMinutes', { m: peer.mins });
  if (posture) posture.textContent = t('peerPostureRate', { p: peer.posture });

  modal.classList.remove('hidden');
  if (window.i18n) window.i18n.applyTranslations();
}

function initPeerCheerController() {
  const modal = document.getElementById('peerModal');
  const btnClose = document.getElementById('btnClosePeerModal');
  const cheerBtns = document.querySelectorAll('.btn-cheer');

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  cheerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!selectedPeerForCheer) return;
      const t = (k, p) => window.i18n ? window.i18n.t(k, p) : k;
      const cheerKey = btn.getAttribute('data-cheer-key') || 'btnCheerShortClap';
      const cheerType = t(cheerKey);
      if (navigator.vibrate) {
        try { navigator.vibrate([40, 40, 40]); } catch(e){}
      }
      const msg = t('cheerSuccessMsg', { name: selectedPeerForCheer.name, type: cheerType });
      alert(msg);
      if (modal) modal.classList.add('hidden');
    });
  });
}


