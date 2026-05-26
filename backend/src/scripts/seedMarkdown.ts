import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { FAQ } from '../models/FAQ';

dotenv.config();

const parseMarkdown = (content: string) => {
  const lines = content.split('\n');
  const faqs: any[] = [];
  let currentSection = '';
  let currentSectionNumber = 0;
  let currentQuestion = '';
  let currentAnswer = '';
  
  for (const line of lines) {
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      // New section
      if (currentQuestion) {
        faqs.push({ section: currentSection, sectionNumber: currentSectionNumber, question: currentQuestion, answer: currentAnswer.trim() });
        currentQuestion = '';
        currentAnswer = '';
      }
      const match = line.match(/^#\s+(\d+)\.\s+(.*)$/);
      if (match) {
        currentSectionNumber = parseInt(match[1]);
        currentSection = match[2].trim();
      }
    } else if (line.startsWith('## ')) {
      // New question
      if (currentQuestion) {
        faqs.push({ section: currentSection, sectionNumber: currentSectionNumber, question: currentQuestion, answer: currentAnswer.trim() });
        currentAnswer = '';
      }
      const match = line.match(/^##\s+\d+\.\d+\s+(.*)$/);
      if (match) {
        currentQuestion = match[1].trim();
      } else {
        // Fallback
        currentQuestion = line.replace(/^##\s+/, '').trim();
      }
    } else {
      // Answer body
      if (currentQuestion) {
        currentAnswer += line + '\n';
      }
    }
  }
  
  if (currentQuestion) {
    faqs.push({ section: currentSection, sectionNumber: currentSectionNumber, question: currentQuestion, answer: currentAnswer.trim() });
  }
  
  return faqs;
};

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const content = fs.readFileSync('C:\\\\Users\\\\saive\\\\V_FAQ\\\\vicharanashala_faq_structured.md', 'utf-8');
    const parsedFaqs = parseMarkdown(content);
    
    console.log(`Parsed ${parsedFaqs.length} FAQs from Markdown`);
    
    await FAQ.deleteMany();
    console.log('Cleared existing FAQs');
    
    const formattedFaqs = parsedFaqs.map(faq => ({
      ...faq,
      slug: faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').substring(0, 50),
      isPublished: true,
      tags: []
    }));
    
    const seenSlugs = new Set();
    for (const faq of formattedFaqs) {
      if (seenSlugs.has(faq.slug) || faq.slug === '') {
         let count = 1;
         let baseSlug = faq.slug || 'faq';
         while(seenSlugs.has(`${baseSlug}-${count}`)) count++;
         faq.slug = `${baseSlug}-${count}`;
      }
      seenSlugs.add(faq.slug);
    }
    
    await FAQ.insertMany(formattedFaqs);
    console.log('Successfully inserted new FAQs');
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

run();
