import { Model } from 'mongoose';
import type { Post } from '@/app/types/Post';
export const createPostSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const generateUniqueSlug = async (title: string, Post: Model<Post>) => {
  let slug = createPostSlug(title);
  let counter = 1;

  let existingPost = await Post.findOne({ slug });

  while (existingPost) {
    slug = `${createPostSlug(title)}-${counter}`;
    counter++;
    existingPost = await Post.findOne({ slug });
  }

  return slug;
};
