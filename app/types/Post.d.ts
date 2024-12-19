import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface Post {
  _id: string;
  title: string;
  slug: string;
  subTitle?: string;
  author: string;
  date: number;
  timeToRead: number;
  content: string;
  comment?: string[];
  profileImage?: string | StaticImport;
  thumbnailImage?: string | StaticImport;
}
type PostBody = Omit<Post, '_id' | 'date' | 'timeToRead' | 'comment'>;

export { Post, PostBody };
