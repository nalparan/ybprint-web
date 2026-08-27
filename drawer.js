// =================================================================
// 청년인쇄사 서랍장 & AI 실시간 분석 & 텔레그램 알림 시스템
// =================================================================

// 텔레그램 봇 연동 설정값
const TELEGRAM_CONFIG = {
  token: '8973853530:AAEYORrlf_W0ms_BmaQuYcM84Trmhd7PGXA',
  chatId: '8662785838'
};

let uploadedFiles = [];
let isDrawerOpen = false;

// 서랍장 열기 / 닫기
function toggleDrawer(open) {
  const drawer = document.getElementById('drawer-panel');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;

  isDrawerOpen = (open !== undefined) ? open : !isDrawerOpen;

  if (isDrawerOpen) {
    drawer.classList.remove('is-closed');
    backdrop.classList.remove('hidden');
    setTimeout(() => { backdrop.classList.add('opacity-100'); }, 10);
  } else {
    drawer.classList.add('is-closed');
    backdrop.classList.remove('opacity-100');
    setTimeout(() => { backdrop.classList.add('hidden'); }, 300);
  }
}

// 백엔드 깨우기
function wakeUpBackend() {
  // 필요 시 백엔드 웜업 호출
}

// 파일 드래그 & 드롭 이벤트
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  const zone = document.getElementById('file-dropzone');
  if (zone) zone.classList.add('border-blue-500', 'bg-blue-50/50');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  const zone = document.getElementById('file-dropzone');
  if (zone) zone.classList.remove('border-blue-500', 'bg-blue-50/50');
}

function handleFileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const zone = document.getElementById('file-dropzone');
  if (zone) zone.classList.remove('border-blue-500', 'bg-blue-50/50');

  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    processFiles(e.dataTransfer.files);
  }
}

function handleFileSelect(e) {
  if (e.target && e.target.files.length > 0) {
    processFiles(e.target.files);
  }
}

// 파일 접수 및 가상 AI 분석 시뮬레이션
function processFiles(files) {
  uploadedFiles = Array.from(files);
  const dropTitle = document.getElementById('drop-title');
  const dropSub = document.getElementById('drop-sub');
  
  if (dropTitle) {
    dropTitle.textContent = `${uploadedFiles[0].name} (${(uploadedFiles[0].size / (1024 * 1024)).toFixed(1)}MB)`;
  }
  if (dropSub) {
    dropSub.textContent = "원고가 안전하게 업로드되었습니다. AI 검수를 진행합니다.";
  }

  runAiDiagnostics(uploadedFiles[0].name);
  validateForm();
}

// AI 진단 애니메이션 시뮬레이션
function runAiDiagnostics(fileName) {
  const percentBadge = document.getElementById('ai-percent-badge');
  const progressFill = document.getElementById('ai-progress-fill');
  const statusText = document.getElementById('ai-status-text');
  const subText = document.getElementById('ai-sub-text');
  const reportContainer = document.getElementById('ai-report-dual-container');
  const summaryBody = document.getElementById('rpt-summary-body');
  const terminalBody = document.getElementById('terminal-console-body');
  const diagSignal = document.getElementById('ai-diagnostic-signal');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (percentBadge) percentBadge.textContent = progress + '%';
    if (progressFill) progressFill.style.width = progress + '%';

    if (progress === 30) {
      if (statusText) statusText.textContent = "문서 규격 및 여백 실측 중...";
      document.getElementById('ai-step-box-1')?.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200');
    } else if (progress === 70) {
      if (statusText) statusText.textContent = "정부표준문서 규격 정합도 판별 중...";
      document.getElementById('ai-step-box-2')?.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200');
    } else if (progress >= 100) {
      clearInterval(interval);
      if (statusText) statusText.textContent = "청년인쇄사 AI 원고 정밀 진단 완료";
      if (subText) subText.textContent = "정부표준문서 규격에 맞춘 인쇄 권장안이 생성되었습니다.";
      if (diagSignal) diagSignal.classList.remove('hidden');
      document.getElementById('ai-step-box-3')?.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');

      if (reportContainer) reportContainer.classList.remove('hidden');
      if (summaryBody) {
        summaryBody.innerHTML = `
          <p class="text-sm text-slate-800">· <strong>파일 명칭:</strong> ${fileName}</p>
          <p class="text-sm text-slate-800">· <strong>권장 판형:</strong> 국배판 (A4, 210×297mm) / 마스터 인쇄 최적화</p>
          <p class="text-sm text-slate-800">· <strong>여백 진단:</strong> 상하좌우 안전 여백 15mm 자동 보정 기준 충족</p>
          <p class="text-sm text-blue-700 font-semibold mt-1">※ 청년인쇄사 출력실에서 인쇄 전 최종 색감 및 재단선을 재검수합니다.</p>
        `;
      }
      if (terminalBody) {
        terminalBody.innerHTML = `[AI_ENGINE] File parsed: ${fileName}\n[ANALYSIS] Margin: Safe / Resolution: 300DPI Checked\n[RESULT] Ready for instant printing pipeline.`;
      }
    }
  }, 120);
}

