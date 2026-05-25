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
    const adminEmail = 'admin@vicharanashala.ai';
    const adminPassword = 'Admin@1234';
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
    const faqsFilePath = path.join(__dirname, '..', 'data', 'faqs.json');
    if (fs.existsSync(faqsFilePath)) {
      const faqsData = JSON.parse(fs.readFileSync(faqsFilePath, 'utf-8'));
      await FAQ.insertMany(faqsData);
      console.log(`${faqsData.length} FAQs seeded successfully`);
    } else {
      console.log('faqs.json not found! Please run the scraper first.');
    }

    console.log('Data Seeding Complete!');
    process.exit();
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
