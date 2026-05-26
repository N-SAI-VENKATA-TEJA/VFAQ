import express from 'express';
import { submitQuestion, getMyQuestions } from '../controllers/questionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/submit', submitQuestion);
router.get('/my-queries', protect, getMyQuestions);

export default router;
