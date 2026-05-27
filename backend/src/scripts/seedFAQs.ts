import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load models
import { FAQ } from '../models/FAQ';
import { User } from '../models/User';

dotenv.config();

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI is missing in .env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('MongoDB Connected for seeding');

    // 1. Clear existing Data
    await FAQ.deleteMany();
    await User.deleteMany();
    console.log('Existing FAQs and Users deleted');

    // 2. Create Admin User
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD is missing in .env');
      process.exit(1);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`Admin user created: ${adminEmail}`);

    // 3. Seed FAQs
    const { customFaqs } = await import('../data/hardcodedFaqs');
    
    // Map custom categories to section numbers
    const categoryMap: { [key: string]: number } = {};
    let currentNumber = 1;

    const formattedFaqs = customFaqs.map(faq => {
      if (!categoryMap[faq.category]) {
        categoryMap[faq.category] = currentNumber++;
      }
      
      return {
        section: faq.category,
        sectionNumber: categoryMap[faq.category],
        question: faq.question,
        answer: faq.answer,
        slug: faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        isPublished: true,
        tags: []
      };
    });

    await FAQ.insertMany(formattedFaqs);
    console.log(`${formattedFaqs.length} FAQs seeded successfully`);

    console.log('Data Seeding Complete!');
    process.exit();
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
