import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Only POST requests are allowed' });
  }

  const { name, email, phone, details } = req.body;
  const adminEmail = 'admin@ybprint.co.kr';

  // 1. 발송 대상자 목록 설정 (고객 이메일이 있으면 고객 + 관리자 모두에게 발송)
  let recipients = [adminEmail];
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
    from: `"청년인쇄사 접수알림" <${process.env.SMTP_USER}>`,
    to: recipients.join(', '), // 관리자와 고객 모두 수신
    subject: `[청년인쇄사 견적접수] ${name}님의 새로운 문의/주문 내역입니다`,
    html: `
      <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #2563eb; margin-top: 0; padding-bottom: 12px; border-bottom: 2px solid #2563eb;">청년인쇄사 접수 안내</h2>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          안녕하세요! 청년인쇄사에 접수된 신규 견적 및 문의 내역입니다.
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h3 style="font-size: 14px; color: #0f172a; margin-top: 0; margin-bottom: 12px;">📋 접수 내역 상세</h3>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>성함 / 소속:</strong> ${name || '미입력'}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>연락처:</strong> ${phone || '미입력'}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>이메일:</strong> ${email || '미입력'}</p>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
            <strong style="font-size: 14px; color: #0f172a;">요청 / 주문 내용:</strong>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #334155; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 6px;">${details || '내용 없음'}</pre>
          </div>
        </div>
        
        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; line-height: 1.4;">
          * 본 메일은 청년인쇄사 온라인 시스템을 통해 접수 시 관리자 및 고객에게 자동 발송되는 안내 메일입니다.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: '이메일이 성공적으로 발송되었습니다.' });
  } catch (error) {
    console.error('Mail Send Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
