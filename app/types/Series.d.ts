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

// 시리즈 상세 목차용 글 요약 — 본문 대신 서버에서 만든 미리보기 문구만 내려보낸다
export interface SeriesPostSummary {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: number;
  timeToRead: number;
  tags: string[];
  thumbnailImage?: string;
}

export type SeriesDetail = Omit<Series, 'posts'> & {
  posts: SeriesPostSummary[];
};

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
