import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 지원합니다.' });
  }

  try {
    const { to, subject, html, customerName, estimateData, attachment } = req.body;

    if (!to) {
      return res.status(400).json({ error: '수신자 이메일 주소가 없습니다.' });
    }

    // 관리자 페이지에서 생성된 요약 HTML 본문
    const mailContent = html || `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb;">[청년인쇄사] 견적 안내</h2>
        <p>안녕하세요, ${customerName || '고객'}님.</p>
        <p>요청하신 인쇄 견적 내역을 안내해 드립니다.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
          ${estimateData || '견적 세부 내역'}
        </div>
        <p>감사합니다.<br><strong>청년인쇄사</strong></p>
      </div>
    `;

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'admin@ybprint.co.kr',
      subject: subject || `[청년인쇄사] ${customerName || '고객'}님 견적서 안내`,
      html: mailContent,
    };

    // 💡 웹 화면에서 넘겨받은 PDF(Base64)를 실제 이메일 첨부파일로 추가
    if (attachment && attachment.content) {
      msg.attachments = [
        {
          content: attachment.content,
          filename: attachment.filename || '청년인쇄사_견적서.pdf',
          type: attachment.type || 'application/pdf',
          disposition: 'attachment',
        },
      ];
    }

    await sgMail.send(msg);

    return res.status(200).json({ success: true, message: '견적서 메일 및 PDF 첨부 발송 완료' });
  } catch (error) {
    console.error('SendGrid 발송 오류:', error);
    return res.status(500).json({
      success: false,
      error: error.response?.body?.errors?.[0]?.message || error.message || '이메일 발송에 실패했습니다.'
    });
  }
}
