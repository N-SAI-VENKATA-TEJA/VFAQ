import express from 'express';
import { getFaqs, getFaqBySlug, voteFaq } from '../controllers/faqController';

const router = express.Router();

router.get('/', getFaqs);
router.get('/:slug', getFaqBySlug);
router.post('/:id/vote', voteFaq);

export default router;
