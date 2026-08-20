const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 브라우저에서 주소로 직접 접속(GET)했을 때 정상 가동 여부 확인
  if (req.method !== 'POST') {
    return res.status(200).json({ 
      status: 'online', 
      message: '청년인쇄사 메일 발송 서버가 정상 작동 중입니다.' 
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { name, email, phone, details } = body || {};

    const rawUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();
    const senderEmail = rawUser.includes('@') ? rawUser : `${rawUser}@naver.com`;
    const authId = rawUser.includes('@') ? rawUser.split('@')[0] : rawUser;

    // 수신 대상: 고객 이메일이 있으면 거기로, 없으면 관리자 메일로
    const targetEmail = (email && email.includes('@')) ? email.trim() : 'admin@ybprint.co.kr';

    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true,
      auth: {
        user: authId,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"청년인쇄사" <${senderEmail}>`,
      to: targetEmail,
      subject: `청년인쇄사 접수 완료 안내`,
      html: `
        <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-top: 0;">청년인쇄사 접수 완료 안내</h2>
          <p>안녕하세요, <strong>${name || '고객'}</strong>님!<br>
          청년인쇄사에 접수해 주셔서 진심으로 감사드립니다.<br>
          고객님의 접수 내역이 시스템에 정상 등록되었습니다.</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 15px 0;">
            <h3 style="margin-top: 0; font-size: 14px;">📋 접수 내역 상세</h3>
            <p style="margin: 5px 0;"><strong>성함 / 상호:</strong> ${name || '미입력'}</p>
            <p style="margin: 5px 0;"><strong>연락처:</strong> ${phone || '미입력'}</p>
            <p style="margin: 5px 0;"><strong>요청 / 주문 내용:</strong></p>
            <pre style="white-space: pre-wrap; font-family: inherit; background: #ffffff; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; margin-top: 5px;">${details || '내용 없음'}</pre>
          </div>
          <p style="font-size: 12px; color: #64748b;">담당자가 내용을 꼼꼼히 확인 후 신속하게 연락드리겠습니다.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: '발송 성공' });

  } catch (error) {
    console.error('Mail Send Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
