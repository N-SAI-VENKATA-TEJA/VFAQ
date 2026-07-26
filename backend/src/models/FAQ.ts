import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  section: string;
  sectionNumber: number;
  question: string;
  answer: string;
  tags: string[];
  slug: string;
  viewCount: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  isPublished: boolean;
  isDeleted: boolean;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    section: { type: String, required: true },
    sectionNumber: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tags: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
    viewCount: { type: Number, default: 0 },
    helpfulVotes: { type: Number, default: 0 },
    unhelpfulVotes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    embedding: { type: [Number], required: false },
  },
  { timestamps: true }
);

export const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);
