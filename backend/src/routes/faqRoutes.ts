import express from 'express';
import { getFaqs, getFaqBySlug, voteFaq, viewFaq } from '../controllers/faqController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getFaqs);
router.get('/:slug', getFaqBySlug);
router.post('/:id/view', viewFaq);
router.post('/:id/vote', protect, voteFaq);

export default router;
