import Post from '@/app/models/Post';
import dbConnect from '@/app/lib/dbConnect';
import { getServerSession } from 'next-auth/next';

// GET /api/posts - 모든 글 조회
export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();

    return Response.json({ success: true, posts: posts });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error: '포스트 목록 불러오기 실패', detail: error },
      { status: 500 }
    );
  }
}

// POST /api/posts - 글 작성 API
export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    await dbConnect();
    const { title, subTitle, author, content, profileImage, thumbnailImage } =
      await req.json();

    if (!title || !content || !author || !content) {
      return Response.json(
        { success: false, error: '제목, 소제목, 작성자, 내용은 필수입니다' },
        { status: 400 }
      );
    }

    const post = {
      title,
      subTitle,
      author,
      content,
      timeToRead: Math.ceil(content.length / 500),
      profileImage,
      thumbnailImage,
    };

    const newPost = await Post.create(post);
    if (!newPost) {
      return Response.json(
        { success: false, error: '글 작성 실패' },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        post: newPost,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Post creation error:', error);
    return Response.json(
      { success: false, error: 'Invalid Post Request' },
      { status: 500 }
    );
  }
}
