import { Schema, model, models } from 'mongoose';

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: true,
      unique: true,
    },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

subscriberSchema.index({ email: 1 });
subscriberSchema.index({ verificationToken: 1 });
subscriberSchema.index({ unsubscribeToken: 1 });

const Subscriber = models.Subscriber || model('Subscriber', subscriberSchema);

export default Subscriber;
