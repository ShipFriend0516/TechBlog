import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/app/lib/authz';
import dbConnect from '@/app/lib/dbConnect';
import { getNow, NOW_SETTING_KEY } from '@/app/lib/home';
import SiteSetting from '@/app/models/SiteSetting';
import { NowItem } from '@/app/types/Home';

const MAX_ITEMS = 6;
const MAX_LABEL = 20;
const MAX_TEXT = 120;

export async function GET() {
  if (!(await getAdminSession())) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return Response.json({ success: true, now: await getNow() });
}

export async function PUT(req: Request) {
  if (!(await getAdminSession())) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const rawItems: unknown = body?.items;
  if (!Array.isArray(rawItems) || rawItems.length > MAX_ITEMS) {
    return Response.json(
      { success: false, error: `항목은 최대 ${MAX_ITEMS}개까지 입력할 수 있습니다.` },
      { status: 400 }
    );
  }

  const items: NowItem[] = [];
  for (const item of rawItems) {
    const label = typeof item?.label === 'string' ? item.label.trim() : '';
    const text = typeof item?.text === 'string' ? item.text.trim() : '';
    if (!label && !text) continue;
    if (!label || !text || label.length > MAX_LABEL || text.length > MAX_TEXT) {
      return Response.json(
        {
          success: false,
          error: `라벨(${MAX_LABEL}자)과 내용(${MAX_TEXT}자)을 모두 입력해주세요.`,
        },
        { status: 400 }
      );
    }
    items.push({ label, text });
  }

  await dbConnect();
  await SiteSetting.findOneAndUpdate(
    { key: NOW_SETTING_KEY },
    { value: { items } },
    { upsert: true }
  );
  revalidatePath('/');

  return Response.json({ success: true, now: await getNow() });
}
