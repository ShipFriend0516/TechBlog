export function getVerificationEmailHTML(
  nickname: string,
  verifyUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>이메일 구독 인증</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background-color: #111827;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">이메일 구독 인증</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          안녕하세요, <strong>${nickname}</strong>님!
        </p>
        <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
          블로그 구독 신청을 완료하려면 아래 버튼을 클릭해주세요.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}"
             style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
            구독 확인하기
          </a>
        </div>
        <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
          이 링크는 24시간 동안 유효합니다. 본인이 요청한 것이 아니라면 이 이메일을 무시해주세요.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;">
        <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
          버튼이 작동하지 않는다면 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br>
          <a href="${verifyUrl}" style="color: #666666; word-break: break-all;">${verifyUrl}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getNewPostEmailHTML(
  nickname: string,
  post: {
    title: string;
    subTitle?: string;
    slug: string;
    thumbnailImage?: string;
  },
  postUrl: string,
  unsubscribeUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>새 글이 발행되었습니다</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background-color: #111827;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">새 글이 발행되었습니다</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
          안녕하세요, <strong>${nickname}</strong>님!
        </p>
        ${
          post.thumbnailImage
            ? `
        <div style="margin: 0 0 20px; text-align: center;">
          <img src="${post.thumbnailImage}" alt="${post.title}"
               style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>
        `
            : ''
        }
        <h2 style="margin: 0 0 10px; color: #111827; font-size: 22px; line-height: 1.4;">
          ${post.title}
        </h2>
        ${
          post.subTitle
            ? `
        <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
          ${post.subTitle}
        </p>
        `
            : ''
        }
        <div style="text-align: center; margin: 30px 0;">
          <a href="${postUrl}"
             style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
            글 읽으러 가기
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 30px; background-color: #f9f9f9; border-top: 1px solid #eeeeee;">
        <p style="margin: 0 0 10px; color: #999999; font-size: 12px; text-align: center;">
          이 이메일은 구독자님께서 요청하신 블로그 업데이트 알림입니다.
        </p>
        <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
          더 이상 이메일을 받고 싶지 않으시다면
          <a href="${unsubscribeUrl}" style="color: #666666; text-decoration: underline;">여기</a>를 클릭하여 구독을 취소하실 수 있습니다.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getUnsubscribeEmailHTML(nickname: string): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>구독이 취소되었습니다</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background-color: #111827;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">구독 취소 완료</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          안녕하세요, <strong>${nickname}</strong>님
        </p>
        <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.6;">
          블로그 구독이 성공적으로 취소되었습니다.<br>
          앞으로 새 글 알림 이메일을 받지 않으실 것입니다.
        </p>
        <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
          그동안 구독해주셔서 감사합니다.<br>
          언제든지 다시 돌아오시길 기다리겠습니다.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
