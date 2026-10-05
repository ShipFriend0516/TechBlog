export interface HomePost {
  slug: string;
  title: string;
  subTitle?: string;
  date: number;
  timeToRead?: number;
  thumbnailImage?: string;
  tags?: string[];
}

export interface PopularPost extends HomePost {
  view: number;
}

export interface HomeSeries {
  slug: string;
  title: string;
  description?: string;
  postCount: number;
  thumbnailImage?: string;
}

// 별자리 타임라인의 별 하나 = 글 하나
export interface StarPost {
  slug: string;
  title: string;
  date: number;
  view: number;
  seriesId?: string;
  seriesTitle?: string;
}

export interface BlogStats {
  postCount: number;
  firstPostDate: number | null;
  // 통계를 계산한 시각 — 렌더 중 Date.now() 호출을 피하려고 데이터에 포함
  generatedAt: number;
}

export interface AtelierPreviewMessage {
  id: string;
  content: string;
  nickname: string;
  avatarUrl?: string;
  role: 'owner' | 'visitor';
  createdAt: string;
}

export interface NowItem {
  label: string;
  text: string;
}

export interface NowData {
  items: NowItem[];
  updatedAt: string | null;
}
