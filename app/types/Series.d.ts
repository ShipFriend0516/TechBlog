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
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export type SeriesDetail = Omit<Series, 'posts'> & { posts: Post[] };

export type SeriesListItem = Pick<
  Series,
  | '_id'
  | 'slug'
  | 'title'
  | 'description'
  | 'date'
  | 'thumbnailImage'
  | 'postCount'
>;

export interface SeriesPage {
  items: SeriesListItem[];
  nextCursor: string | null;
}
