import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, details } = req.body;
  const targetEmail = (email && email.includes('@')) ? email : 'admin@ybprint.co.kr';

  const transporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"청년인쇄사" <${process.env.SMTP_USER}>`,
    to: targetEmail,
    subject: `청년인쇄사 접수 완료 안내`,
    html: `
      <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-top: 0;">청년인쇄사 접수 완료 안내</h2>
        <p>안녕하세요, <strong>${name || '고객'}</strong>님!<br>
        청년인쇄사에 접수해 주셔서 진심으로 감사드립니다.<br>
        고객님의 접수 내역이 시스템에 정상 등록되었습니다.</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 15px 0;">
          <h3 style="margin-top: 0; font-size: 14px;">📋 접수 내역 상세</h3>
          <p style="margin: 5px 0;"><strong>성함 / 상호:</strong> ${name || '미입력'}</p>
          <p style="margin: 5px 0;"><strong>연락처:</strong> ${phone || '미입력'}</p>
          <p style="margin: 5px 0;"><strong>요청 / 주문 내용:</strong></p>
          <pre style="white-space: pre-wrap; font-family: inherit; background: #fff; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; margin-top: 5px;">${details || '내용 없음'}</pre>
        </div>
        <p style="font-size: 12px; color: #64748b;">담당자가 내용을 꼼꼼히 확인 후 신속하게 연락드리겠습니다.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mail Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
