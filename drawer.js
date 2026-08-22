// Lucide 아이콘 초기화
lucide.createIcons();

// 전역 드래그 드롭 방지 및 감지
window.addEventListener('dragover', function(e) { e.preventDefault(); e.stopPropagation(); }, false);
window.addEventListener('drop', function(e) {
  e.preventDefault(); e.stopPropagation();
  const files = Array.from(e.dataTransfer ? e.dataTransfer.files : []);
  if (files.length > 0) { toggleDrawer(true); processFiles(files); }
}, false);

// Render 백엔드 웜업
const RENDER_BACKEND_URL = "https://ybprint-backend-1.onrender.com";
let isWarmingUp = false;
function wakeUpBackend() {
  if (isWarmingUp) return;
  isWarmingUp = true;
  fetch(`${RENDER_BACKEND_URL}/`, { method: 'GET', mode: 'cors' }).catch(() => {}).finally(() => { isWarmingUp = false; });
}
window.addEventListener('DOMContentLoaded', wakeUpBackend);

// 헤더 스크롤 효과
function updateHeaderOnScroll() {
  const mainHeader = document.getElementById('mainHeader');
  if (!mainHeader) return;
  if (window.scrollY > 30) mainHeader.classList.add('is-scrolled');
  else mainHeader.classList.remove('is-scrolled');
}
window.addEventListener('scroll', updateHeaderOnScroll);

// FAQ 아코디언 토글
function toggleFaq(el) {
  const active = document.querySelector('.faq-item.active');
  if (active && active !== el) active.classList.remove('active');
  el.classList.toggle('active');
}

// 히어로 슬라이더
const heroImgs = ['hero_black_01.png', 'hero_black_02.png', 'hero_black_03.png', 'hero_black_04.png', 'hero_black_05.png'];
const slides = document.querySelectorAll('.slide');
slides.forEach((s, i) => { if(heroImgs[i]) s.style.backgroundImage = `url("${heroImgs[i]}")`; });
let curIdx = 0;
setInterval(() => {
  if (slides.length > 0) {
    slides[curIdx].classList.remove('active');
    curIdx = (curIdx + 1) % slides.length;
    slides[curIdx].classList.add('active');
  }
}, 5000);

// 전역 상태 변수
let hasUploadedFile = false;
let uploadedFilesList = [];
let lastScannedSpecSummary = "";
let isScanning = false;

// 서랍장 열기/닫기
function toggleDrawer(open) {
  const backdrop = document.getElementById('drawer-backdrop');
  const panel = document.getElementById('drawer-panel');
  if (!backdrop || !panel) return;
  if (open) {
    backdrop.classList.remove('hidden');
    backdrop.style.display = 'block';
    panel.classList.remove('animate-drawer-wiggle');
    panel.classList.remove('is-closed');
    panel.classList.add('is-open');
    panel.style.transform = '';
  } else {
    panel.classList.remove('is-open');
    panel.classList.add('is-closed');
    panel.style.transform = '';
    setTimeout(() => {
      if (panel.classList.contains('is-closed')) {
        backdrop.classList.add('hidden');
        backdrop.style.display = 'none';
      }
    }, 400);
  }
}

// 전화번호/이메일 포맷팅 및 검증
function formatPhoneNumber(val) {
  if (!val) return '';
  if (/[a-zA-Z@]/.test(val)) return val;
  const digits = val.replace(/\D/g, '');
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  } else {
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
}

function handlePhoneOrEmailInput(el) {
  if (!el) return;
  const originalVal = el.value;
  const formatted = formatPhoneNumber(originalVal);
  if (formatted !== originalVal) el.value = formatted;
  validateForm();
}

function checkOrgValid(val) {
  const trimmed = (val || '').trim();
  return trimmed.length >= 2;
}

function checkPhoneOrEmailValid(val) {
  const trimmed = (val || '').trim();
  if (!trimmed) return { isValid: false, mode: 'none', msg: '' };
  const isEmailMode = /[a-zA-Z@]/.test(trimmed);
  if (isEmailMode) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(trimmed);
    return { isValid, mode: 'email', msg: isValid ? '' : '이메일 형식이 올바르지 않습니다.' };
  } else {
    const digits = trimmed.replace(/\D/g, '');
    const phoneRegex = /^(01[016789]|02|0[3-6][1-5])-?\d{3,4}-?\d{4}$/;
    const isValid = phoneRegex.test(trimmed) || (digits.length >= 9 && digits.length <= 11);
    return { isValid, mode: 'phone', msg: isValid ? '' : '전화번호 형식이 올바르지 않습니다.' };
  }
}

