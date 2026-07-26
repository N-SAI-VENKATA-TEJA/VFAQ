import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import faqRoutes from "./routes/faqRoutes";
import questionRoutes from "./routes/questionRoutes";
import adminRoutes from "./routes/adminRoutes";
import chatRoutes from "./routes/chatRoutes";
import { connectDB } from "./config/db";
import { initRAG } from "./services/ragService";

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",")
      : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
); // application level middleware
app.use(express.json()); //application level middleware
app.use(cookieParser()); // application level middleware

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Backend is running" });
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // Initialize RAG pipeline
  await initRAG();
});
