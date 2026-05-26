import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import faqRoutes from './routes/faqRoutes';
import questionRoutes from './routes/questionRoutes';
import aqRoutes from './routes/aqRoutes';
import adminRoutes from './routes/adminRoutes';
import { connectDB } from './config/db';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/aqs', aqRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
