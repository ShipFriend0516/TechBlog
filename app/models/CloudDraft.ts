import { Schema, model, models } from 'mongoose';

const cloudDraftSchema = new Schema(
  {
    draftId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    seriesId: {
      type: String,
      default: '',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// 효율적인 쿼리를 위한 복합 인덱스
cloudDraftSchema.index({ userId: 1, createdAt: -1 });

const CloudDraft =
  models.CloudDraft || model('CloudDraft', cloudDraftSchema);

export default CloudDraft;
