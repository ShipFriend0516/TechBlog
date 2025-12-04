import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Subscriber from '@/app/models/Subscriber';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      redirect('/subscribe/error?message=invalid_token');
    }

    await dbConnect();

    const subscriber = await Subscriber.findOne({ verificationToken: token });

    if (!subscriber) {
      redirect('/subscribe/error?message=token_not_found');
    }

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const tokenAge = Date.now() - subscriber.createdAt;

    if (tokenAge > TWENTY_FOUR_HOURS) {
      redirect('/subscribe/error?message=token_expired');
    }

    if (subscriber.isVerified && subscriber.isActive) {
      redirect('/subscribe/verified?message=already_verified');
    }

    subscriber.isVerified = true;
    subscriber.isActive = true;
    await subscriber.save();

    redirect('/subscribe/verified');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('Verify API error:', error);
    redirect('/subscribe/error?message=server_error');
  }
}
