import { Request, Response } from 'express';
import { SubmittedQuestion } from '../models/SubmittedQuestion';

// POST /api/questions/submit
export const submitQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, category, submitterName, submitterEmail } = req.body;

    if (!question || !category) {
      res.status(400).json({ message: 'Question and category are required' });
      return;
    }

    const submitted = await SubmittedQuestion.create({
      question,
      category,
      submitterName,
      submitterEmail,
      status: 'pending',
    });

    res.status(201).json({ message: 'Question submitted successfully', data: submitted });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
