// 아틀리에 메시지 직렬화 유틸
// - lean() 결과를 공용 타입 AtelierMessage 로 변환
// - fingerprints 는 프라이버시상 제거하고 hasReacted 로 대체
import { AtelierMessage, ReactionBucket } from '@/app/types/Atelier';

export interface LeanAtelierMessage {
  _id: { toString(): string };
  content: string;
  role: 'owner' | 'visitor';
  author: {
    nickname: string;
    githubId?: string;
    avatarUrl?: string;
    fingerprint?: string;
  };
  parentId: { toString(): string } | null;
  threadCount: number;
  reactions: {
    emoji: string;
    fingerprints?: string[];
    count: number;
  }[];
  isPublic: boolean;
  isDeleted: boolean;
  isEdited?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const serializeAtelierMessage = (
  raw: LeanAtelierMessage,
  viewerFingerprint: string | null
): AtelierMessage => {
  const reactions: ReactionBucket[] = (raw.reactions ?? []).map((bucket) => ({
    emoji: bucket.emoji,
    count: bucket.count,
    hasReacted:
      !!viewerFingerprint &&
      Array.isArray(bucket.fingerprints) &&
      bucket.fingerprints.includes(viewerFingerprint),
  }));

  return {
    _id: raw._id.toString(),
    content: raw.content,
    role: raw.role,
    author: {
      nickname: raw.author?.nickname ?? '',
      githubId: raw.author?.githubId,
      avatarUrl: raw.author?.avatarUrl,
      // 본인 메시지만 fingerprint 유지, 타인은 프라이버시상 제거
      fingerprint:
        viewerFingerprint && raw.author?.fingerprint === viewerFingerprint
          ? raw.author.fingerprint
          : undefined,
    },
    parentId: raw.parentId ? raw.parentId.toString() : null,
    threadCount: raw.threadCount ?? 0,
    reactions,
    isPublic: raw.isPublic,
    isDeleted: raw.isDeleted,
    isEdited: raw.isEdited ?? false,
    createdAt:
      raw.createdAt instanceof Date
        ? raw.createdAt.toISOString()
        : String(raw.createdAt),
    updatedAt:
      raw.updatedAt instanceof Date
        ? raw.updatedAt.toISOString()
        : String(raw.updatedAt),
  };
};
