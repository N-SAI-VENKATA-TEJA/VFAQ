import express, { Request, Response } from 'express';
import { generateAnswer } from '../services/ragService';

const router = express.Router();

// Hard timeout (ms) for the entire answer generation pipeline.
// This caps the wait even if LangChain internally retries the LLM call.
const CHAT_TIMEOUT_MS = 20_000;

const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
  );
  return Promise.race([promise, timeout]);
};

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

    const answer = await withTimeout(
      generateAnswer(message),
      CHAT_TIMEOUT_MS,
      'Chat answer generation'
    );

    res.json({ answer });
  } catch (error: any) {
    console.error('Chat API Error:', error);

    // Surface a friendly, fast error to the client
    const isTimeout = error.message?.includes('timed out');
    res.status(isTimeout ? 504 : 500).json({
      message: isTimeout
        ? 'The AI assistant is taking too long to respond. Please try again in a moment.'
        : (error.message || 'Error generating answer'),
    });
  }
});

export default router;
