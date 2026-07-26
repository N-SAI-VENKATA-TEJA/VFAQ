import express, { Request, Response } from 'express';
import { generateAnswer } from '../services/ragService';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    if (!message) {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

    const answer = await generateAnswer(message);
    res.json({ answer });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: error.message || 'Error generating answer' });
  }
});

export default router;
