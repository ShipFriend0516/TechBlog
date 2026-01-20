import axios from 'axios';
import { Post } from '@/app/types/Post';

interface GetPostDetailResponse {
  post: Post;
}
const URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const getPostDetail = async (
  slug: string
): Promise<GetPostDetailResponse> => {
  const response = await axios.get(`${URL}/api/posts/${slug}`);

  return response.data;
};

export const deletePost = async (postId: string) => {
  return await axios.delete(`${URL}/api/posts/${postId}`);
};
