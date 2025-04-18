import { Schema, model, models } from 'mongoose';

const viewSchema = new Schema(
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

viewSchema.index({ postId: 1, fingerprint: 1 }, { unique: true });

const View = models.View || model('View', viewSchema);
export default View;
