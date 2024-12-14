import axios from 'axios';
import { Post } from '@/app/types/Post';

interface GetPostDetailResponse {
  post: Post;
}

export const getPostDetail = async (
  postId: string
): Promise<GetPostDetailResponse> => {
  const response = await axios.get(`/api/posts/${postId}`);

  return response.data;
};
