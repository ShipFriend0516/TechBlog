import { Schema, model, models } from 'mongoose';

const likeSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

likeSchema.index({ postId: 1, fingerprint: 1 }, { unique: true });

const Like = models.Like || model('Like', likeSchema);
export default Like;
