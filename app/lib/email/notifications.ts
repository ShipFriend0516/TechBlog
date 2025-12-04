import dbConnect from '@/app/lib/dbConnect';
import Subscriber from '@/app/models/Subscriber';
import { sendNewPostEmail } from './resend';

interface PostData {
  title: string;
  subTitle?: string;
  slug: string;
  thumbnailImage?: string;
}

export async function sendNewPostNotifications(
  post: PostData
): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    await dbConnect();

    const subscribers = await Subscriber.find({
      isActive: true,
      isVerified: true,
    }).select('email nickname unsubscribeToken');

    if (subscribers.length === 0) {
      console.log('No active subscribers to notify');
      return { success: true, sent: 0, failed: 0 };
    }

    console.log(
      `Sending new post notification to ${subscribers.length} subscribers`
    );

    let sent = 0;
    let failed = 0;

    const batchSize = 100;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const results = await Promise.allSettled(
        batch.map((subscriber) =>
          sendNewPostEmail(
            {
              email: subscriber.email,
              nickname: subscriber.nickname,
              unsubscribeToken: subscriber.unsubscribeToken,
            },
            post
          )
        )
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          sent++;
        } else {
          failed++;
          console.error(
            `Failed to send email to ${batch[index].email}:`,
            result.status === 'rejected' ? result.reason : result.value.error
          );
        }
      });

      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `New post notification complete: ${sent} sent, ${failed} failed`
    );

    return {
      success: true,
      sent,
      failed,
    };
  } catch (error) {
    console.error('Error in sendNewPostNotifications:', error);
    return {
      success: false,
      sent: 0,
      failed: 0,
    };
  }
}
