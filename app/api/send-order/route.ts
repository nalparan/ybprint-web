import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. 접수 폼에서 보낸 데이터(이름, 이메일, 주문내용, 연락처)를 받습니다.
    const { name, email, details, phone } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: '이름과 이메일 주소는 필수입니다.' },
        { status: 400 }
      );
    }

    // 2. 고객에게 보낼 이메일 내용(HTML)을 만듭니다.
    const emailHtml = `
      <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; color: #1f2937;">
        <h2 style="color: #2563eb; margin-bottom: 16px; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">청년인쇄사 접수 완료 안내</h2>
        <p style="font-size: 16px; line-height: 1.6;">안녕하세요, <strong>${name}</strong>님!</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
          청년인쇄사에 접수해 주셔서 진심으로 감사드립니다.<br>
          고객님의 접수 내역이 시스템에 정상 등록되었습니다.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px;">📋 접수 내역 상세</h4>
          <p style="margin: 4px 0; font-size: 14px;"><strong>성함 / 상호:</strong> ${name}</p>
          ${phone ? `<p style="margin: 4px 0; font-size: 14px;"><strong>연락처:</strong> ${phone}</p>` : ''}
          <p style="margin: 4px 0; font-size: 14px;"><strong>요청 / 주문 내용:</strong></p>
          <div style="margin-top: 6px; padding: 10px; background-color: #ffffff; border-radius: 4px; font-size: 14px; white-space: pre-wrap; line-height: 1.5;">${details || '접수 내용 없음'}</div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
          담당자가 내용을 꼼꼼히 확인 후 신속하게 연락드리겠습니다.<br>
          추가 문의사항이 있으실 경우 본 메일로 회신해 주시면 안내를 도와드리겠습니다.
        </p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0 16px 0;">
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">
          <strong>청년인쇄사</strong> | 발신전용: admin@ybprint.co.kr
        </p>
      </div>
    `;

    // 3. SendGrid API를 통해 고객 이메일로 발송합니다.
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email, name: name }],
          },
        ],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'admin@ybprint.co.kr',
          name: '청년인쇄사',
        },
        subject: `[청년인쇄사] ${name}님, 주문 접수가 완료되었습니다.`,
        content: [
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
      }),
    });

    if (!sendGridResponse.ok) {
      const errorDetail = await sendGridResponse.text();
      console.error('SendGrid 발송 실패:', errorDetail);
      return NextResponse.json(
        { error: '이메일 발송에 실패했습니다.' },
        { status: sendGridResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: '접수 및 확인 메일 발송이 완료되었습니다.',
    });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
