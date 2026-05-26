import { Request, Response } from 'express';
import { AQ } from '../models/AQ';
import { FAQ } from '../models/FAQ';
import { Vote } from '../models/Vote';
import { AuthRequest } from '../middleware/authMiddleware';

// GET /api/aqs
export const getAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query: any = { isDeleted: false, isPublished: true };

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const aqs = await AQ.find(query).sort({ sectionNumber: 1, askedCount: -1, createdAt: -1 });
    res.json(aqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/aqs/:slug
export const getAQBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const aq = await AQ.findOne({ slug: req.params.slug, isDeleted: false });
    if (!aq) {
      res.status(404).json({ message: 'AQ not found' });
      return;
    }

    // Increment view count automatically when fetched individually
    aq.viewCount += 1;
    await aq.save();

    res.json(aq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/aqs/:id/view
export const viewAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const aq = await AQ.findById(id);
    if (!aq) {
      res.status(404).json({ message: 'AQ not found' });
      return;
    }
    aq.viewCount += 1;
    await aq.save();
    res.json({ message: 'View count incremented', viewCount: aq.viewCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/aqs/:id/vote
export const voteAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'helpful', 'unhelpful', or 'ask'
    
    // Using IP as fallback identifier if user is not logged in
    const userId = (req as AuthRequest).user?._id?.toString() || req.ip || 'anonymous';

    const aq = await AQ.findById(id);
    if (!aq) {
      res.status(404).json({ message: 'AQ not found' });
      return;
    }

    // Check if vote already exists for this user/ip + faq
    const existingVote = await Vote.findOne({ targetId: id, targetType: 'AQ', userIdOrIpHash: userId as string });

    if (existingVote) {
      // Reversing a vote
      if (existingVote.voteType === voteType) {
        if (voteType === 'helpful') aq.helpfulVotes = Math.max(0, aq.helpfulVotes - 1);
        if (voteType === 'unhelpful') aq.unhelpfulVotes = Math.max(0, aq.unhelpfulVotes - 1);
        if (voteType === 'ask') aq.askedCount = Math.max(1, aq.askedCount - 1); // keep minimum 1
        
        await existingVote.deleteOne();
        await aq.save();
        res.json({ message: 'Vote removed', aq });
        return;
      } else {
        // Changing a vote
        if (existingVote.voteType === 'helpful') aq.helpfulVotes = Math.max(0, aq.helpfulVotes - 1);
        if (existingVote.voteType === 'unhelpful') aq.unhelpfulVotes = Math.max(0, aq.unhelpfulVotes - 1);
        if (existingVote.voteType === 'ask') aq.askedCount = Math.max(1, aq.askedCount - 1);

        existingVote.voteType = voteType;
        await existingVote.save();

        if (voteType === 'helpful') aq.helpfulVotes += 1;
        if (voteType === 'unhelpful') aq.unhelpfulVotes += 1;
        if (voteType === 'ask') aq.askedCount += 1;
        
        await aq.save();
        res.json({ message: 'Vote changed', aq });
        return;
      }
    }

    await Vote.create({
      targetId: id as string,
      targetType: 'AQ',
      userIdOrIpHash: userId as string,
      voteType
    });

    if (voteType === 'helpful') aq.helpfulVotes += 1;
    if (voteType === 'unhelpful') aq.unhelpfulVotes += 1;
    if (voteType === 'ask') aq.askedCount += 1;
    await aq.save();

    res.json({ message: 'Vote recorded', aq });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN ONLY: POST /api/aqs/:id/promote
export const promoteToFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const aq = await AQ.findById(id);
    
    if (!aq) {
      res.status(404).json({ message: 'AQ not found' });
      return;
    }

    // Create a new FAQ from the AQ
    const newFaq = await FAQ.create({
      section: aq.section,
      sectionNumber: aq.sectionNumber,
      question: aq.question,
      answer: aq.answer || 'Answer pending...', // Ensure answer exists
      tags: aq.tags,
      slug: aq.slug + '-official', // Ensure uniqueness
      viewCount: aq.viewCount,
      helpfulVotes: aq.helpfulVotes,
      unhelpfulVotes: aq.unhelpfulVotes,
      isPublished: true,
      isDeleted: false,
    });

    // Delete the AQ now that it's promoted
    await aq.deleteOne();

    res.json({ message: 'AQ promoted to FAQ successfully', faq: newFaq });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN ONLY: DELETE /api/aqs/:id
export const deleteAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const aq = await AQ.findById(id);
    
    if (!aq) {
      res.status(404).json({ message: 'AQ not found' });
      return;
    }

    await aq.deleteOne();
    res.json({ message: 'AQ deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
