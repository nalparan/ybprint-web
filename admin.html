<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>청년인쇄사 관리자 센터</title>
  <link rel="icon" type="image/png" href="/favicon.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Noto+Sans+KR:wght@400;600;700;900&family=Urbanist:wght@500;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: "Pretendard Variable", Pretendard, -apple-system, sans-serif; background-color: #F2F4F6; color: #191F28; letter-spacing: -0.02em; }
    .font-mono-code { font-family: 'Fira Code', monospace; }
    .font-urbanist { font-family: 'Urbanist', sans-serif; }
    .table-row-hover:hover { background-color: #F8FAFC; }
    
    @keyframes liveDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.85); } }
    .live-indicator { animation: liveDot 2s infinite ease-in-out; }

    /* 관공서 정산용 엑셀 1:1 출력 스타일 */
    .quote-paper { background: #FFFFFF; font-family: 'Malgun Gothic', "Pretendard Variable", sans-serif; color: #000000; }
    .excel-table { border: 1.5px solid #000000 !important; border-collapse: collapse !important; width: 100%; }
    .excel-table th, .excel-table td { border: 1px solid #333333 !important; padding: 6px 8px; }

    /* 공식 직인(도장) 효과 */
    .stamp-seal {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border: 2px solid #dc2626; border-radius: 50%;
      color: #dc2626; font-size: 11px; font-weight: 900; line-height: 1;
      transform: rotate(-10deg); margin-left: 6px; vertical-align: middle;
      background: rgba(239, 68, 68, 0.05); mix-blend-mode: multiply; user-select: none;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">

  <!-- 상단 네비게이션 바 -->
  <header class="bg-white/95 backdrop-blur-md border-b border-[#E5E8EB] px-4 sm:px-[5vw] py-3.5 sm:py-0 sm:h-20 flex items-center justify-between sticky top-0 z-40 shadow-xs">
    <div class="flex items-center gap-3">
      <img src="/favicon.png" alt="청년인쇄사 로고" class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-contain shadow-xs border border-[#E5E8EB] p-1 bg-white shrink-0">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-extrabold text-base sm:text-xl text-[#191F28] tracking-tight">청년인쇄사</h1>
          <span class="text-[10px] sm:text-[11px] font-mono-code font-bold bg-[#E8F3FF] text-[#1B64DA] border border-[#BBDDFF] px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <p class="text-[11px] sm:text-[13px] text-[#8B95A1] font-medium truncate max-w-[180px] sm:max-w-none">실시간 견적 문의 현황판</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <div class="hidden lg:flex items-center gap-2 bg-[#F2F4F6] border border-[#E5E8EB] px-3.5 py-1.5 rounded-xl">
        <span class="w-2.5 h-2.5 rounded-full bg-[#00B46B] live-indicator shadow-[0_0_8px_#00B46B]"></span>
        <span class="text-xs font-mono-code font-bold text-[#4E5968]" id="server-status-label">Render Live</span>
      </div>
      
      <!-- 복원된 홈 이동 버튼 (←) -->
      <a href="/" class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white hover:bg-[#F2F4F6] text-[#4E5968] hover:text-[#191F28] rounded-xl border border-[#E5E8EB] transition-all cursor-pointer shadow-xs" title="메인 홈페이지로 이동">
        <i data-lucide="arrow-left" class="w-4 h-4 text-[#8B95A1]"></i>
      </a>

      <button onclick="fetchInquiries()" class="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-[#3182F6] hover:bg-[#1B64DA] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer">
        <i data-lucide="refresh-cw" id="refresh-icon" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
        <span>새로고침</span>
      </button>
    </div>
  </header>

  <!-- 메인 대시보드 -->
  <main class="flex-1 w-full px-4 sm:px-[5vw] py-5 sm:py-8 space-y-5">
    
    <!-- 3종 통계 카드 -->
    <div class="grid grid-cols-3 gap-3 sm:gap-5">
      <div class="bg-white border rounded-2xl p-4 sm:p-6 shadow-xs">
        <div class="flex items-center justify-between text-[#8B95A1] mb-2">
          <span class="text-[12px] sm:text-sm font-bold tracking-tight">오늘 접수</span>
          <i data-lucide="inbox" class="w-5 h-5 text-[#3182F6]"></i>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl sm:text-4xl font-extrabold font-urbanist" id="stat-today-count">0</span>
          <span class="text-xs font-bold text-[#8B95A1]">건</span>
        </div>
      </div>
      <div class="bg-white border rounded-2xl p-4 sm:p-6 shadow-xs">
        <div class="flex items-center justify-between text-[#8B95A1] mb-2">
          <span class="text-[12px] sm:text-sm font-bold tracking-tight">원고 첨부</span>
          <i data-lucide="file-check-2" class="w-5 h-5 text-[#00B46B]"></i>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl sm:text-4xl font-extrabold text-[#00B46B] font-urbanist" id="stat-file-count">0</span>
          <span class="text-xs font-bold text-[#8B95A1]">건</span>
        </div>
      </div>
      <div class="bg-white border rounded-2xl p-4 sm:p-6 shadow-xs">
        <div class="flex items-center justify-between text-[#8B95A1] mb-2">
          <span class="text-[12px] sm:text-sm font-bold tracking-tight">서버 상태</span>
          <i data-lucide="server" class="w-5 h-5 text-[#8B5CF6]"></i>
        </div>
        <div class="flex items-center gap-1.5 pt-1">
          <span class="w-2 h-2 rounded-full bg-[#00B46B] live-indicator"></span>
          <span class="text-xs sm:text-sm font-bold text-[#00B46B]">정상 가동</span>
        </div>
      </div>
    </div>

    <!-- 접수 내역 테이블 -->
    <div class="bg-white border rounded-3xl overflow-hidden shadow-xs w-full">
      <div class="p-5 sm:p-7 border-b flex items-center justify-between">
        <h2 class="text-lg sm:text-xl font-extrabold text-[#191F28] flex items-center gap-2">
          <span>접수 내역</span>
          <span class="text-xs font-mono-code font-bold bg-[#E8F3FF] text-[#1B64DA] px-2 py-0.5 rounded-full" id="total-badge">0건</span>
        </h2>
        <div class="relative w-64">
          <i data-lucide="search" class="w-4 h-4 text-[#8B95A1] absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" id="search-input" oninput="filterInquiries()" placeholder="소속, 연락처 검색..." class="w-full bg-[#F2F4F6] border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#3182F6] transition-all" />
        </div>
      </div>

      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr class="bg-[#F9FAFB] text-[#6B7684] text-[13px] font-bold border-b">
              <th class="py-4 px-5 font-mono-code w-16 text-center">NO</th>
              <th class="py-4 px-4 w-36">접수 시간</th>
              <th class="py-4 px-5 w-48">소속 / 성함</th>
              <th class="py-4 px-4 w-44">연락처</th>
              <th class="py-4 px-5 w-[360px]">첨부 원고 / 규격</th>
              <th class="py-4 px-5">문의 및 요청사항</th>
              <th class="py-4 px-4 text-center w-[120px]">관리</th>
            </tr>
          </thead>
          <tbody id="inquiry-table-body" class="divide-y text-[14px]">
            <tr><td colspan="7" class="py-16 text-center text-[#8B95A1]">서버에서 접수 내역을 불러오는 중입니다...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- 견적 발송 메인 모달 -->
  <div id="quote-modal" class="fixed inset-0 z-[60] hidden bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-5xl rounded-3xl flex flex-col shadow-2xl h-[94vh] sm:h-[90vh] overflow-hidden">
      
      <!-- 모달 헤더 -->
      <div class="p-5 border-b flex justify-between items-center shrink-0">
        <div>
          <h3 class="font-extrabold text-lg flex items-center gap-2"><i data-lucide="calculator" class="w-5 h-5 text-[#3182F6]"></i>청년인쇄사 자동 견적 엔진</h3>
          <p class="text-[#8B95A1] text-xs mt-1">공공기관용 공식 견적서를 생성하고 이메일로 전송합니다.</p>
        </div>
        <button onclick="closeQuoteModal()" class="w-8 h-8 rounded-full hover:bg-gray-100 flex justify-center items-center">✕</button>
      </div>

      <!-- 상단 단계 탭 -->
      <div class="flex items-center px-6 py-3.5 bg-gray-50 border-b shrink-0 select-none">
        <div onclick="goToStep(1)" class="flex-1 flex items-center cursor-pointer">
          <div id="step-dot-1" class="w-7 h-7 rounded-full bg-[#3182F6] text-white flex items-center justify-center font-bold text-xs shadow-md">1</div>
          <span id="step-text-1" class="ml-2 font-extrabold text-[#191F28] text-sm">① 자동견적작성</span><div class="flex-1 h-px bg-gray-200 mx-3"></div>
        </div>
        <div onclick="goToStep(2)" class="flex-1 flex items-center cursor-pointer">
          <div id="step-dot-2" class="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">2</div>
          <span id="step-text-2" class="ml-2 font-bold text-gray-500 text-sm">② 견적검증(3종 엑셀뷰)</span><div class="flex-1 h-px bg-gray-200 mx-3"></div>
        </div>
        <div onclick="goToStep(3)" class="flex-1 flex items-center cursor-pointer">
          <div id="step-dot-3" class="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">3</div>
          <span id="step-text-3" class="ml-2 font-bold text-gray-500 text-sm">③ 메일 발송 & 다운로드</span>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-5 sm:p-6 bg-gray-50 relative">
        
        <!-- STEP 1: 입력 화면 -->
        <div id="quote-step-1-content" class="space-y-4" style="display: block;">
          <div class="flex gap-4">
            <div class="flex-1 bg-white p-4 rounded-xl border">
              <label class="text-xs font-bold text-gray-500 block mb-1">수신 기관 (고객명)</label>
              <input type="text" id="input-org" class="w-full text-sm font-bold border rounded-lg px-3 py-2 bg-gray-50" readonly>
              <input type="hidden" id="input-phone">
            </div>
            <div class="w-40 bg-white p-4 rounded-xl border">
              <label class="text-xs font-bold text-gray-500 block mb-1">제작 부수 (권)</label>
              <input type="number" id="input-qty" min="1" value="100" class="w-full text-sm font-bold border rounded-lg px-3 py-2 font-mono-code" oninput="onTemplateChange()">
            </div>
            <div class="w-40 bg-white p-4 rounded-xl border">
              <label class="text-xs font-bold text-gray-500 block mb-1">원고 페이지</label>
              <input type="number" id="input-page" min="1" value="26" class="w-full text-sm font-bold border rounded-lg px-3 py-2 font-mono-code" oninput="onTemplateChange()">
            </div>
            <div class="flex-1 bg-white p-4 rounded-xl border border-blue-200">
              <label class="text-xs font-bold text-gray-500 block mb-1">견적서 서식 선택</label>
              <select id="input-template" class="w-full text-sm font-bold border rounded-lg px-3 py-2 text-blue-700 bg-blue-50 focus:outline-none" onchange="onTemplateChange()">
                <option value="디지탈상세">🏛️ 디지탈상세 (인재개발원형 - 4열)</option>
                <option value="디지털일반">📄 디지털일반 (글로벌리서치형 - 7열)</option>
                <option value="옵셋일반">🖨️ 옵셋일반 (비즈쿡형 - 관리비포함)</option>
              </select>
            </div>
          </div>

          <div class="bg-white p-5 rounded-xl border">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-bold">세부 산출 내역</h4>
              <button onclick="addEmptyRow()" class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">+ 직접 추가</button>
            </div>
            <div class="overflow-x-auto border rounded-lg mb-4">
              <table class="w-full text-left min-w-[700px]">
                <thead class="bg-gray-50 text-xs font-bold border-b">
                  <tr>
                    <th class="py-2 px-2 text-center w-16">항목</th><th class="py-2 px-2 text-center w-20">내역</th><th class="py-2 px-2">규격 / 산출내역</th>
                    <th class="py-2 px-2 text-center w-16">수량</th><th class="py-2 px-2 text-right w-24">단가(원)</th><th class="py-2 px-2 text-right w-28">공급가액</th>
                    <th class="py-2 px-2 w-32">비고</th><th class="py-2 px-2 text-center w-10">삭제</th>
                  </tr>
                </thead>
                <tbody id="quote-tbody" class="text-xs divide-y"></tbody>
              </table>
            </div>
            <div class="bg-gray-50 border rounded-lg p-4 text-right space-y-1.5">
              <div class="text-xs font-bold text-gray-500">공급가액 소계: <span id="val-sub" class="w-32 inline-block font-mono-code text-gray-900">0</span></div>
              <div class="text-xs font-bold text-gray-500">부가가치세 (10%): <span id="val-vat" class="w-32 inline-block font-mono-code text-gray-900">0</span></div>
              <div class="text-lg font-black pt-2 border-t mt-2">총 견적합계: <span id="val-total" class="w-32 inline-block font-mono-code text-blue-600">0</span></div>
            </div>
          </div>
        </div>

        <!-- STEP 2: 3종 엑셀 실물 뷰 (인쇄 영역) -->
        <div id="quote-step-2-content" style="display: none;">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800 font-medium">
            <i data-lucide="shield-check" class="w-4 h-4 inline-block mr-1"></i> 고객에게 전송될 실제 견적서(엑셀 원본 구조+직인)를 확인해주세요.
          </div>
          <div id="quote-printable-area" class="quote-paper p-8 rounded-xl max-w-4xl mx-auto bg-white border shadow-sm">
            <!-- 엑셀 HTML 렌더링 영역 -->
          </div>
        </div>

        <!-- STEP 3: 고객 메일 발송 -->
        <div id="quote-step-3-content" style="display: none;" class="max-w-2xl mx-auto py-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><i data-lucide="send" class="w-8 h-8 text-blue-600"></i></div>
            <h3 class="text-xl font-bold">견적서 발송 준비 완료</h3>
            <p class="text-gray-500 text-sm mt-1">이메일 발송 시 본문 요약 카드와 함께 <strong>PDF가 자동 첨부</strong>됩니다.</p>
          </div>

          <div class="bg-white border rounded-2xl p-6 shadow-sm mb-6 text-sm text-gray-700 leading-relaxed">
            <div class="font-bold text-gray-400 border-b pb-2 mb-3 text-xs flex items-center gap-1"><i data-lucide="mail" class="w-4 h-4"></i>고객 수신 메일 (미리보기)</div>
            <p>안녕하세요, <strong><span id="msg-target-org" class="text-blue-600"></span></strong> 담당자님!</p>
            <p class="mt-2">청년인쇄사에 문의해 주셔서 감사드립니다. 요청하신 견적서를 <strong>PDF 파일로 첨부</strong>해 드립니다.</p>
            <div class="bg-gray-50 p-4 rounded-xl border mt-4">
              <p>■ 수신처 : <span id="msg-target-org-2"></span></p>
              <p>■ 양식 : <span id="msg-target-template"></span></p>
              <p class="text-blue-700 font-bold mt-1">■ 총 견적금액 : <span id="msg-target-total" class="font-mono-code"></span> 원 (VAT 포함)</p>
            </div>
            <p class="mt-4 text-xs text-gray-500">※ 세부 내역 및 결재 서류 안내는 첨부된 PDF를 확인해 주시기 바랍니다.</p>
          </div>
        </div>

      </div>

      <!-- 하단 고정 버튼 -->
      <div class="p-4 border-t bg-white flex justify-between shrink-0">
        <button id="btn-prev" onclick="goToStep(currentQuoteStep - 1)" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hidden transition-colors hover:bg-gray-200">이전 단계</button>
        <div class="flex-1"></div>
        <button id="btn-next" onclick="goToStep(currentQuoteStep + 1)" class="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md transition-all hover:bg-blue-700 flex items-center gap-1">다음 단계 <i data-lucide="arrow-right" class="w-4 h-4"></i></button>
        
        <div id="action-buttons" class="hidden flex gap-3">
          <button onclick="downloadPDF()" id="btn-download" class="px-6 py-2.5 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-1.5"><i data-lucide="download" class="w-4 h-4"></i> PDF 저장</button>
          <button onclick="sendEmail()" id="btn-email" class="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-all flex items-center gap-1.5"><i data-lucide="mail" class="w-4 h-4"></i> 메일 전송 (PDF 첨부)</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    lucide.createIcons();
    const API_URL = "https://ybprint-backend-1.onrender.com/inquiries";
    let inquiries = [], displayedInquiries = [], deletedItems = [], completedItems = [];
    let currentQuoteStep = 1;

    // 단가표
    const PRICE = { bw: 50, cover: 1700, coat: 2200, bind: 3300 };

    // 로컬 스토리지 데이터 로드
    try {
      deletedItems = JSON.parse(localStorage.getItem('yb_deleted_items')) || [];
      completedItems = JSON.parse(localStorage.getItem('yb_completed_items')) || [];
    } catch(e) {}

    async function fetchInquiries() {
      const icon = document.getElementById('refresh-icon');
      if(icon) icon.classList.add('animate-spin');
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const rawList = Array.isArray(data) ? data : (data.inquiries || []);
        inquiries = rawList.filter(item => !deletedItems.includes(item.timestamp || item.created_at || item.time));
        displayedInquiries = [...inquiries].reverse();
        renderTable();
        document.getElementById('stat-today-count').innerText = inquiries.length;
        document.getElementById('stat-file-count').innerText = inquiries.filter(i => i.file_name && i.file_name !== "첨부파일 없음").length;
      } catch(e) {
        document.getElementById('inquiry-table-body').innerHTML = `<tr><td colspan="7" class="text-center py-10 text-red-500">서버 연결 지연 (Render 부팅 대기중...)</td></tr>`;
      } finally {
        if(icon) setTimeout(() => icon.classList.remove('animate-spin'), 500);
      }
    }

    function renderTable() {
      const tbody = document.getElementById('inquiry-table-body');
      document.getElementById('total-badge').innerText = `${displayedInquiries.length}건`;
      if(displayedInquiries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-16 text-gray-500">접수 내역이 없습니다.</td></tr>`;
        return;
      }
      tbody.innerHTML = displayedInquiries.map((item, i) => {
        const no = displayedInquiries.length - i;
        const time = item.timestamp || item.created_at || item.time || "-";
        const org = item.org || item.name || "-";
        const phone = item.phone || "-";
        const text = item.inquiry || "내용 없음";
        const files = item.file_name && item.file_name !== "첨부파일 없음" ? item.file_name.split(',') : [];
        const isComp = completedItems.includes(time);

        let fileHtml = files.length > 0 ? files.map(f => `<a href="https://ybprint-backend-1.onrender.com/download/${encodeURIComponent(f.trim())}" class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold border"><i data-lucide="download" class="w-3 h-3"></i> ${f.trim()}</a>`).join('') : '<span class="text-xs text-gray-400">첨부 없음</span>';
        
        let pMatch = text.match(/(\d+)\s*p/i) || item.spec?.match(/(\d+)\s*p/i);
        let qMatch = text.match(/(\d+)\s*부/);
        let p = pMatch ? pMatch[1] : 26;
        let q = qMatch ? qMatch[1] : 100;

        return `
          <tr class="hover:bg-gray-50 border-b ${isComp ? 'opacity-60 bg-gray-50' : ''}">
            <td class="py-4 px-5 text-center font-mono-code text-gray-400">${no}</td>
            <td class="py-4 px-4 font-mono-code text-xs">${time.split(' ')[0]}<br><span class="text-gray-400">${time.split(' ')[1]||''}</span></td>
            <td class="py-4 px-5 font-bold">${org}</td>
            <td class="py-4 px-4 text-blue-600 font-mono-code font-bold">${phone}</td>
            <td class="py-4 px-5 space-y-1">${fileHtml}<div class="text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">${item.spec||'-'}</div></td>
            <td class="py-4 px-5 text-sm text-gray-600 max-w-[200px] truncate">${text}</td>
            <td class="py-4 px-4 text-center">
              <div class="flex flex-col gap-1 w-[100px] mx-auto">
                <button onclick="openQuoteModal('${encodeURIComponent(org)}','${encodeURIComponent(phone)}',${q},${p},'${time}')" class="w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow">견적작성</button>
                <div class="flex gap-1">
                  <button onclick="toggleComp('${time}')" class="flex-1 py-1 bg-gray-100 rounded text-[10px] font-bold ${isComp?'text-green-600 bg-green-50 border border-green-200':''}">${isComp?'완료':'대기'}</button>
                  <button onclick="deleteItem('${time}')" class="px-2 bg-red-50 text-red-500 rounded border border-red-100"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
      lucide.createIcons();
    }

    function toggleComp(t){ completedItems.includes(t) ? completedItems=completedItems.filter(x=>x!==t) : completedItems.push(t); localStorage.setItem('yb_completed_items', JSON.stringify(completedItems)); renderTable(); }
    function deleteItem(t){ if(confirm("삭제하시겠습니까?")){ deletedItems.push(t); localStorage.setItem('yb_deleted_items', JSON.stringify(deletedItems)); fetchInquiries(); } }

    function openQuoteModal(org, phone, qty, page, timeKey) {
      document.getElementById('input-org').value = decodeURIComponent(org);
      document.getElementById('input-phone').value = decodeURIComponent(phone);
      document.getElementById('input-phone').dataset.timeKey = timeKey;
      document.getElementById('input-qty').value = qty;
      document.getElementById('input-page').value = page;
      onTemplateChange();
      goToStep(1);
      document.getElementById('quote-modal').classList.remove('hidden');
    }
    function closeQuoteModal() { document.getElementById('quote-modal').classList.add('hidden'); }

    function onTemplateChange() {
      const tmpl = document.getElementById('input-template').value;
      const q = parseInt(document.getElementById('input-qty').value)||100;
      const p = parseInt(document.getElementById('input-page').value)||26;
      const tp = q * p;
      document.getElementById('quote-tbody').innerHTML = '';

      if(tmpl === '디지탈상세') {
        const coverAndBind = PRICE.cover + PRICE.coat + PRICE.bind;
        addRow('교재제작', '본문 및 제본', `[(( ${q}부 x ${p}p) x ${PRICE.bw}원) + (${q}부 x ${coverAndBind.toLocaleString()}원)]`, 1, (tp*PRICE.bw)+(q*coverAndBind), '표지칼라/흑백/무선');
        addRow('기타', '배송', '관공서 직배송', 1, 0, '당일 배송');
      } else if(tmpl === '디지털일반') {
        addRow('기획', '-', '-', 0, 0, ''); addRow('디자인', '-', '-', 0, 0, '');
        addRow('제작', '칼라출력', '표지', q, PRICE.cover, '스노우250/단면');
        addRow('제작', '흑백출력', '내지', tp, PRICE.bw, `${p}p x ${q}부/모조80g`);
        addRow('제작', '코팅', '무광코팅', q, PRICE.coat, '표지 단면');
        addRow('제작', '제본', '무선제본', q, PRICE.bind, '책제본');
        addRow('기타', '배송', '세종직배송', 1, 0, '');
      } else {
        addRow('제작', '지대', '표지/내지', 1, 297800, '고시가');
        addRow('제작', 'CTP', '8판', 8, 18000, ''); addRow('제작', '인쇄', '옵셋', 8, 18000, '');
        addRow('제작', '코팅', '무광', q, PRICE.coat, ''); addRow('제작', '제본', '무선', q, PRICE.bind, '');
        addRow('제작', '일반관리비', '12%', 1, 0, '자동계산'); addRow('기타', '배송', '직배송', 1, 0, '');
      }
      calculateAll();
    }

    function addRow(t, n, d, q, p, r) {
      const tr = document.createElement('tr'); tr.className = "row-item";
      tr.innerHTML = `<td class="p-1"><input type="text" class="i-t w-full border rounded p-1 text-center text-xs" value="${t}" oninput="calculateAll()"></td><td class="p-1"><input type="text" class="i-n w-full border rounded p-1 text-center font-bold text-xs" value="${n}" oninput="calculateAll()"></td><td class="p-1"><input type="text" class="i-d w-full border rounded p-1 text-xs" value="${d}" oninput="calculateAll()"></td><td class="p-1"><input type="number" class="i-q w-full border rounded p-1 text-center text-xs font-mono-code" value="${q}" oninput="calculateAll()"></td><td class="p-1"><input type="number" class="i-p w-full border rounded p-1 text-right text-xs font-mono-code" value="${p}" oninput="calculateAll()"></td><td class="p-1"><input type="text" class="i-a w-full bg-gray-100 border rounded p-1 text-right text-xs font-bold font-mono-code" readonly></td><td class="p-1"><input type="text" class="i-r w-full border rounded p-1 text-xs text-gray-500" value="${r}" oninput="calculateAll()"></td><td class="p-1 text-center"><button class="text-red-400 font-bold" onclick="this.closest('tr').remove(); calculateAll()">X</button></td>`;
      document.getElementById('quote-tbody').appendChild(tr);
    }
    function addEmptyRow() { addRow('기타','직접입력','',1,0,''); calculateAll(); }

    function calculateAll() {
      let sub = 0, excl = 0; const rows = [];
      document.querySelectorAll('.row-item').forEach(tr => {
        const type=tr.querySelector('.i-t').value, name=tr.querySelector('.i-n').value, desc=tr.querySelector('.i-d').value;
        const qty=Number(tr.querySelector('.i-q').value)||0; let price=Number(tr.querySelector('.i-p').value)||0;
        if(document.getElementById('input-template').value==='옵셋일반' && name==='일반관리비') price = Math.round(excl * 0.12), tr.querySelector('.i-p').value=price;
        const amt = qty*price; tr.querySelector('.i-a').value=amt.toLocaleString(); sub+=amt;
        if(name!=='지대'&&name!=='일반관리비') excl+=amt;
        rows.push({type, name, desc, qty, price, amt, rem: tr.querySelector('.i-r').value});
      });
      const vat = Math.floor(sub*0.1), total = sub+vat;
      document.getElementById('val-sub').innerText=sub.toLocaleString(); document.getElementById('val-vat').innerText=vat.toLocaleString(); document.getElementById('val-total').innerText=total.toLocaleString();
      renderPaper(rows, sub, total);
    }

    function numToKor(n) {
      if(!n) return "영"; const u=["","만 ","억 ","조 "], su=["","십","백","천"], d=["","일","이","삼","사","오","육","칠","팔","구"];
      let r="", c=0; while(n>0){ let m=n%10000, s=""; for(let i=0;i<4;i++){ let di=m%10; if(di>0) s=d[di]+su[i]+s; m=Math.floor(m/10); } if(s) r=s+u[c]+r; c++; n=Math.floor(n/10000); } return r.trim();
    }

    function renderPaper(rows, sub, total) {
      const org = document.getElementById('input-org').value || "고객";
      const tmpl = document.getElementById('input-template').value;
      const q = document.getElementById('input-qty').value;
      const p = document.getElementById('input-page').value;
      const dt = new Date(), ds = `${dt.getFullYear()}년 ${String(dt.getMonth()+1).padStart(2,'0')}월 ${String(dt.getDate()).padStart(2,'0')}일`;
      const stamp = `<div style="display:inline-block; margin-left:6px;"><span style="font-weight:bold;">임 형 택</span><div class="stamp-seal">인</div></div>`;
      
      const head = `<div class="text-center mb-6"><h1 class="text-2xl font-black tracking-[0.5em] inline-block border-b-2 border-black pb-2 px-10">견 적 서</h1></div>
        <div class="grid grid-cols-2 gap-4 mb-4 text-xs"><div class="border border-black p-3 bg-white"><div><span class="w-16 font-bold">수 신:</span><span class="font-extrabold text-blue-900 ml-2 text-sm">${org}</span></div><div><span class="w-16 font-bold">발 신:</span><span class="ml-2">청년인쇄사</span></div><div><span class="w-16 font-bold">일 자:</span><span class="ml-2">${ds}</span></div></div>
        <div class="border border-black p-3 bg-white">
          <div class="flex justify-between font-bold mb-1"><span class="text-sm">청 년 인 쇄 사</span><span class="font-mono-code font-normal">등록번호: 119-22-03638</span></div>
          <div class="flex items-center"><span class="w-16 font-bold">대 표:</span>${stamp}</div><div><span class="w-16 font-bold">전 화:</span><span class="ml-2 font-mono-code">044-862-4803</span></div>
        </div></div>
        <div class="border border-black bg-gray-100 px-4 py-2.5 flex justify-between items-center mb-4 font-bold text-sm"><div>합계금액 : <span class="font-black text-black ml-2 text-[15px]">일금 ${numToKor(total)} 정</span></div><div class="font-mono-code font-black">( ₩ ${total.toLocaleString()} )</div></div>`;

      let table = '';
      if(tmpl==='디지탈상세'){
        table = `<table class="excel-table text-center mb-3"><thead><tr><th>품명</th><th class="w-20">규격</th><th class="w-16">수량</th><th class="w-16">면수</th><th>사양</th></tr></thead><tbody><tr><td class="font-bold">교육 교재</td><td class="font-mono-code">A4</td><td class="font-mono-code">${q}</td><td class="font-mono-code">${p}</td><td class="text-left">표지칼라/흑백/무선</td></tr></tbody></table>
        <table class="excel-table text-left"><thead><tr><th class="w-32">항목</th><th>산출내역</th><th class="w-28 text-right">금액(원)</th><th class="w-36">비고</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="text-center font-bold">${r.name}</td><td class="font-mono-code text-[10px] tracking-tighter">${r.desc}</td><td class="text-right font-mono-code font-bold">${r.amt.toLocaleString()}</td><td class="text-center text-gray-600">${r.rem}</td></tr>`).join('')}</tbody>
        <tfoot class="font-bold"><tr><td colspan="2" class="text-center">소 계</td><td class="text-right font-mono-code">${sub.toLocaleString()}</td><td class="text-center">-</td></tr><tr class="bg-gray-100"><td colspan="2" class="text-center py-2">총 견적합계 (VAT 포함)</td><td class="text-right py-2 text-blue-800 font-mono-code text-sm">${total.toLocaleString()}</td><td class="text-center">-</td></tr></tfoot></table>`;
      } else {
        table = `<table class="excel-table text-left"><thead><tr><th class="w-12">항목</th><th class="w-20">내역</th><th>규격</th><th class="w-14">수량</th><th class="w-20 text-right">단가</th><th class="w-24 text-right">공급가액</th><th class="w-28">비고</th></tr></thead>
        <tbody>${rows.map(r=>`<tr><td class="text-center font-bold text-gray-600">${r.type}</td><td class="text-center font-bold">${r.name}</td><td class="font-mono-code text-[10px] tracking-tighter">${r.desc}</td><td class="text-center font-mono-code">${r.qty}</td><td class="text-right font-mono-code">${r.price.toLocaleString()}</td><td class="text-right font-mono-code font-bold">${r.amt.toLocaleString()}</td><td class="text-center text-gray-600">${r.rem}</td></tr>`).join('')}</tbody>
        <tfoot class="font-bold bg-gray-50"><tr><td colspan="5" class="text-center">공급가액 소계</td><td class="text-right font-mono-code">${sub.toLocaleString()}</td><td class="text-center">-</td></tr><tr><td colspan="5" class="text-center">부가가치세</td><td class="text-right font-mono-code">${(total-sub).toLocaleString()}</td><td class="text-center">-</td></tr><tr class="bg-gray-100"><td colspan="5" class="text-center py-2">총 견적합계 (VAT 포함)</td><td class="text-right py-2 text-blue-800 font-mono-code text-sm">${total.toLocaleString()}</td><td class="text-center">-</td></tr></tfoot></table>`;
      }
      document.getElementById('quote-printable-area').innerHTML = head + table + `<div class="mt-4 text-[10px] text-gray-500"><p>※ 세종특별자치시 관공서 정산 규격에 맞추어 발행되었으며, 법인카드 결제가 가능합니다.</p></div>`;
      
      document.getElementById('msg-target-org').innerText = org;
      document.getElementById('msg-target-org-2').innerText = org;
      document.getElementById('msg-target-template').innerText = tmpl;
      document.getElementById('msg-target-total').innerText = total.toLocaleString();
    }

    function goToStep(s) {
      if(s<1 || s>3) return;
      currentQuoteStep = s;
      document.getElementById('quote-step-1-content').style.display = s===1 ? 'block':'none';
      document.getElementById('quote-step-2-content').style.display = s===2 ? 'block':'none';
      document.getElementById('quote-step-3-content').style.display = s===3 ? 'block':'none';
      document.getElementById('btn-prev').style.display = s===1 ? 'none':'block';
      document.getElementById('btn-next').style.display = s===3 ? 'none':'flex';
      document.getElementById('action-buttons').style.display = s===3 ? 'flex':'none';
      
      [1,2,3].forEach(i=>{
        const d=document.getElementById(`step-dot-${i}`), t=document.getElementById(`step-text-${i}`);
        if(i===s){ d.className="w-7 h-7 rounded-full bg-[#3182F6] text-white flex items-center justify-center font-bold text-xs shadow-md"; t.className="ml-2 font-extrabold text-gray-900 text-sm"; d.innerHTML=i; }
        else if(i<s){ d.className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs"; d.innerHTML="✓"; t.className="ml-2 font-bold text-gray-900 text-sm"; }
        else{ d.className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs"; d.innerHTML=i; t.className="ml-2 font-bold text-gray-500 text-sm"; }
      });
    }

    async function getPdfBase64() {
      const step2 = document.getElementById('quote-step-2-content');
      const el = document.getElementById('quote-printable-area');
      const org = document.getElementById('input-org').value.replace(/[^a-zA-Z0-9가-힣]/g,'_');
      const fileName = `청년인쇄사_견적서_${org}.pdf`;

      const origDisplay = step2.style.display;
      step2.style.display = 'block';
      step2.style.position = 'absolute';
      step2.style.left = '-9999px';

      const opt = { margin:[15,10,15,10], filename:fileName, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2, useCORS:true}, jsPDF:{unit:'mm',format:'a4'} };
      const worker = html2pdf().set(opt).from(el);
      const pdfBase64String = await worker.outputPdf('datauristring');
      
      step2.style.position = ''; step2.style.left = ''; step2.style.display = origDisplay;
      return { base64: pdfBase64String.split('base64,')[1], fileName, worker };
    }

    async function downloadPDF() {
      const btn = document.getElementById('btn-download');
      const origHtml = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> 생성중...`; lucide.createIcons();
      try {
        const { worker } = await getPdfBase64();
        worker.save();
        toggleComp(document.getElementById('input-phone').dataset.timeKey);
        setTimeout(closeQuoteModal, 1500);
      } catch(e) { alert("PDF 저장 실패"); }
      btn.disabled = false; btn.innerHTML = origHtml;
    }

    async function sendEmail() {
      const btn = document.getElementById('btn-email');
      const origHtml = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> 발송중...`; lucide.createIcons();

      try {
        const { base64, fileName } = await getPdfBase64();
        const toEmail = /[a-zA-Z@]/.test(document.getElementById('input-phone').value) ? document.getElementById('input-phone').value : 'admin@ybprint.co.kr';
        const org = document.getElementById('input-org').value;
        const total = document.getElementById('msg-target-total').innerText;

        const html = `<div style="font-family:sans-serif; max-width:600px; padding:20px; border:1px solid #e5e7eb; border-radius:8px;">
          <h2 style="color:#2563eb; border-bottom:2px solid #2563eb; padding-bottom:8px;">[청년인쇄사] 견적서 안내</h2>
          <p>안녕하세요, <strong>${org}</strong> 담당자님!</p>
          <p>요청하신 견적서를 <strong>PDF 파일로 첨부</strong>해 드립니다.</p>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:15px; margin:15px 0;">
            <p style="margin:4px 0;">■ 수신처 : ${org}</p>
            <p style="margin:4px 0; color:#2563eb; font-weight:bold; font-size:16px;">■ 총 금액 : ${total} 원 (VAT 포함)</p>
          </div>
          <p style="font-size:12px; color:#6b7280;">※ 법인카드 결제 및 세금계산서 정산 가능 (첨부파일 참조)</p>
        </div>`;

        const res = await fetch('/api/send-estimate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: toEmail, subject: `[청년인쇄사] ${org}님, 요청하신 견적서가 도착했습니다.`, html: html, attachment: { filename: fileName, content: base64, type: 'application/pdf' } })
        });
        
        if (res.ok) { 
          alert(`🎉 발송 성공! (${toEmail})\n요약 본문과 PDF 첨부파일이 전송되었습니다.`); 
          toggleComp(document.getElementById('input-phone').dataset.timeKey);
          closeQuoteModal();
        } else { alert(`⚠️ 서버 API 응답 에러 (백엔드 코드를 확인해주세요)`); }
      } catch(e) { alert("⚠️ 이메일 전송 중 오류 발생: " + e.message); }
      btn.disabled = false; btn.innerHTML = origHtml;
    }

    fetchInquiries();
  </script>
</body>
</html>
