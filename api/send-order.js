import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. 브라우저로 주소에 직접 접속했을 때 (GET 요청) 안전하게 200 반환
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', message: '청년인쇄사 메일 발송 서버가 정상 작동 중입니다.' });
  }

  try {
    let body = req.body || {};
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

    // 고객 이메일이 있으면 고객에게, 없으면 관리자에게 발송
    const targetEmail = (email && email.includes('@')) ? email : 'admin@ybprint.co.kr';

    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';

    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"청년인쇄사" <${smtpUser}>`,
      to: targetEmail,
      subject: `청년인쇄사 접수 완료 안내`,
      html: `
        <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-top: 0;">청년인쇄사 접수 완료 안내</h2>
          <p>안녕하세요, <strong>${name}</strong>님!<br>
          청년인쇄사에 접수해 주셔서 진심으로 감사드립니다.<br>
          고객님의 접수 내역이 시스템에 정상 등록되었습니다.</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 15px 0;">
            <h3 style="margin-top: 0; font-size: 14px;">📋 접수 내역 상세</h3>
            <p style="margin: 5px 0;"><strong>성함 / 상호:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>연락처:</strong> ${phone || '미입력'}</p>
            <p style="margin: 5px 0;"><strong>요청 / 주문 내용:</strong></p>
            <pre style="white-space: pre-wrap; font-family: inherit; background: #fff; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; margin-top: 5px;">${details || '내용 없음'}</pre>
          </div>
          <p style="font-size: 12px; color: #64748b;">담당자가 내용을 꼼꼼히 확인 후 신속하게 연락드리겠습니다.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mail Error:', error);
    return res.status(200).json({ success: false, error: error.message });
  }
}
