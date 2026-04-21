import { Schema, model, models } from 'mongoose';

// 차단된 사용자 (fingerprint 또는 GitHub ID)
// 관리자가 명시적으로 추가하며, POST /api/atelier/messages 요청 시 차단 여부를 검사
const blockedFingerprintSchema = new Schema({
  fingerprint: {
    type: String,
  },
  githubId: {
    type: String,
  },
  reason: {
    type: String,
  },
  blockedAt: {
    type: Date,
    default: Date.now,
  },
});

// fingerprint 또는 githubId 중 하나는 반드시 있어야 함 (스파스 unique 인덱스)
blockedFingerprintSchema.index({ fingerprint: 1 }, { unique: true, sparse: true });
blockedFingerprintSchema.index({ githubId: 1 }, { unique: true, sparse: true });

const BlockedFingerprint =
  models.BlockedFingerprint ||
  model('BlockedFingerprint', blockedFingerprintSchema);

export default BlockedFingerprint;
