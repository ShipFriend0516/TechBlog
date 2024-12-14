import Post from '@/app/models/Post';
import dbConnect from '@/app/lib/dbConnect';

// GET /api/posts - 모든 글 조회
export async function GET(req: Request) {
  try {
    await dbConnect();
    const posts = await Post.find({}).lean();

    return Response.json({ success: true, posts: posts.reverse() });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Cannot Find Posts' });
  }
}
//
// // POST /api/posts - 글 작성 API
// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     let { title, content, tags, thumbnailUrl, series } = await req.json();
//     const headersList = headers();
//     const authorization = headersList.get('authorization');
//     if (!authorization) {
//       return Response.json({ success: false, error: 'Invalid authorization' });
//     }
//     const accessToken = authorization?.split(' ')[1];
//     try {
//       const result = jwt.verify(accessToken, process.env.TOKEN_SECRET);
//       console.log(result);
//       if (result) {
//         const user = await User.findOne({ email: result.email }, '_id');
//         if (title === '?') title = 'tckkct';
//
//         const post = await Post.create({
//           title,
//           content,
//           tags,
//           author: user._id,
//           series: series,
//           thumbnailUrl,
//         });
//         return Response.json({ success: true, data: post });
//       }
//     } catch (error) {
//       return Response.json(
//         { success: false, message: '로그인을 해주세요.' },
//         { status: 401 }
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     return Response.json({ success: false, error: 'Invalid Post Request' });
//   }
// }
