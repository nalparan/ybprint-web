// api/send-estimate 파일 내부
const { to, subject, html, attachment } = req.body;

const msg = {
  to,
  from: 'admin@ybprint.co.kr',
  subject,
  html,
};

// 💡 1단계 코드에서 던진 attachment(Base64 PDF)를 받아서 메일에 달아주는 핵심 로직!
if (attachment) {
  msg.attachments = [
    {
      content: attachment.content,
      filename: attachment.filename,
      type: attachment.type,
      disposition: 'attachment',
    },
  ];
}

await sgMail.send(msg); // SendGrid 발송
