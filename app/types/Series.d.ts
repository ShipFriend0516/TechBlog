export interface Series {
  _id: string;
  slug: string;
  title: string;
  description: string;
  date: number;
  posts: string[];
  order?: string[];
  postCount: number;
  thumbnailImage?: string;
  createdAt: string;
  updatedAt: string;
}
