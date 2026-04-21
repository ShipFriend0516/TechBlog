// Atelier 피처 공용 타입 정의
// FE / BE 모두 이 파일을 기준으로 개발한다.

export type MessageRole = 'owner' | 'visitor';

// 허용 이모지 화이트리스트 (서버/클라 공통)
export const ATELIER_EMOJIS = ['👍', '🔥', '💭', '😮', '🤔', '❤️'] as const;
export type AtelierEmoji = (typeof ATELIER_EMOJIS)[number];

// 메시지 작성자 정보
export interface AtelierAuthor {
  nickname: string;
  githubId?: string;
  avatarUrl?: string;
  fingerprint?: string;
}

// 이모지 반응자 정보 (툴팁용, 익명은 displayName만)
export interface ReactorInfo {
  displayName: string;
  avatarUrl?: string;
}

// 이모지 반응 버킷
export interface ReactionBucket {
  emoji: string;
  count: number;
  fingerprints?: string[];
  hasReacted?: boolean;
  reactors?: ReactorInfo[];
}

// 단일 메시지
export interface AtelierMessage {
  _id: string;
  content: string;
  role: MessageRole;
  author: AtelierAuthor;
  parentId: string | null;
  threadCount: number;
  reactions: ReactionBucket[];
  isPublic: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== API Request / Response =====

// GET /api/atelier/messages
export interface GetMessagesQuery {
  cursor?: string;
  limit?: number;
}

export interface GetMessagesResponse {
  success: true;
  messages: AtelierMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

// POST /api/atelier/messages
export interface PostMessageBody {
  content: string;
  nickname?: string;
  parentId?: string;
}

export interface PostMessageResponse {
  success: true;
  message: AtelierMessage;
}

// GET /api/atelier/messages/[id]/thread
export interface GetThreadResponse {
  success: true;
  replies: AtelierMessage[];
}

// POST /api/atelier/messages/[id]/reaction
export interface PostReactionBody {
  emoji: AtelierEmoji;
}

export interface PostReactionResponse {
  success: true;
  reactions: ReactionBucket[];
}

// PATCH /api/atelier/messages/[id]
export interface PatchMessageBody {
  isPublic: boolean;
}

// POST /api/atelier/block
export interface PostBlockBody {
  identifier?: string;
  reason?: string;
}

// 에러 응답 공통
export interface AtelierErrorResponse {
  success: false;
  error: string;
}

// ===== 클라이언트 전용 타입 =====

// optimistic update 용 임시 메시지 (tempId 필드 추가)
export interface OptimisticAtelierMessage extends AtelierMessage {
  tempId: string;
  isSending: true;
}
