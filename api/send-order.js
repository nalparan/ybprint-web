import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Only POST requests are allowed' });
  }

  const { name, email, phone, details } = req.body;
  const adminEmail = 'admin@ybprint.co.kr';
  
  // 고객 이메일 판별
  const customerEmail = (email && email.includes('@') && email !== adminEmail) ? email : null;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.naver.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 1. 관리자용 텍스트 메일 옵션
  const adminMailOptions = {
    from: `"청년인쇄사 접수알림" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `[신규접수] ${name}님의 문의/주문이 들어왔습니다`,
    text: `웹사이트에서 새로운 접수가 발생했습니다.\n\n■ 성함/소속 : ${name}\n■ 연락처 : ${phone || '미입력'}\n■ 고객 이메일 : ${customerEmail || '미입력'}\n\n■ 접수 내용 :\n${details}\n\n※ 첨부파일은 웹사이트 [관리자 모드]에서 안전하게 다운로드 가능합니다.`
  };

  // 2. 고객용 HTML 메일 옵션
  const customerMailOptions = customerEmail ? {
    from: `"청년인쇄사" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: `[청년인쇄사] ${name}님, 문의하신 내역이 정상 접수되었습니다.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">청년인쇄사 접수 완료 안내</h2>
        <p>안녕하세요, <strong>${name}</strong>님!</p>
        <p>청년인쇄사에 접수해 주셔서 진심으로 감사드립니다.<br>고객님의 접수 내역이 시스템에 정상 등록되었으며, 담당자가 확인 후 신속하게 연락드리겠습니다.</p>
        <hr style="border:1px solid #eee; margin: 20px 0;">
        <p><strong>[접수 상세 내용]</strong></p>
        <pre style="background: #f8fafc; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${details}</pre>
      </div>
    `
  } : null;

  // ★ 핵심: 발송 과정을 독립적으로 실행 (하나가 막혀도 다른 하나는 무조건 전송)
  try {
    try {
      // 관리자 발송 시도
      await transporter.sendMail(adminMailOptions);
    } catch (adminError) {
      console.error('관리자 메일 전송 실패 (스팸 필터 등):', adminError);
      // 에러가 나도 무시하고 다음 단계(고객 발송)로 넘어감
    }

    if (customerMailOptions) {
      try {
        // 고객 발송 시도
        await transporter.sendMail(customerMailOptions);
      } catch (customerError) {
        console.error('고객 메일 전송 실패:', customerError);
      }
    }

    return res.status(200).json({ success: true, message: '발송 프로세스 완료' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
