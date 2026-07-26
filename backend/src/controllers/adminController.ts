import { Request, Response } from 'express';
import { FAQ } from '../models/FAQ';
import { SubmittedQuestion } from '../models/SubmittedQuestion';
import { Vote } from '../models/Vote';
import { addDocumentToRAG } from '../services/ragService';

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
    const { section, question, answer, tags, slug, isPublished } = req.body;
    let { sectionNumber } = req.body;
    
    if (section && !sectionNumber) {
      const existingFaqInSection = await FAQ.findOne({ section: new RegExp('^' + section + '$', 'i') });
      if (existingFaqInSection) {
        sectionNumber = existingFaqInSection.sectionNumber;
      } else {
        const lastFaq = await FAQ.findOne().sort({ sectionNumber: -1 });
        sectionNumber = lastFaq ? lastFaq.sectionNumber + 1 : 1;
      }
    }

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

    if (faq.isPublished) {
      await addDocumentToRAG(faq);
    }

    res.status(201).json(faq);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/admin/faqs/:id
export const updateFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = { ...req.body };
    
    if (updateData.section && !updateData.sectionNumber) {
      const existingFaqInSection = await FAQ.findOne({ section: new RegExp('^' + updateData.section + '$', 'i') });
      if (existingFaqInSection) {
        updateData.sectionNumber = existingFaqInSection.sectionNumber;
      } else {
        const lastFaq = await FAQ.findOne().sort({ sectionNumber: -1 });
        updateData.sectionNumber = lastFaq ? lastFaq.sectionNumber + 1 : 1;
      }
    }

    const faq = await FAQ.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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


// PATCH /api/admin/questions/:id
export const updateSubmittedQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, aiGeneratedAnswer, answer, section, tags, rejectReason } = req.body;
    const question = await SubmittedQuestion.findById(req.params.id);
    
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    if (status) question.status = status;
    if (aiGeneratedAnswer) question.aiGeneratedAnswer = aiGeneratedAnswer;
    if (rejectReason && status === 'rejected') question.rejectReason = rejectReason;
    
    await question.save();

    // If status is approved, create an FAQ directly
    if (status === 'approved' && answer && section) {
      let secNum = 1;
      // Try to find an existing FAQ in this section to copy its sectionNumber
      const existingFaqInSection = await FAQ.findOne({ section: new RegExp('^' + section + '$', 'i') });
      if (existingFaqInSection) {
        secNum = existingFaqInSection.sectionNumber;
      } else {
        // If it's a new section, find the maximum section number and add 1
        const lastFaq = await FAQ.findOne().sort({ sectionNumber: -1 });
        if (lastFaq) {
          secNum = lastFaq.sectionNumber + 1;
        }
      }

      const faqSlug = question.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const newFaq = await FAQ.create({
        section,
        sectionNumber: secNum,
        question: question.question,
        answer,
        tags: tags || [],
        slug: faqSlug,
        isPublished: true, // Automatically publish approved questions
      });

      await addDocumentToRAG(newFaq);
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
