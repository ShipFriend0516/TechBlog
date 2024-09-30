import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface Post {
  title: string;
  subTitle?: string;
  author: string;
  date: number;
  timeToRead: number;
  content: string;
  comment?: string[];
  profileImage?: string | StaticImport;
}

export { Post };
