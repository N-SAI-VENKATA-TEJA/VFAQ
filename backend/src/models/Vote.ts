import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  targetId: mongoose.Types.ObjectId;
  targetType: 'FAQ';
  userIdOrIpHash: string;
  voteType: 'helpful' | 'unhelpful' | 'ask';
  createdAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    targetId: { type: Schema.Types.ObjectId, required: true, refPath: 'targetType' },
    targetType: { type: String, enum: ['FAQ'], required: true, default: 'FAQ' },
    userIdOrIpHash: { type: String, required: true },
    voteType: { type: String, enum: ['helpful', 'unhelpful', 'ask'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Optional index to ensure a user/IP only votes once per target
voteSchema.index({ targetId: 1, targetType: 1, userIdOrIpHash: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
