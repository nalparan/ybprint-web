export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 지원합니다.' });
  }

  try {
    const { to, subject, html, customerName, estimateData, attachment } = req.body;

    if (!to) {
      return res.status(400).json({ error: '수신자 이메일 주소가 누락되었습니다.' });
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Vercel 환경변수에 SENDGRID_API_KEY가 등록되지 않았습니다.' });
    }

    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'admin@ybprint.co.kr';

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

    const payload = {
      personalizations: [
        {
          to: [{ email: to }],
        },
      ],
      from: {
        email: fromEmail,
        name: '청년인쇄사',
      },
      subject: subject || `[청년인쇄사] ${customerName || '고객'}님 견적서 안내`,
      content: [
        {
          type: 'text/html',
          value: mailContent,
        },
      ],
    };

    // 💡 PDF 첨부파일 데이터 추가
    if (attachment && attachment.content) {
      payload.attachments = [
        {
          content: attachment.content,
          filename: attachment.filename || '청년인쇄사_견적서.pdf',
          type: attachment.type || 'application/pdf',
          disposition: 'attachment',
        },
      ];
    }

    // SendGrid REST API 직접 호출 (무패키지 순수 통신)
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `SendGrid 발송 실패 (${response.status}): ${errorText || '발신자 인증을 확인해주세요.'}`,
      });
    }

    return res.status(200).json({ success: true, message: '이메일 및 PDF 첨부 발송 완료' });
  } catch (error) {
    console.error('서버 오류:', error);
    return res.status(500).json({ error: error.message || '서버 내부 처리 오류' });
  }
}
