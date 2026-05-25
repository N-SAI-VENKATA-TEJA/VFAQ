import express from 'express';
import {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getSubmittedQuestions,
  updateSubmittedQuestion,
  getStats,
} from '../controllers/adminController';
import { protect, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth and admin middleware to all admin routes
router.use(protect, adminMiddleware);

router.route('/faqs')
  .get(getAllFaqs)
  .post(createFaq);

router.route('/faqs/:id')
  .put(updateFaq)
  .delete(deleteFaq);

router.route('/questions')
  .get(getSubmittedQuestions);

router.route('/questions/:id')
  .patch(updateSubmittedQuestion);

router.get('/stats', getStats);

export default router;
