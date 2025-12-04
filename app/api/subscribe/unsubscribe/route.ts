import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import { sendUnsubscribeConfirmation } from '@/app/lib/email/resend';
import Subscriber from '@/app/models/Subscriber';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      redirect('/subscribe/error?message=invalid_token');
    }

    await dbConnect();

    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      redirect('/subscribe/error?message=subscriber_not_found');
    }

    if (!subscriber.isActive) {
      redirect('/subscribe/unsubscribed?message=already_unsubscribed');
    }

    subscriber.isActive = false;
    await subscriber.save();

    sendUnsubscribeConfirmation(subscriber.email, subscriber.nickname).catch(
      (error) => {
        console.error('Failed to send unsubscribe confirmation:', error);
      }
    );

    redirect('/subscribe/unsubscribed');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('Unsubscribe API error:', error);
    redirect('/subscribe/error?message=server_error');
  }
}
