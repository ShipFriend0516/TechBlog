import axios from 'axios';
const URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'http://localhost:3000';

export const deletePost = async (postId: string) => {
  return await axios.delete(`${URL}/api/posts/${postId}`);
};
