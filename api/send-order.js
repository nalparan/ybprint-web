const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const name = body.name || '고객';
  const email = (body.email || '').trim();
  const phone = body.phone || '';
  const details = body.details || '';

  // 수신자 지정: 이메일이 입력되었으면 해당 이메일로, 전화번호만 있으면 관리자 메일로 발송
  const targetEmail = (email && email.includes('@')) ? email : 'admin@ybprint.co.kr';

  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';

  // 네이버 SMTP 발신자 주소 형식 보정
  const senderAddress = smtpUser.includes('@') ? smtpUser : `${smtpUser}@naver.com`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `"청년인쇄사" <${senderAddress}>`,
    to: targetEmail,
    subject: `[청년인쇄사] ${name}님의 견적/문의 접수 안내`,
    html: `
      <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #2563eb; margin-top: 0; padding-bottom: 12px; border-bottom: 2px solid #2563eb;">청년인쇄사 접수 완료 안내</h2>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          안녕하세요, <strong>${name}</strong>님!<br>
          청년인쇄사에 접수해 주셔서 진심으로 감사드립니다.<br>
          고객님의 접수 내역이 시스템에 정상 등록되었습니다.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
          <h3 style="font-size: 14px; color: #0f172a; margin-top: 0; margin-bottom: 12px;">📋 접수 내역 상세</h3>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>성함 / 상호 :</strong> ${name}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>연락처 :</strong> ${phone || '미입력'}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;"><strong>이메일 :</strong> ${email || '미입력'}</p>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
            <strong style="font-size: 14px; color: #0f172a;">요청 / 주문 내용 :</strong>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 13px; color: #334155; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 6px;">${details}</pre>
          </div>
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; line-height: 1.4;">
          담당자가 내용을 꼼꼼히 확인 후 신속하게 연락드리겠습니다.<br>
          추가 문의사항이 있으실 경우 본 메일로 회신해 주시면 안내를 도와드리겠습니다.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mail Send Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
