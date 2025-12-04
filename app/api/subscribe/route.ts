import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { sendVerificationEmail } from '@/app/lib/email/resend';
import { checkRateLimit, getClientIP } from '@/app/lib/rateLimit';
import Subscriber from '@/app/models/Subscriber';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return Response.json(
        {
          success: false,
          error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 429 }
      );
    }

    const { email, nickname } = await req.json();

    if (!email || !nickname) {
      return Response.json(
        {
          success: false,
          error: '이메일과 닉네임은 필수 항목입니다.',
        },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return Response.json(
        {
          success: false,
          error: '유효한 이메일 주소를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    if (nickname.trim().length < 2) {
      return Response.json(
        {
          success: false,
          error: '닉네임은 최소 2자 이상이어야 합니다.',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.isActive && existingSubscriber.isVerified) {
        return Response.json(
          {
            success: false,
            error: '이미 구독 중인 이메일입니다.',
          },
          { status: 409 }
        );
      }

      if (!existingSubscriber.isVerified) {
        const verificationAge = Date.now() - existingSubscriber.createdAt;
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

        if (verificationAge < TWENTY_FOUR_HOURS) {
          return Response.json(
            {
              success: false,
              error:
                '이미 인증 이메일이 발송되었습니다. 이메일을 확인해주세요.',
            },
            { status: 409 }
          );
        }

        const newVerificationToken = randomUUID();
        existingSubscriber.verificationToken = newVerificationToken;
        existingSubscriber.nickname = nickname.trim();
        await existingSubscriber.save();

        const emailResult = await sendVerificationEmail(
          email,
          nickname.trim(),
          newVerificationToken
        );

        if (!emailResult.success) {
          return Response.json(
            {
              success: false,
              error:
                '인증 이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
            },
            { status: 500 }
          );
        }

        return Response.json(
          {
            success: true,
            message: '인증 이메일이 재발송되었습니다. 이메일을 확인해주세요.',
          },
          { status: 200 }
        );
      }

      existingSubscriber.isActive = true;
      await existingSubscriber.save();

      return Response.json(
        {
          success: true,
          message: '구독이 재활성화되었습니다.',
        },
        { status: 200 }
      );
    }

    const verificationToken = randomUUID();
    const unsubscribeToken = randomUUID();

    const newSubscriber = await Subscriber.create({
      email: email.toLowerCase().trim(),
      nickname: nickname.trim(),
      verificationToken,
      unsubscribeToken,
      isActive: false,
      isVerified: false,
    });

    const emailResult = await sendVerificationEmail(
      email,
      nickname.trim(),
      verificationToken
    );

    if (!emailResult.success) {
      await Subscriber.deleteOne({ _id: newSubscriber._id });

      return Response.json(
        {
          success: false,
          error: '인증 이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: '인증 이메일이 발송되었습니다. 이메일을 확인해주세요.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscribe API error:', error);
    return Response.json(
      {
        success: false,
        error: '구독 처리 중 오류가 발생했습니다.',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
