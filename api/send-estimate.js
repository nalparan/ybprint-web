export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 지원합니다.' });
  }

  try {
    const { to, subject, html, customerName, estimateData } = req.body;

    if (!to) {
      return res.status(400).json({ error: '수신자 이메일 주소가 없습니다.' });
    }

    // 관리자 페이지에서 만든 HTML 본문 사용
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

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'admin@ybprint.co.kr',
          name: '청년인쇄사',
        },
        subject: subject || `[청년인쇄사] 요청하신 견적서가 도착했습니다.`,
        content: [{ type: 'text/html', value: mailContent }],
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error('SendGrid 견적서 발송 에러:', errorDetail);
      return res.status(response.status).json({ error: '견적서 발송 실패' });
    }

    return res.status(200).json({ success: true, message: '견적서 메일이 성공적으로 발송되었습니다.' });
  } catch (err) {
    console.error('서버 에러:', err);
    return res.status(500).json({ error: '서버 내부 오류' });
  }
}
