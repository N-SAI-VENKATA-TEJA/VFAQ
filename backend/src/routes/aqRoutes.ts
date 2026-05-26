import express from 'express';
import { getAQs, getAQBySlug, voteAQ, viewAQ, promoteToFAQ } from '../controllers/aqController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAQs);
router.get('/:slug', getAQBySlug);
router.post('/:id/vote', voteAQ);
router.post('/:id/view', viewAQ);

// Admin routes for AQs
router.post('/:id/promote', protect, admin, promoteToFAQ);

export default router;
