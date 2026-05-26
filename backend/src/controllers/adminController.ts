import { Request, Response } from 'express';
import { FAQ } from '../models/FAQ';
import { SubmittedQuestion } from '../models/SubmittedQuestion';
import { Vote } from '../models/Vote';

// GET /api/admin/faqs
export const getAllFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await FAQ.find({ isDeleted: false }).sort({ sectionNumber: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/faqs
export const createFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section, sectionNumber, question, answer, tags, slug, isPublished } = req.body;
    
    // Auto-generate slug if not provided
    const faqSlug = slug || question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const faq = await FAQ.create({
      section,
      sectionNumber,
      question,
      answer,
      tags,
      slug: faqSlug,
      isPublished: isPublished !== undefined ? isPublished : false,
    });

    res.status(201).json(faq);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/admin/faqs/:id
export const updateFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }
    res.json(faq);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/admin/faqs/:id
export const deleteFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!faq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }
    res.json({ message: 'FAQ soft deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/questions
export const getSubmittedQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query = status ? { status: status as 'pending' | 'approved' | 'rejected' } : {};
    const questions = await SubmittedQuestion.find(query).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

import { AQ } from '../models/AQ';

// PATCH /api/admin/questions/:id
export const updateSubmittedQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, aiGeneratedAnswer, answer, section, sectionNumber, tags } = req.body;
    const question = await SubmittedQuestion.findById(req.params.id);
    
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    if (status) question.status = status;
    if (aiGeneratedAnswer) question.aiGeneratedAnswer = aiGeneratedAnswer;
    
    await question.save();

    // If status is approved, automatically create an AQ
    if (status === 'approved') {
      const aqSlug = question.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
      await AQ.create({
        section: section || question.category,
        sectionNumber: sectionNumber || 99, // default unassigned section number
        question: question.question,
        answer: answer || question.aiGeneratedAnswer || 'Pending community or admin answer.',
        slug: aqSlug,
        tags: tags || [],
        askedCount: 1,
        isPublished: true
      });
    }

    res.json(question);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/admin/stats
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalFaqs = await FAQ.countDocuments({ isDeleted: false });
    const pendingQuestions = await SubmittedQuestion.countDocuments({ status: 'pending' });
    
    const voteStats = await FAQ.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, totalHelpful: { $sum: '$helpfulVotes' }, totalUnhelpful: { $sum: '$unhelpfulVotes' } } }
    ]);

    res.json({
      totalFaqs,
      pendingQuestions,
      totalHelpfulVotes: voteStats[0]?.totalHelpful || 0,
      totalUnhelpfulVotes: voteStats[0]?.totalUnhelpful || 0,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
