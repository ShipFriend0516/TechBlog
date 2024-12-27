import { Schema, model, models } from 'mongoose';

const seriesSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Number, required: true, default: () => Date.now() },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    order: [{ type: String }],
    postCount: { type: Number, required: true, default: 0 },
    thumbnailImage: { type: String, required: false, default: '' },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Series = models.Series || model('Series', seriesSchema);

export default Series;
