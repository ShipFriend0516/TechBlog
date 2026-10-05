// 관리자 페이지 공용 타입

interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubComment {
  id: number;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  user: GitHubUser;
  body?: string;
}

export interface IssueWithComments {
  issue: GitHubIssue;
  comments: GitHubComment[];
}

export interface PopularPostItem {
  postId: string;
  title: string;
  slug: string;
  date: number;
  seriesTitle?: string;
  likeCount: number;
  totalViews?: number;
  todayViews: number;
}

export interface DailyPost {
  postId: string;
  title: string;
  slug: string;
  views: number;
}

export interface DailyView {
  date: string;
  count: number;
}

export interface ReferrerItem {
  source: string;
  count: number;
}
