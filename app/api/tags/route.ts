import { getTagStats } from '@/app/lib/tags';

// GET /api/tags
export async function GET() {
  try {
    const tagStats = await getTagStats();

    return Response.json(tagStats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Tags API error:', error);
    return Response.json(
      { success: false, error: '태그 목록 불러오기 실패', detail: error },
      { status: 500 }
    );
  }
}
