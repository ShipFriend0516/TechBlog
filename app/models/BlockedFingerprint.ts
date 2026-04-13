import { Schema, model, models } from 'mongoose';

// 차단된 방문자 fingerprint 목록
// 관리자가 명시적으로 추가하며, POST /api/atelier/messages 요청 시 차단 여부를 검사
const blockedFingerprintSchema = new Schema({
  fingerprint: {
    type: String,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
  },
  blockedAt: {
    type: Date,
    default: Date.now,
  },
});

// fingerprint 단일 unique 인덱스
blockedFingerprintSchema.index({ fingerprint: 1 }, { unique: true });

const BlockedFingerprint =
  models.BlockedFingerprint ||
  model('BlockedFingerprint', blockedFingerprintSchema);

export default BlockedFingerprint;
