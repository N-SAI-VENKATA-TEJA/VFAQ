import mongoose, { Document, Schema } from 'mongoose';

export interface IAQ extends Document {
  section: string;
  sectionNumber: number;
  question: string;
  answer: string;
  tags: string[];
  slug: string;
  viewCount: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  askedCount: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const aqSchema = new Schema<IAQ>(
  {
    section: { type: String, required: true },
    sectionNumber: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: false }, // AQ answer might be empty or AI generated initially
    tags: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
    viewCount: { type: Number, default: 0 },
    helpfulVotes: { type: Number, default: 0 },
    unhelpfulVotes: { type: Number, default: 0 },
    askedCount: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AQ = mongoose.model<IAQ>('AQ', aqSchema);
