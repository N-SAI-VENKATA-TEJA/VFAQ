import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  faqId: mongoose.Types.ObjectId;
  userIdOrIpHash: string;
  voteType: 'helpful' | 'unhelpful';
  createdAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    faqId: { type: Schema.Types.ObjectId, ref: 'FAQ', required: true },
    userIdOrIpHash: { type: String, required: true },
    voteType: { type: String, enum: ['helpful', 'unhelpful'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Optional index to ensure a user/IP only votes once per FAQ
voteSchema.index({ faqId: 1, userIdOrIpHash: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
