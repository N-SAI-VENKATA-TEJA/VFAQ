import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmittedQuestion extends Document {
  question: string;
  category: string;
  submitterName?: string;
  submitterEmail?: string;
  status: 'pending' | 'approved' | 'rejected';
  aiGeneratedAnswer?: string;
  createdAt: Date;
}

const submittedQuestionSchema = new Schema<ISubmittedQuestion>(
  {
    question: { type: String, required: true },
    category: { type: String, required: true },
    submitterName: { type: String },
    submitterEmail: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    aiGeneratedAnswer: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const SubmittedQuestion = mongoose.model<ISubmittedQuestion>(
  'SubmittedQuestion',
  submittedQuestionSchema
);
