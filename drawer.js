// =================================================================
// 청년인쇄사 기본 서랍장 제어 스크립트
// =================================================================

let uploadedFiles = [];
let isDrawerOpen = false;

// 서랍장 열기/닫기
function toggleDrawer(open) {
  const drawer = document.getElementById('drawer-panel');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;

  isDrawerOpen = (open !== undefined) ? open : !isDrawerOpen;

  if (isDrawerOpen) {
    drawer.classList.add('is-open');
    backdrop.classList.remove('hidden');
    setTimeout(() => backdrop.classList.add('opacity-100'), 10);
  } else {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('opacity-100');
    setTimeout(() => backdrop.classList.add('hidden'), 350);
  }
}

// 파일 드롭존
function handleDragOver(e) {
  e.preventDefault();
  const zone = document.getElementById('file-dropzone');
  if (zone) zone.classList.add('border-blue-500', 'bg-blue-50/50');
}

function handleDragLeave(e) {
  e.preventDefault();
  const zone = document.getElementById('file-dropzone');
  if (zone) zone.classList.remove('border-blue-500', 'bg-blue-50/50');
}

function handleFileDrop(e) {
  e.preventDefault();
  const zone = document.getElementById('file-dropzone');
  if (zone) zone.classList.remove('border-blue-500', 'bg-blue-50/50');
  if (e.dataTransfer && e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
}

function handleFileSelect(e) {
  if (e.target && e.target.files.length > 0) processFiles(e.target.files);
}

function processFiles(files) {
  uploadedFiles = Array.from(files);
  const dropTitle = document.getElementById('drop-title');
  const dropSub = document.getElementById('drop-sub');
  
  if (dropTitle) dropTitle.textContent = `${uploadedFiles[0].name} (${(uploadedFiles[0].size / (1024 * 1024)).toFixed(1)}MB)`;
  if (dropSub) dropSub.textContent = "원고가 안전하게 업로드되었습니다.";

  runAiDiagnostics(uploadedFiles[0].name);
  validateForm();
}

function runAiDiagnostics(fileName) {
  const percentBadge = document.getElementById('ai-percent-badge');
  const progressFill = document.getElementById('ai-progress-fill');
  const statusText = document.getElementById('ai-status-text');
  const subText = document.getElementById('ai-sub-text');
  const reportContainer = document.getElementById('ai-report-dual-container');
  const summaryBody = document.getElementById('rpt-summary-body');

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
      document.getElementById('ai-step-box-3')?.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');

      if (reportContainer) reportContainer.classList.remove('hidden');
      if (summaryBody) {
        summaryBody.innerHTML = `
          <p class="text-sm text-slate-800">· <strong>파일 명칭:</strong> ${fileName}</p>
          <p class="text-sm text-slate-800">· <strong>권장 판형:</strong> 국배판 (A4, 210×297mm) / 마스터 인쇄 최적화</p>
          <p class="text-sm text-slate-800">· <strong>여백 진단:</strong> 상하좌우 안전 여백 15mm 자동 보정 기준 충족</p>
        `;
      }
    }
  }, 100);
}

// 폼 유효성 검사
function validateForm() {
  const orgInput = document.getElementById('client-org');
  const phoneInput = document.getElementById('client-phone');
  const ctaBtn = document.getElementById('cta-button');
  const ctaText = document.getElementById('cta-btn-text');

  const orgVal = orgInput ? orgInput.value.trim() : '';
  const phoneVal = phoneInput ? phoneInput.value.trim() : '';

  if (orgVal.length >= 2 && phoneVal.length >= 8) {
    if (ctaBtn) {
      ctaBtn.disabled = false;
      ctaBtn.classList.remove('cursor-not-allowed', 'bg-white/40', 'text-white/80');
      ctaBtn.classList.add('bg-blue-600', 'hover:bg-blue-500', 'text-white', 'shadow-lg', 'cursor-pointer');
    }
    if (ctaText) ctaText.textContent = "청년인쇄사에 견적 요청 전송하기 ➔";
  } else {
    if (ctaBtn) {
      ctaBtn.disabled = true;
      ctaBtn.classList.add('cursor-not-allowed', 'bg-white/40', 'text-white/80');
      ctaBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500', 'text-white', 'shadow-lg', 'cursor-pointer');
    }
    if (ctaText) ctaText.textContent = "회사명과 연락처를 입력해 주세요 ➔";
  }
}

// 최종 견적 요청 버튼 클릭
function handleCtaClick() {
  const orgInput = document.getElementById('client-org');
  const phoneInput = document.getElementById('client-phone');
  const inquiryInput = document.getElementById('text-inquiry');

  const org = orgInput ? orgInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!org || !phone) return;

  alert(`[견적 요청 완료]\n\n${org} 고객님의 요청이 접수되었습니다.\n담당자가 확인 후 빠르게 연락드리겠습니다.`);

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

  if (!answer.classList.contains('hidden')) {
    answer.classList.add('hidden');
    if (icon) icon.innerHTML = '&plus;';
  } else {
    answer.classList.remove('hidden');
    if (icon) icon.innerHTML = '&minus;';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
});
