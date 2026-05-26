import { Request, Response } from 'express';
import { FAQ } from '../models/FAQ';
import { Vote } from '../models/Vote';

// POST /api/faqs/:id/view
export const viewFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
    if (!faq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }
    res.json({ message: 'View recorded', viewCount: faq.viewCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/faqs
export const getFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query: any = { isPublished: true, isDeleted: false };

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { question: searchRegex },
        { answer: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    const faqs = await FAQ.find(query).sort({ sectionNumber: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/faqs/:slug
export const getFaqBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findOne({ slug: req.params.slug, isPublished: true, isDeleted: false });
    if (!faq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }

    // Increment view count
    faq.viewCount += 1;
    await faq.save();

    res.json(faq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/faqs/:id/vote
export const voteFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'helpful' or 'unhelpful'

    // Simple IP hash fallback for guests, could be improved
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userIdOrIpHash = ip; // Ideally hash the IP with a secret

    const faq = await FAQ.findById(id);
    if (!faq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }

    const existingVote = await Vote.findOne({ faqId: id, userIdOrIpHash });
    
    if (existingVote) {
      // User already voted, maybe allow changing vote? For now, prevent double vote.
      res.status(400).json({ message: 'You have already voted for this FAQ' });
      return;
    }

    await Vote.create({ faqId: id, userIdOrIpHash, voteType });

    if (voteType === 'helpful') {
      faq.helpfulVotes += 1;
    } else {
      faq.unhelpfulVotes += 1;
    }

    await faq.save();
    res.json({ message: 'Vote recorded successfully', faq });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'You have already voted for this FAQ' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
