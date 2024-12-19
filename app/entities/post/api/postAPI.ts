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

export const getPostDetailWithSlug = async (
  slug: string
): Promise<GetPostDetailResponse> => {
  const response = await axios.get(`/api/posts/${slug}`);

  return response.data;
};

export const deletePost = async (postId: string) => {
  return await axios.delete(`/api/posts/${postId}`);
};
