import express from 'express';
import { getFaqs, getFaqBySlug, voteFaq, viewFaq } from '../controllers/faqController';

const router = express.Router();

router.get('/', getFaqs);
router.get('/:slug', getFaqBySlug);
router.post('/:id/view', viewFaq);
router.post('/:id/vote', voteFaq);

export default router;