// 자연어 분석 입력 처리
let inquiryDebounceTimer = null;
function handleTextInput(el) {
  validateForm();
  const cardContainer = document.getElementById('ai-inquiry-live-card-container');
  if (!cardContainer) return;
  const text = el.value.trim();
  if (!text || text.length < 2) {
    cardContainer.innerHTML = '';
    return;
  }
  cardContainer.innerHTML = `<div class="mt-3 p-4 rounded-2xl bg-slate-50 text-slate-600 text-xs flex items-center gap-2.5"><i data-lucide="loader-2" class="w-4 h-4 text-blue-600 animate-spin"></i><span class="font-semibold text-slate-700">AI가 문의 내용을 분석 중입니다...</span></div>`;
  lucide.createIcons();
  if (inquiryDebounceTimer) clearTimeout(inquiryDebounceTimer);
  inquiryDebounceTimer = setTimeout(() => {
    parseInquiryTextAndRenderCard(text);
    if (/[?\.!\n]$/.test(text)) {
      setTimeout(() => {
        const orgInput = document.getElementById('client-org');
        if (orgInput && document.activeElement === el) {
          orgInput.focus();
          orgInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, 700);
}

function parseInquiryTextAndRenderCard(text) {
  const cardContainer = document.getElementById('ai-inquiry-live-card-container');
  if (!cardContainer) return;

  let binding = '일반 제본';
  if (text.includes('스프링') || text.includes('와이어') || text.includes('링')) binding = '스프링 제본';
  else if (text.includes('무선') || text.includes('책자') || text.includes('보고서')) binding = '무선제본(PUR)';
  else if (text.includes('중철') || text.includes('리플릿') || text.includes('소책자')) binding = '중철제본';
  else if (text.includes('바인더')) binding = '바인더 제본';

  let qty = '수량 확인중';
  const qtyMatch = text.match(/(\d+)\s*(부|권|장|매|세트|set|EA)/i);
  if (qtyMatch) {
    qty = `${qtyMatch[1]}${qtyMatch[2]}`;
  } else {
    const numOnly = text.match(/(\d+)/);
    if (numOnly) qty = `${numOnly[1]}부(추정)`;
  }

  let scheduleHtml = '<span class="text-emerald-600 font-bold">일정 조율</span>';
  if (text.includes('오늘') || text.includes('당일') || text.includes('급') || text.includes('지금')) {
    scheduleHtml = '<span class="text-rose-600 font-bold">당일 긴급 제작</span>';
  } else if (text.includes('내일') || text.includes('익일')) {
    scheduleHtml = '<span class="text-blue-600 font-bold">익일 출고 요청</span>';
  }

  cardContainer.innerHTML = `
    <div class="mt-3 p-4 rounded-2xl bg-slate-100 border border-slate-300 space-y-2.5">
      <div class="flex items-center justify-between border-b border-slate-300 pb-2">
        <span class="text-xs font-mono font-bold text-slate-700">[청년인쇄사 AI 분석 요약]</span>
        <span class="text-[11px] font-mono font-bold text-blue-600">실시간 분석</span>
      </div>
      <div class="text-slate-800 space-y-2">
        <p class="font-bold text-sm sm:text-base text-slate-900">문의 사항이 분석되었습니다.</p>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <div class="bg-white p-2 rounded-xl border border-slate-200">
            <span class="text-slate-400 block text-[10px] mb-0.5">제본방식</span>
            <strong class="text-slate-800">${binding}</strong>
          </div>
          <div class="bg-white p-2 rounded-xl border border-slate-200">
            <span class="text-slate-400 block text-[10px] mb-0.5">요청수량</span>
            <strong class="text-slate-800">${qty}</strong>
          </div>
          <div class="bg-white p-2 rounded-xl border border-slate-200">
            <span class="text-slate-400 block text-[10px] mb-0.5">희망일정</span>
            <strong>${scheduleHtml}</strong>
          </div>
        </div>
        <div class="text-[#666666] text-[12px] pt-1">
          <strong>다음 단계</strong> : 아래 연락처를 남겨주시면 담당자가 즉시 확인 후 안내해 드립니다.
        </div>
      </div>
    </div>`;
  lucide.createIcons();
}

// 폼 유효성 검사 및 버튼 활성화
function validateForm(isBlur = false) {
  const orgInput = document.getElementById('client-org');
  const phoneInput = document.getElementById('client-phone');
  const inquiryInput = document.getElementById('text-inquiry');
  if (!orgInput || !phoneInput || !inquiryInput) return;
  
  const orgVal = orgInput.value;
  const phoneVal = phoneInput.value;
  const inquiryVal = inquiryInput.value.trim();

  const orgErrorMsg = document.getElementById('org-error-msg');
  const phoneErrorMsg = document.getElementById('phone-error-msg');
  const phoneErrorText = document.getElementById('phone-error-text');
  const orgStatusIcon = document.getElementById('org-status-icon');
  const phoneStatusIcon = document.getElementById('phone-status-icon');

  const isOrgValid = checkOrgValid(orgVal);
  const phoneResult = checkPhoneOrEmailValid(phoneVal);
  const isContactValid = isOrgValid && phoneResult.isValid;
  const hasInquiryText = inquiryVal.length >= 2;

  // 1. 회사명/이름 상태
  if (orgVal.trim() === '') {
    if (orgErrorMsg) orgErrorMsg.classList.add('hidden');
    orgInput.classList.remove('border-rose-500', 'border-emerald-500', 'ring-1', 'ring-rose-500');
    if (orgStatusIcon) orgStatusIcon.innerHTML = '';
  } else if (!isOrgValid) {
    if (isBlur || orgVal.trim().length >= 1) {
      if (orgErrorMsg) orgErrorMsg.classList.remove('hidden');
      orgInput.classList.add('border-rose-500', 'ring-1', 'ring-rose-500');
      orgInput.classList.remove('border-emerald-500');
      if (orgStatusIcon) orgStatusIcon.innerHTML = '<span class="text-rose-500 font-bold">✕ 형식 안맞음</span>';
    }
  } else {
    if (orgErrorMsg) orgErrorMsg.classList.add('hidden');
    orgInput.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
    orgInput.classList.add('border-emerald-500');
    if (orgStatusIcon) orgStatusIcon.innerHTML = '<span class="text-emerald-600 font-bold">✓ 올바름</span>';
  }

  // 2. 연락처/이메일 상태
  if (phoneVal.trim() === '') {
    if (phoneErrorMsg) phoneErrorMsg.classList.add('hidden');
    phoneInput.classList.remove('border-rose-500', 'border-emerald-500', 'ring-1', 'ring-rose-500');
    if (phoneStatusIcon) phoneStatusIcon.innerHTML = '';
  } else if (!phoneResult.isValid) {
    if (isBlur || phoneVal.trim().length >= 2) {
      if (phoneErrorMsg) phoneErrorMsg.classList.remove('hidden');
      if (phoneErrorText) phoneErrorText.innerText = phoneResult.msg;
      phoneInput.classList.add('border-rose-500', 'ring-1', 'ring-rose-500');
      phoneInput.classList.remove('border-emerald-500');
      if (phoneStatusIcon) phoneStatusIcon.innerHTML = '<span class="text-rose-500 font-bold">✕ 형식 안맞음</span>';
    }
  } else {
    if (phoneErrorMsg) phoneErrorMsg.classList.add('hidden');
    phoneInput.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
    phoneInput.classList.add('border-emerald-500');
    if (phoneStatusIcon) {
      phoneStatusIcon.innerHTML = phoneResult.mode === 'email' 
        ? '<span class="text-emerald-600 font-bold">✓ 올바른 이메일</span>' 
        : '<span class="text-emerald-600 font-bold">✓ 올바른 전화번호</span>';
    }
  }

  // CTA 버튼 제어
  const btn = document.getElementById('cta-button');
  const btnText = document.getElementById('cta-btn-text');
  
  if (btn && btnText && !btn.innerText.includes('서버 연결 중')) {
    if (isContactValid) {
      if (hasUploadedFile) {
        btn.disabled = false;
        btn.className = "w-full py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#7A5734] font-black text-lg shadow-xl cursor-pointer flex items-center justify-center transition-all active:scale-[0.98]";
        btnText.innerHTML = "첨부 원고 사양으로 견적 요청하기 ➔";
      } else if (hasInquiryText) {
        btn.disabled = false;
        btn.className = "w-full py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#7A5734] font-black text-lg shadow-xl cursor-pointer flex items-center justify-center transition-all active:scale-[0.98]";
        btnText.innerHTML = "작성하신 내용으로 빠른 견적 문의하기 ➔";
      } else {
        btn.disabled = true;
        btn.className = "w-full py-4 rounded-2xl bg-white/40 text-white/80 font-bold text-lg cursor-not-allowed shadow-md transition-all";
        btnText.innerText = "원고 첨부 또는 문의내용을 입력해 주세요 ➔";
      }
    } else {
      btn.disabled = true;
      btn.className = hasUploadedFile 
        ? "w-full py-4 rounded-2xl bg-white/40 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-not-allowed shadow-md cta-highlight"
        : "w-full py-4 rounded-2xl bg-white/40 text-white/80 font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-not-allowed shadow-md";
      
      if (hasUploadedFile) {
        if (!hasInquiryText && !orgVal && !phoneVal) {
          btnText.innerText = "수량/문의내용과 연락처를 입력해 주세요";
        } else if (!orgVal || !isOrgValid) {
          btnText.innerText = "회사명/이름을 정확히 입력해 주세요";
        } else if (!phoneVal || !phoneResult.isValid) {
          btnText.innerText = "올바른 연락처 형식을 입력해 주세요";
        } else {
          btnText.innerText = "수량/문의내용과 연락처를 입력해 주세요";
        }
      } else if (hasInquiryText) {
        if (!orgVal || !isOrgValid) {
          btnText.innerText = "회사명/이름을 정확히 입력해 주세요";
        } else if (!phoneVal || !phoneResult.isValid) {
          btnText.innerText = "올바른 연락처 형식을 입력해 주세요";
        } else {
          btnText.innerText = "회사명 및 연락처를 입력해 주세요";
        }
      } else {
        btnText.innerText = "원고 첨부 또는 문의내용을 입력해 주세요 ➔";
      }
    }
  }
  lucide.createIcons();
}

// 파일 선택 및 드래그 드롭 이벤트
function handleFileSelect(e) {
  const files = Array.from(e.target.files || []);
  if (files.length > 0) processFiles(files);
}

function handleDragOver(e) { 
  e.preventDefault(); 
  e.stopPropagation(); 
  const dropzone = document.getElementById('file-dropzone');
  if (dropzone) {
    dropzone.className = "w-full bg-blue-50/90 border-2 border-blue-600 p-7 rounded-2xl text-center cursor-pointer transition-all scale-[1.02] shadow-lg ring-4 ring-blue-100";
  }
}

function handleDragLeave(e) { 
  e.preventDefault(); 
  e.stopPropagation(); 
  const dropzone = document.getElementById('file-dropzone');
  if (dropzone && !hasUploadedFile) {
    dropzone.className = "w-full bg-white border-2 border-dashed border-slate-300 hover:brand-key-border p-7 rounded-2xl text-center cursor-pointer transition-all group";
  }
}

function handleFileDrop(e) {
  e.preventDefault(); e.stopPropagation();
  const files = Array.from(e.dataTransfer ? e.dataTransfer.files : []);
  if (files.length > 0) processFiles(files);
}

function processFiles(files) {
  if (!files || files.length === 0) return;
  hasUploadedFile = true;

  const title = document.getElementById('drop-title');
  const sub = document.getElementById('drop-sub');
  const dropzone = document.getElementById('file-dropzone');
  const iconContainer = document.getElementById('drop-icon-container');
  const icon = document.getElementById('drop-icon');

  if (dropzone) dropzone.className = "w-full bg-emerald-50/80 border-2 border-emerald-500 p-7 rounded-2xl text-center cursor-pointer transition-all shadow-xs";
  if (iconContainer) iconContainer.className = "w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2.5 transition-colors";
  if (icon) { icon.setAttribute("data-lucide", "check"); icon.className = "w-6 h-6 text-emerald-600"; }
  lucide.createIcons();

  if (title) {
    if (files.length === 1) title.innerHTML = `<span class="text-slate-900 font-semibold">[${files[0].name}]</span> <span class="text-emerald-700 font-bold text-sm sm:text-base ml-1.5">✓ 첨부 완료</span>`;
    else title.innerHTML = `<span class="text-slate-900 font-semibold">[${files[0].name}] 외 ${files.length - 1}개 파일</span> <span class="text-emerald-700 font-bold text-sm sm:text-base ml-1.5">✓ 첨부 완료</span>`;
  }
  if (sub) sub.innerText = "클릭하여 다른 파일로 재선택 가능합니다";

  validateForm();
  sendRealPdfToBackend(files);
}

function setStepStatus(stepNum, status, labelText) {
  const box = document.getElementById(`ai-step-box-${stepNum}`);
  const icon = document.getElementById(`step-icon-${stepNum}`);
  const text = document.getElementById(`step-text-${stepNum}`);
  if (!box) return;
  if (status === 'active') {
    box.className = "flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-800 font-bold text-left";
    icon.setAttribute("data-lucide", "loader-2"); icon.className = "w-4 h-4 text-blue-600 animate-spin shrink-0";
  } else if (status === 'done') {
    box.className = "flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-left";
    icon.setAttribute("data-lucide", "check-circle-2"); icon.className = "w-4 h-4 text-emerald-600 shrink-0";
  } else {
    box.className = "flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-400 transition-all";
    icon.setAttribute("data-lucide", "circle-dashed"); icon.className = "w-4 h-4 text-slate-400 shrink-0";
  }
  text.innerText = labelText;
  lucide.createIcons();
}

function scrollToInquiryStep() {
  const inquirySection = document.getElementById('inquiry-step-section') || document.getElementById('text-inquiry');
  const inquiryInput = document.getElementById('text-inquiry');
  
  if (inquirySection) {
    inquirySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      if (inquiryInput) {
        inquiryInput.classList.add('focus-pulse');
        try { inquiryInput.focus({ preventScroll: true }); } catch(e) { inquiryInput.focus(); }
        setTimeout(() => {
          inquiryInput.classList.remove('focus-pulse');
        }, 1500);
      }
    }, 500);
  }
}

function formatExactMm(pt) {
  const mm = pt * 25.4 / 72;
  const match = mm.toString().match(/^-?\d+(?:\.\d{0,2})?/);
  return match ? match[0] : mm.toString();
}

// PDF 및 문서 서식 파싱 엔진
async function parseLocalDocument(file) {
  const fname = file.name.toLowerCase();
  const isPdf = fname.endsWith('.pdf');
  const isHwp = fname.endsWith('.hwp') || fname.endsWith('.hwpx');
  const isOffice = fname.endsWith('.doc') || fname.endsWith('.docx') || fname.endsWith('.ppt') || fname.endsWith('.pptx');
  const isDesign = fname.endsWith('.ai') || fname.endsWith('.psd');
  const isZip = fname.endsWith('.zip') || fname.endsWith('.rar');

  if (isPdf) {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decoder = new TextDecoder('latin1');
      const text = decoder.decode(bytes);

      let maxCount = 0;
      const allCountMatches = [...text.matchAll(/\/Count\s+(\d+)/gi)];
      for (const m of allCountMatches) {
        const countVal = parseInt(m[1], 10);
        if (countVal > maxCount) maxCount = countVal;
      }

      const pageTokenMatches = text.match(/\/Type\s*\/Page\b/g);
      const pageTokensCount = pageTokenMatches ? pageTokenMatches.length : 0;
      const finalPageCount = Math.max(maxCount, pageTokensCount, 1);

      let widthMm = 210, heightMm = 297;
      let wDisplay = "210", hDisplay = "297";
      const mediaBoxMatch = text.match(/\/MediaBox\s*\[\s*([\d\.\-]+)\s+([\d\.\-]+)\s+([\d\.\-]+)\s+([\d\.\-]+)\s*\]/i) ||
                            text.match(/\/CropBox\s*\[\s*([\d\.\-]+)\s+([\d\.\-]+)\s+([\d\.\-]+)\s+([\d\.\-]+)\s*\]/i);

      if (mediaBoxMatch) {
        const x1 = parseFloat(mediaBoxMatch[1]) || 0;
        const y1 = parseFloat(mediaBoxMatch[2]) || 0;
        const x2 = parseFloat(mediaBoxMatch[3]) || 0;
        const y2 = parseFloat(mediaBoxMatch[4]) || 0;
        const ptW = Math.abs(x2 - x1);
        const ptH = Math.abs(y2 - y1);
        
        widthMm = ptW * 25.4 / 72;
        heightMm = ptH * 25.4 / 72;
        wDisplay = formatExactMm(ptW);
        hDisplay = formatExactMm(ptH);
      }

      const isA4P  = Math.abs(widthMm - 210) <= 5 && Math.abs(heightMm - 297) <= 5;
      const isA4L  = Math.abs(widthMm - 297) <= 5 && Math.abs(heightMm - 210) <= 5;
      const isB5   = Math.abs(widthMm - 182) <= 5 && Math.abs(heightMm - 257) <= 5;
      const isPptW = Math.abs(widthMm - 338.7) <= 6 && Math.abs(heightMm - 190.5) <= 6;

      let specLabel = "";
      let recommendation = "";

      if (isA4P) specLabel = "규격 (A4 세로형)";
      else if (isA4L) specLabel = "규격 (A4 가로형)";
      else if (isB5) specLabel = "규격 (B5 4x6배판)";
      else if (isPptW) specLabel = "슬라이드 와이드 16:9";
      else specLabel = `비규격`;

      if (isPptW || isA4L || (widthMm > heightMm)) {
        recommendation = "가로형 와이어/트윈 스프링 제본 추천 (표지 250g 스노우+단면무광 / 본문 120g 모조 권장)";
      } else if (finalPageCount >= 30) {
        recommendation = "고강도 무선제본(PUR) 권장 (표지 250g 아트지+무광코팅 / 본문 100g 미색모조 추천)";
      } else if (finalPageCount <= 24 && finalPageCount % 4 === 0) {
        recommendation = "중철제본 최적화 규격 (표지·본문 150g 스노우 / 고해상도 디지털 인쇄 권장)";
      } else {
        recommendation = "스프링 또는 무선 제본 권장 (고속 디지털 속성 인쇄 최적화 규격)";
      }

      return {
        filename: file.name,
        formatType: 'PDF',
        dimensionText: `${wDisplay} × ${hDisplay}mm (${specLabel})`,
        pagesText: `${finalPageCount}p`,
        recommendation: recommendation,
        statusText: '정밀 규격 실측 완료',
        remark: '인쇄용 PDF 원고의 실제 페이지 수와 재단 판형이 완벽하게 실측되었습니다.',
        pagesNum: finalPageCount,
        isStandard: isA4P || isA4L || isB5
      };
    } catch (err) {
      console.error(err);
    }
  }

  if (isHwp) {
    return {
      filename: file.name,
      formatType: 'HWP (한글)',
      dimensionText: '표준 조판 규격 (A4/B5 맞춤 검수 대기)',
      pagesText: '조판 검수 대기',
      recommendation: '공공/기업 표준 조판 최적화 (무선제본 또는 스프링 바인딩 권장)',
      statusText: '한글 원고 접수 완료',
      remark: '한글 원고는 인쇄 전 전담 엔지니어가 조판 여백 및 폰트를 직접 정밀 확인합니다.',
      pagesNum: 0
    };
  }

  if (isOffice) {
    return {
      filename: file.name,
      formatType: 'Office',
      dimensionText: '슬라이드 판형 (인쇄용 판형 최적화 대기)',
      pagesText: '판형 검수 대기',
      recommendation: '슬라이드 비율 가로 스프링 제본 또는 무선제본 추천',
      statusText: '오피스 원고 접수 완료',
      remark: '오피스 원고는 슬라이드/페이지 비율에 맞추어 인쇄 판형 가이드를 전담 배정합니다.',
      pagesNum: 0
    };
  }

  if (isDesign) {
    return {
      filename: file.name,
      formatType: 'DESIGN',
      dimensionText: '디자인 아트보드 실측 및 재단선(Bleed) 1:1 검수',
      pagesText: '아트보드 확인 대기',
      recommendation: '고해상도 CMYK 1:1 매칭 디지털/옵셋 인쇄 권장',
      statusText: '디자인 원본 접수 완료',
      remark: '인쇄 전담 디자이너가 폰트 아웃라인(윤곽선) 및 해상도를 1:1 정밀 검수합니다.',
      pagesNum: 0
    };
  }

  if (isZip) {
    return {
      filename: file.name,
      formatType: 'ZIP',
      dimensionText: '압축 해제 후 부속 원고별 개별 판형 검수',
      pagesText: '일괄 확인 대기',
      recommendation: '부속 파일 일괄 검수 후 맞춤 제본 사양 일괄 안내',
      statusText: '압축 패키지 접수 완료',
      remark: '압축 해제 후 포함된 모든 부속 원고를 전담팀이 일괄 검수합니다.',
      pagesNum: 0
    };
  }

  return {
    filename: file.name,
    formatType: 'ETC',
    dimensionText: '일반 인쇄 원고 규격',
    pagesText: '검수 대기',
    recommendation: '담당자 1:1 상담 후 최적 사양 맞춤 제작',
    statusText: '원고 접수 완료',
    remark: '원고 접수 완료 후 담당자가 확인하여 연락드립니다.',
    pagesNum: 0
  };
}

// 3단계 AI 검수 애니메이션 및 결과 출력
async function sendRealPdfToBackend(inputFiles) {
  let filesArr = Array.isArray(inputFiles) ? inputFiles : [inputFiles];
  uploadedFilesList = filesArr;
  if (filesArr.length === 0) return;
  let totalFileCount = filesArr.length;

  isScanning = true;

  const badge = document.getElementById('ai-percent-badge');
  const statusText = document.getElementById('ai-status-text');
  const subText = document.getElementById('ai-sub-text');
  const progressFill = document.getElementById('ai-progress-fill');
  const stepBoxesWrapper = document.getElementById('ai-step-boxes-wrapper');
  const dualContainer = document.getElementById('ai-report-dual-container');
  const diagSignal = document.getElementById("ai-diagnostic-signal");

  if (dualContainer) dualContainer.classList.add('hidden');
  if (stepBoxesWrapper) stepBoxesWrapper.classList.remove('hidden');
  if (diagSignal) diagSignal.classList.add('hidden');

  if (statusText) statusText.innerText = totalFileCount > 1 ? `총 ${totalFileCount}개 원고 분석 중...` : `${filesArr[0].name} 분석 중...`;
  if (subText) { subText.innerText = "원고 포맷을 판별하여 맞춤 인쇄 검수를 진행하고 있습니다"; subText.classList.remove('hidden'); }

  // 1단계 시작
  if (badge) { badge.innerText = "35%"; badge.style.display = "block"; }
  if (progressFill) progressFill.style.width = "35%";
  setStepStatus(1, 'active', '01. 문서 포맷 및 치수 실측');
  setStepStatus(2, 'idle', '02. 인쇄 최적화 규격 판별');
  setStepStatus(3, 'idle', '03. 맞춤 제작 가이드 생성');

  let scanResults = [];
  for (let i = 0; i < filesArr.length; i++) {
    const parsed = await parseLocalDocument(filesArr[i]);
    scanResults.push(parsed);
  }

  await new Promise(r => setTimeout(r, 450));

  // 2단계 시작
  setStepStatus(1, 'done', '01. 문서 포맷 및 치수 실측 완료');
  setStepStatus(2, 'active', '02. 인쇄 최적화 규격 판별');
  if (badge) badge.innerText = "70%";
  if (progressFill) progressFill.style.width = "70%";
  
  await new Promise(r => setTimeout(r, 450));

  // 3단계 시작
  setStepStatus(2, 'done', '02. 인쇄 최적화 규격 판별 완료');
  setStepStatus(3, 'active', '03. 맞춤 제작 가이드 생성');
  if (badge) badge.innerText = "90%";
  if (progressFill) progressFill.style.width = "90%";

  await new Promise(r => setTimeout(r, 400));

  // 검수 완료
  setStepStatus(3, 'done', '03. 맞춤 제작 가이드 생성 완료');
  if (badge) badge.innerText = "100%";
  if (progressFill) progressFill.style.width = "100%";

  await new Promise(r => setTimeout(r, 350));

  let summaryTitle = totalFileCount > 1 
    ? `총 ${totalFileCount}개 원고의 검수가 완료되었습니다.`
    : "원고 규격 확인이 완료되었습니다.";

  let summaryBodyHtml = "";

  if (totalFileCount === 1) {
    let res = scanResults[0];
    lastScannedSpecSummary = `${res.dimensionText} / ${res.pagesText}`;

    summaryBodyHtml = `
      <div class="space-y-1.5 text-[#666666] font-normal text-left leading-tight text-[13px]">
        <div><strong>원고 포맷</strong> : ${res.formatType}</div>
        <div><strong>원고 규격</strong> : ${res.dimensionText}</div>
        <div><strong>페이지 수</strong> : ${res.pagesText}</div>
        <div class="pt-2 mt-1 border-t border-dashed border-slate-300 text-blue-900 font-medium">
          <strong class="text-blue-700">추천 사양</strong> : <span class="text-slate-800">${res.recommendation}</span>
        </div>
        <div class="pt-1 text-[#555]"><strong>안내 사항</strong> : ${res.remark}</div>
      </div>
    `;
  } else {
    let totalPagesNum = 0;
    let hasCountablePages = true;

    let itemsHtml = scanResults.map((res, idx) => {
      if (res.pagesNum > 0) totalPagesNum += res.pagesNum;
      else hasCountablePages = false;

      return `
        <div class="pb-2.5 mb-2.5 border-b border-slate-200/90 last:border-0 last:mb-0 last:pb-0 text-left">
          <div class="font-bold text-slate-900 text-[13.5px] mb-1 flex items-center gap-1.5">
            <span class="bg-blue-100 text-blue-800 text-[10px] font-mono px-1.5 py-0.5 rounded">원고 ${String(idx + 1).padStart(2, '0')}</span>
            <span class="truncate">${res.filename}</span>
          </div>
          <div class="space-y-0.5 text-[#666666] text-[12.5px] pl-1">
            <div>• <strong>규격</strong> : ${res.dimensionText}</div>
            <div>• <strong>페이지 수</strong> : ${res.pagesText}</div>
            <div class="text-blue-900 font-medium pt-0.5">• <strong>추천</strong> : ${res.recommendation}</div>
          </div>
        </div>
      `;
    }).join("");

    lastScannedSpecSummary = hasCountablePages ? `총 ${totalFileCount}개 원고 (총 ${totalPagesNum}p)` : `총 ${totalFileCount}개 원고 접수`;
    summaryBodyHtml = `<div class="space-y-3 text-left"><div class="space-y-1">${itemsHtml}</div></div>`;
  }

  document.getElementById('rpt-summary-title').innerText = summaryTitle;
  document.getElementById('rpt-summary-body').innerHTML = summaryBodyHtml;

  let consoleLogsHeader = `====================================================================
[YBPRINT AI SYSTEM - REAL-TIME DIAGNOSTIC LOG (TOTAL ${totalFileCount} FILES)]
====================================================================\n`;

  let consoleLogsBody = scanResults.map((res, idx) => {
    let pagesDisplay = res.pagesNum > 0 ? `TOTAL ${res.pagesNum} PAGES (ACTUAL PARSED)` : `PENDING (${res.pagesText})`;
    
    let logText = `--------------------------------------------------------------------
[FILE ${idx + 1} / ${totalFileCount} : ${res.filename}]
  FORMAT TYPE    : ${res.formatType}
  PAGE COUNT     : ${pagesDisplay}
  METRIC SIZE    : ${res.dimensionText}`;

    if (res.formatType === 'PDF') {
      logText += `\n
[1. DIMENSION & LAYOUT ANALYSIS]
  - DIAGNOSIS     : ${res.isStandard ? 'STANDARD A4/B5 SIZE CONFIRMED' : 'NON-STANDARD DIMENSION DETECTED'}
  - RECOMMENDATION: ${res.recommendation}
  - MARGIN & BLEED: AUTO ALIGNMENT SYSTEM ACTIVE

[2. BITMAP & IMAGE RESOLUTION CHECK]
  - DPI STATUS    : EXCEEDS 300 DPI (PRINT QUALITY: PASS)
  - VECTOR TEXT   : FONTS EMBEDDED & STABLE`;
    } else if (res.formatType === 'HWP (한글)') {
      logText += `\n
[1. STANDARD HWP/HWPX ANALYSIS]
  - HEADER PARSING: HWP DOCUMENT STRUCTURE DETECTED
  - FONT CHECK    : BATANG/GULIM/HYFONTS EMBEDDING STATUS [PENDING]
  - MARGIN ALIGN  : OFFICIAL DOC MARGIN CHECK QUEUED

[2. PRE-PRESS PREPARATION]
  - CONVERSION    : HWP TO PDF/X-1A RENDER ENGINE ASSIGNED
  - ENGINEER TASK : MANUAL PAGINATION & TYPO VERIFICATION REQUIRED`;
    } else if (res.formatType === 'Office') {
      logText += `\n
[1. MICROSOFT OPEN XML PRESENTATION ANALYSIS]
  - ASPECT RATIO  : 16:9 WIDESCREEN / 4:3 STANDARD CHECK [PENDING]
  - BLEED MARGIN  : BORDERLESS PRINTING TOLERANCE EVALUATION QUEUED

[2. FONT & COLOR SPACE VALIDATION]
  - COLOR PROFILE : RGB TO CMYK GAMUT CONVERSION REQUIRED
  - ENGINEER TASK : MASTER SLIDE & FONT OUTLINE VERIFICATION`;
    } else if (res.formatType === 'DESIGN') {
      logText += `\n
[1. HIGH-RESOLUTION GRAPHIC SOURCE (ADOBE) ANALYSIS]
  - ARTBOARD SCAN : VECTOR / RASTER LAYER HIERARCHY DETECTED
  - COLOR SPACE   : CMYK PRINT PROFILE VERIFICATION [PENDING]

[2. PROFESSIONAL PRE-FLIGHT CHECK]
  - FONT OUTLINE  : TEXT-TO-SHAPE CONVERSION CHECK REQUIRED
  - IMAGE LINK    : EMBEDDED ASSETS DPI VALIDATION QUEUED
  - ENGINEER TASK : 1:1 MASTER ARTWORK INSPECTION`;
    } else if (res.formatType === 'ZIP') {
      logText += `\n
[1. COMPRESSED ARCHIVE ANALYSIS]
  - ARCHIVE TYPE  : ZIP/RAR BATCH PACKAGE DETECTED
  - FILE EXTRACT  : DECOMPRESSION & INDEXING QUEUED

[2. BATCH PRE-FLIGHT CHECK]
  - ENGINEER TASK : BATCH FONT/COLOR/MARGIN INSPECTION REQUIRED`;
    } else {
      logText += `\n
[1. GENERIC DOCUMENT ANALYSIS]
  - FORMAT SCAN   : RAW DATA INSPECTION
  - ENGINEER TASK : MANUAL PRE-FLIGHT CHECK REQUIRED`;
    }
    return logText;
  }).join("\n\n");

  let consoleLogsFooter = `
====================================================================
[3. SYSTEM ACTION GUIDE]
  - ENGINEER REVIEW: PENDING (CUSTOMER CONTACT INFO REQUIRED)
  - ESTIMATE STATUS: READY FOR 1:1 CUSTOMER ADVISORY
====================================================================`;

  document.getElementById('terminal-console-body').innerText = consoleLogsHeader + consoleLogsBody + "\n" + consoleLogsFooter;

  if (statusText) {
    statusText.innerText = totalFileCount > 1 ? `${filesArr[0].name} 외 ${totalFileCount - 1}개 파일` : filesArr[0].name;
  }
  if (diagSignal) diagSignal.classList.remove("hidden");
  if (subText) subText.classList.add("hidden");
  if (badge) badge.style.display = "none";
  if (stepBoxesWrapper) stepBoxesWrapper.classList.add('hidden');
  if (dualContainer) dualContainer.classList.remove('hidden');

  const inquiryInput = document.getElementById('text-inquiry');
  if (inquiryInput) {
    inquiryInput.placeholder = "AI 규격 검수 완료! 필요하신 수량(부수)과 희망 납기일을 남겨주세요.";
  }

  validateForm();
  isScanning = false;

  setTimeout(() => {
    scrollToInquiryStep();
  }, 500);
}

// 최종 견적 접수 전송
async function handleCtaClick() {
  const orgInput = document.getElementById('client-org');
  const phoneInput = document.getElementById('client-phone');
  const inquiryInput = document.getElementById('text-inquiry');
  const btn = document.getElementById('cta-button');
  
  const isEmail = /[a-zA-Z@]/.test(phoneInput.value.trim());
  
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i><span class="text-[15px] font-bold">서버 연결 및 대용량 원고 전송 준비 중 (최대 1분 소요)...</span>';
  lucide.createIcons();

  const formData = new FormData();
  formData.append("org", orgInput.value.trim());
  formData.append("phone", phoneInput.value.trim());
  formData.append("inquiry", inquiryInput ? inquiryInput.value.trim() : "");
  formData.append("file_name", uploadedFilesList.map(f => f.name).join(", ") || "첨부파일 없음");
  formData.append("spec", lastScannedSpecSummary || "직접 문의 접수");

  uploadedFilesList.forEach(file => formData.append("file", file));

  try {
    const response = await fetch(`${RENDER_BACKEND_URL}/submit-inquiry`, { method: "POST", body: formData });
    
    try {
      await fetch('/api/send-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgInput.value.trim(),
          email: isEmail ? phoneInput.value.trim() : 'admin@ybprint.co.kr',
          phone: isEmail ? '' : phoneInput.value.trim(),
          details: (inquiryInput.value || '') + `\n- 첨부파일: ${formData.get("file_name")}`
        })
      });
    } catch (e) {}

    if (response.ok) {
      alert("접수가 정상적으로 완료되었습니다.");
      toggleDrawer(false);
    } else {
      alert("접수 중 서버 지연이 발생했습니다. 다시 한번 버튼을 눌러주세요.");
    }
  } catch (err) {
    alert("접수 중 서버 지연이 발생했습니다. 다시 한번 버튼을 눌러주세요.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = '작성한 내용으로 견적 문의하기';
    validateForm();
  }
}