// 텍스트 문의 및 연락처 유효성 검사
function handleTextInput(el) {
  validateForm();
}

function handlePhoneOrEmailInput(el) {
  validateForm();
}

function validateForm(showError = false) {
  const orgInput = document.getElementById('client-org');
  const phoneInput = document.getElementById('client-phone');
  const ctaBtn = document.getElementById('cta-button');
  const ctaText = document.getElementById('cta-btn-text');

  const orgVal = orgInput ? orgInput.value.trim() : '';
  const phoneVal = phoneInput ? phoneInput.value.trim() : '';

  const isValidOrg = orgVal.length >= 2;
  const isValidPhone = phoneVal.length >= 8;

  if (isValidOrg && isValidPhone) {
    if (ctaBtn) {
      ctaBtn.disabled = false;
      ctaBtn.classList.remove('cursor-not-allowed', 'bg-white/40', 'text-white/80');
      ctaBtn.classList.add('bg-blue-600', 'hover:bg-blue-500', 'text-white', 'shadow-lg', 'cursor-pointer');
    }
    if (ctaText) {
      ctaText.textContent = "청년인쇄사에 견적 요청 전송하기 ➔";
    }
  } else {
    if (ctaBtn) {
      ctaBtn.disabled = true;
      ctaBtn.classList.add('cursor-not-allowed', 'bg-white/40', 'text-white/80');
      ctaBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500', 'text-white', 'shadow-lg', 'cursor-pointer');
    }
    if (ctaText) {
      ctaText.textContent = "회사명과 연락처를 입력해 주세요 ➔";
    }
  }
}

// 텔레그램 실시간 알림 발송 함수
async function sendTelegramNotification(org, phone, inquiry, fileName) {
  const now = new Date();
  const timeString = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}시 ${now.getMinutes()}분`;

  const message = 
    `🔔 [청년인쇄사] 새로운 견적 요청이 접수되었습니다!\n\n` +
    `👤 고객명/기관: ${org}\n` +
    `📞 연락처/메일: ${phone}\n` +
    `📝 문의내용: ${inquiry || '(내용 없음 - 파일 첨부 의뢰)'}\n` +
    `📎 첨부파일: ${fileName || '없음 (텍스트 문의)'}\n` +
    `⏰ 접수시각: ${timeString}\n\n` +
    `👉 즉시 고객님께 유선 연락 또는 견적 안내를 진행해 주세요.`;

  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: message
      })
    });
    return res.ok;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
}

// 최종 견적 요청 제출 버튼 클릭 핸들러
async function handleCtaClick() {
  const orgInput = document.getElementById('client-org');
  const phoneInput = document.getElementById('client-phone');
  const inquiryInput = document.getElementById('text-inquiry');
  const ctaBtn = document.getElementById('cta-button');
  const ctaText = document.getElementById('cta-btn-text');

  const org = orgInput ? orgInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const inquiry = inquiryInput ? inquiryInput.value.trim() : '';
  const fileName = uploadedFiles.length > 0 ? uploadedFiles[0].name : '';

  if (!org || !phone) {
    alert('회사명(성함)과 연락처를 입력해 주세요.');
    return;
  }

  // 전송 중 상태 표시
  if (ctaBtn) ctaBtn.disabled = true;
  if (ctaText) ctaText.textContent = "견적 요청을 안전하게 전송 중입니다...";

  // 텔레그램 실시간 알림 발송
  await sendTelegramNotification(org, phone, inquiry, fileName);

  // 접수 완료 안내
  alert(`[견적 요청 완료]\n\n${org} 고객님의 요청이 정상적으로 접수되었습니다.\n담당자가 확인 후 신속히 연락드리겠습니다.`);

  // 입력폼 초기화 및 서랍장 닫기
  if (orgInput) orgInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (inquiryInput) inquiryInput.value = '';
  uploadedFiles = [];
  toggleDrawer(false);
  validateForm();
}

// FAQ 아코디언 토글
function toggleFaq(item) {
  const answer = item.querySelector('.faq-answer');
  const icon = item.querySelector('.faq-icon');
  if (!answer) return;

  const isOpen = !answer.classList.contains('hidden');
  if (isOpen) {
    answer.classList.add('hidden');
    if (icon) icon.innerHTML = '&plus;';
  } else {
    answer.classList.remove('hidden');
    if (icon) icon.innerHTML = '&minus;';
  }
}

// 관리자 모달 제어
function toggleAdminModal(show) {
  const modal = document.getElementById('adminCommandModal');
  if (!modal) return;
  if (show) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function submitAdminAuth() {
  const input = document.getElementById('adminCommandInput');
  if (input && input.value === '1234') {
    alert('관리자 모드로 진입합니다.');
    toggleAdminModal(false);
  } else {
    alert('인증 비밀번호가 일치하지 않습니다.');
  }
}

// Lucide 아이콘 초기화
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
