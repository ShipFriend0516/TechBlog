import { Schema, model, models } from 'mongoose';

// 블로그 운영 설정 — key 하나에 값 하나 (예: 'now')
const siteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const SiteSetting =
  models.SiteSetting || model('SiteSetting', siteSettingSchema);

export default SiteSetting;
