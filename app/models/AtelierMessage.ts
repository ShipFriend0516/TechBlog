import { Schema, model, models } from 'mongoose';
import { EFFECT_REGISTRY } from '@/app/lib/atelierEffects';

// 아틀리에 메시지 스키마
// - parentId 가 null 이면 최상위 피드 메시지
// - parentId 가 있으면 스레드 답글
// - reactions 는 이모지별 버킷 (서브도큐먼트) 배열
// - isDeleted 는 소프트 삭제 플래그
const reactionSchema = new Schema(
  {
    emoji: { type: String, required: true },
    fingerprints: { type: [String], default: [] },
    count: { type: Number, default: 0 },
    // 반응자 정보 (툴팁용)
    reactors: {
      type: [
        new Schema(
          {
            fingerprint: { type: String, required: true },
            nickname: { type: String, required: true },
            avatarUrl: { type: String },
            githubId: { type: String },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { _id: false }
);

const authorSchema = new Schema(
  {
    nickname: { type: String, required: true },
    githubId: { type: String },
    avatarUrl: { type: String },
    fingerprint: { type: String },
  },
  { _id: false }
);

const atelierMessageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000,
    },
    role: {
      type: String,
      enum: ['owner', 'visitor'],
      required: true,
    },
    author: {
      type: authorSchema,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'AtelierMessage',
      default: null,
    },
    threadCount: {
      type: Number,
      default: 0,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    effect: {
      type: String,
      enum: Object.keys(EFFECT_REGISTRY),
      default: null,
    },
  },
  { timestamps: true }
);

// 피드 / 스레드 쿼리 공통 인덱스
atelierMessageSchema.index({ parentId: 1, createdAt: -1 });
// 차단 처리용
atelierMessageSchema.index({ 'author.fingerprint': 1 });

const AtelierMessage =
  models.AtelierMessage || model('AtelierMessage', atelierMessageSchema);

export default AtelierMessage;
