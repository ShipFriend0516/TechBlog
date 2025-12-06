export interface CloudDraft {
  _id: string;
  draftId: string;
  userId: string;
  title: string;
  subTitle: string;
  content: string;
  tags: string[];
  imageUrls: string[];
  seriesId?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalDraft {
  title: string;
  subTitle: string;
  content?: string;
  tags: string[];
  seriesId?: string;
  isPrivate: boolean;
}

export interface DraftListItem {
  id: string; // draftId for cloud, 'local' for local
  title: string;
  date: Date;
  source: 'local' | 'cloud';
  data: LocalDraft | CloudDraft;
}
