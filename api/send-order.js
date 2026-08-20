import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  // 1. Vercel 데이터 파싱 안전장치 (문자열/객체 완벽 호환)
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const name = body?.name || '고객';
  const email = body?.email || '';
  const phone = body?.phone || '';
  const details = body?.details || '';
  const adminEmail = 'admin@ybprint.co.kr';

  // 2. 발송자 계정 포맷 보정 (네이버 SMTP 필수 규격)
  const rawUser = process.env.SMTP_USER || '';
  const smtpSender = rawUser.includes('@') ? rawUser : `${rawUser}@naver.com`;

  // 3. 수신자 목록 구성 (관리자 + 고객 이메일 동시 지정)
  const recipients = [adminEmail];
  if (email && email.includes('@') && email !== adminEmail) {
    recipients.push(email);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.naver.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"청년인쇄사" <${smtpSender}>`,
    to: recipients.join(', '),
    subject: `[청년인쇄사 접수안내] ${name}님의 문의 내역입니다`,
    text: `[청년인쇄사 온라인 접수 내역]\n\n■ 성함 / 상호 : ${name}\n■ 연락처 : ${phone || '미입력'}\n■ 이메일 : ${email || '미입력'}\n\n■ 문의 / 주문 내용 :\n${details}\n\n※ 첨부파일은 웹사이트 [관리자 모드]에서 즉시 다운로드하실 수 있습니다.`,
    html: `
      <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #2563eb; margin-top: 0; padding-bottom: 12px; border-bottom: 2px solid #2563eb;">청년인쇄사 접수 안내</h2>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          안녕하세요, <strong>${name}</strong>님!<br>
          청년인쇄사에 접수해 주셔서 진심으로 감사드립니다. 내용 확인 후 담당자가 신속히 연락드리겠습니다.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h3 style="font-size: 14px; color: #0f172a; margin-top: 0; margin-bottom: 12px;">📋 접수 내역 상세</h3>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>성함 / 소속 :</strong> ${name}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>연락처 :</strong> ${phone || '미입력'}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>이메일 :</strong> ${email || '미입력'}</p>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
            <strong style="font-size: 14px; color: #0f172a;">요청 / 주문 내용 :</strong>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #334155; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 6px;">${details}</pre>
          </div>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; line-height: 1.4;">
          * 본 메일은 온라인 시스템을 통해 자동 발송되는 안내 메일입니다.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: '발송 성공' });
  } catch (error) {
    console.error('Mail Send Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