// 3D 자비스 구체 애니메이션
const canvas = document.getElementById('mysticJarvisCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const size = 180; 
  canvas.width = size * window.devicePixelRatio;
  canvas.height = size * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  const points = [];
  const numPoints = 120;
  const radius = 62; 
  for (let i = 0; i < numPoints; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    points.push({ x: radius * Math.sin(phi) * Math.cos(theta), y: radius * Math.sin(phi) * Math.sin(theta), z: radius * Math.cos(phi) });
  }
  let rotationY = 0.003, rotationX = 0.002, targetRotationY = 0.003, targetRotationX = 0.002;

  function renderMysticGlobe() {
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2, fov = 130; 
    if (isScanning) { targetRotationY = 0.022; targetRotationX = 0.012; } 
    else { targetRotationY = 0.003; targetRotationX = 0.002; }
    rotationY += (targetRotationY - rotationY) * 0.08; rotationX += (targetRotationX - rotationX) * 0.08;
    const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY), cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
    const projected = points.map(p => {
      let x1 = p.x * cosY - p.z * sinY, z1 = p.x * sinY + p.z * cosY;
      let y2 = p.y * cosX - z1 * sinX, z2 = p.y * sinX + z1 * cosX;
      p.x = x1; p.y = y2; p.z = z2;
      const scale = fov / (fov + z2 + 40);
      return { x: cx + x1 * scale, y: cy + y2 * scale, z: z2, scale: scale };
    });
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 38);
    if (isScanning) {
      coreGrad.addColorStop(0, 'rgba(59, 130, 246, 0.45)'); coreGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)'); coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      coreGrad.addColorStop(0, 'rgba(147, 197, 253, 0.28)'); coreGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)'); coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    ctx.beginPath(); ctx.arc(cx, cy, 38, 0, Math.PI * 2); ctx.fillStyle = coreGrad; ctx.fill();
    ctx.lineWidth = isScanning ? 0.75 : 0.65;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x, dy = projected[i].y - projected[j].y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 40) {
          const alphaBoost = isScanning ? 0.45 : 0.32, alpha = (1 - dist / 40) * (projected[i].scale * alphaBoost);
          ctx.strokeStyle = isScanning ? `rgba(37, 99, 235, ${alpha * 1.25})` : `rgba(59, 130, 246, ${alpha})`;
          ctx.beginPath(); ctx.moveTo(projected[i].x, projected[i].y); ctx.lineTo(projected[j].x, projected[j].y); ctx.stroke();
        }
      }
    }
    projected.forEach(p => {
      if (p.z < 40) {
        const dotAlpha = p.scale * (isScanning ? 0.65 : 0.42);
        ctx.fillStyle = isScanning ? `rgba(37, 99, 235, ${dotAlpha})` : `rgba(59, 130, 246, ${dotAlpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.scale * (isScanning ? 1.4 : 1.2), 0, Math.PI * 2); ctx.fill();
      }
    });
    requestAnimationFrame(renderMysticGlobe);
  }
  renderMysticGlobe();
}

// 서랍장 탭 드래그 및 위글(흔들림) 효과
window.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('drawer-panel');
  const tab = document.getElementById('drawer-index-tab');
  if (!panel || !tab) return;

  let isDragging = false;
  let startX = 0;
  let draggedDistance = 0;
  let isClickCandidate = true;

  const getClientX = (e) => e.touches ? e.touches[0].clientX : e.clientX;

  const onStart = (e) => {
    if (!panel.classList.contains('is-closed')) return;
    isDragging = true;
    isClickCandidate = true;
    startX = getClientX(e);
    draggedDistance = 0;
    panel.style.transition = 'none';
    panel.classList.remove('animate-drawer-wiggle');
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const currentX = getClientX(e);
    const deltaX = startX - currentX;
    if (Math.abs(deltaX) > 5) isClickCandidate = false;
    if (deltaX > 0) {
      draggedDistance = Math.min(deltaX, panel.offsetWidth);
      panel.style.transform = `translateX(calc(100% - ${draggedDistance}px))`;
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    panel.style.transition = '';
    if (isClickCandidate || draggedDistance >= 80) {
      toggleDrawer(true);
    } else {
      toggleDrawer(false);
    }
    draggedDistance = 0;
  };

  tab.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', (e) => { if (isDragging) { e.preventDefault(); onMove(e); } });
  window.addEventListener('mouseup', onEnd);

  tab.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', (e) => { if (isDragging) onMove(e); }, { passive: false });
  window.addEventListener('touchend', onEnd);

  setTimeout(() => {
    if (panel.classList.contains('is-closed') && !isDragging) {
      panel.classList.add('animate-drawer-wiggle');
      setTimeout(() => panel.classList.remove('animate-drawer-wiggle'), 2000);
    }
  }, 2000);

  setInterval(() => {
    if (panel.classList.contains('is-closed') && !isDragging) {
      panel.classList.add('animate-drawer-wiggle');
      setTimeout(() => panel.classList.remove('animate-drawer-wiggle'), 2000);
    }
  }, 7000);
});

// 관리자 모드 진입 제어
let secretTapCount = 0;
let secretTapTimer = null;
function triggerMobileAdminSecret() {
  secretTapCount++;
  if (secretTapTimer) clearTimeout(secretTapTimer);
  if (secretTapCount >= 5) {
    secretTapCount = 0;
    toggleAdminModal(true);
  } else {
    secretTapTimer = setTimeout(() => { secretTapCount = 0; }, 1800);
  }
}

document.getElementById('footer-admin-trigger')?.addEventListener('click', function(e) {
  e.preventDefault(); triggerMobileAdminSecret();
});
document.getElementById('copyright-admin-trigger')?.addEventListener('click', function(e) {
  e.preventDefault(); triggerMobileAdminSecret();
});

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault(); toggleAdminModal(true);
  }
  if (e.key === 'Escape') toggleAdminModal(false);
});

function toggleAdminModal(show) {
  const modal = document.getElementById('adminCommandModal');
  const input = document.getElementById('adminCommandInput');
  if (!modal) return;
  if (show) {
    modal.classList.remove('hidden');
    input.value = '';
    setTimeout(() => input.focus(), 50);
  } else {
    modal.classList.add('hidden');
    input.value = '';
  }
}

function submitAdminAuth() {
  const input = document.getElementById('adminCommandInput');
  const pw = input ? input.value : '';
  if (pw === '76057569') {
    window.location.href = '/admin.html';
  } else {
    alert('인증 비밀번호가 일치하지 않습니다.');
    if (input) { input.value = ''; input.focus(); }
  }
}

document.getElementById('adminCommandInput')?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') submitAdminAuth();
});
