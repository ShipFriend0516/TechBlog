import { Schema, model, models } from 'mongoose';

const postSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
      default: () => Date.now(),
    },
    content: {
      type: String,
      required: true,
    },
    timeToRead: {
      type: Number,
      required: true,
    },
    comment: {
      type: [String],
      required: false,
      default: [],
    },
    profileImage: {
      type: String,
      required: false,
    },
    thumbnailImage: {
      type: String,
      required: false,
      default: '',
    },
    seriesId: {
      type: Schema.Types.ObjectId,
      ref: 'Series',
      required: false,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Post = models.Post || model('Post', postSchema);

export default Post;
