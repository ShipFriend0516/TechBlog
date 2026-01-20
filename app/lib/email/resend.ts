import { Resend } from 'resend';
import {
  getNewPostEmailHTML,
  getUnsubscribeEmailHTML,
  getVerificationEmailHTML,
} from './templates';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || '';
const BASE_URL =
  process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
  process.env.NEXT_PUBLIC_URL ||
  'https://shipfriend.dev';

export async function sendVerificationEmail(
  email: string,
  nickname: string,
  verificationToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const verifyUrl = `${BASE_URL}/api/subscribe/verify?token=${verificationToken}`;
    const html = getVerificationEmailHTML(nickname, verifyUrl);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '블로그 구독 인증을 완료해주세요',
      html,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, error: error.message };
    }

    console.log('Verification email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error sending verification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendNewPostEmail(
  subscriber: {
    email: string;
    nickname: string;
    unsubscribeToken: string;
  },
  post: {
    title: string;
    subTitle?: string;
    slug: string;
    thumbnailImage?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const postUrl = `${BASE_URL}/posts/${post.slug}`;
    const unsubscribeUrl = `${BASE_URL}/api/subscribe/unsubscribe?token=${subscriber.unsubscribeToken}`;

    const html = getNewPostEmailHTML(
      subscriber.nickname,
      post,
      postUrl,
      unsubscribeUrl
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: subscriber.email,
      subject: `새 글: ${post.title}`,
      html,
    });

    if (error) {
      console.error(
        `Failed to send new post email to ${subscriber.email}:`,
        error
      );
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error(
      `Unexpected error sending new post email to ${subscriber.email}:`,
      error
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendUnsubscribeConfirmation(
  email: string,
  nickname: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = getUnsubscribeEmailHTML(nickname);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '구독이 취소되었습니다',
      html,
    });

    if (error) {
      console.error('Failed to send unsubscribe confirmation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error sending unsubscribe confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
