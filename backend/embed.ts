import { connectDB } from './src/config/db';
import { FAQ } from './src/models/FAQ';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await connectDB();
  const faqs = await FAQ.find({ isDeleted: false, isPublished: true, embedding: { $exists: false } });
  console.log('FAQs to embed:', faqs.length);
  
  const e = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-embedding-2'
  });
  
  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];
    const text = 'Section: ' + faq.section + '\nQuestion: ' + faq.question + '\nAnswer: ' + faq.answer;
    try {
      const res = await e.embedQuery(text);
      faq.embedding = res;
      await faq.save();
      console.log('Embedded', i+1, '/', faqs.length, '(', faq.section, ')');
    } catch (err: any) {
      console.error('Failed at', i, err.message);
      await new Promise(r => setTimeout(r, 65000));
      i--;
    }
    // Limit is 100 requests per minute, so we wait 700ms between requests.
    await new Promise(r => setTimeout(r, 700));
  }
  console.log('Done!');
  process.exit(0);
}
run();
