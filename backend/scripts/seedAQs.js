const mongoose = require('mongoose');
require('dotenv').config();

const faqSchema = new mongoose.Schema({
  section: String,
  sectionNumber: Number,
  question: String,
  answer: String,
  tags: [String],
  slug: String,
  viewCount: Number,
  helpfulVotes: Number,
  unhelpfulVotes: Number,
  isPublished: Boolean,
  isDeleted: Boolean,
}, { timestamps: true });

const aqSchema = new mongoose.Schema({
  section: String,
  sectionNumber: Number,
  question: String,
  answer: String,
  tags: [String],
  slug: String,
  viewCount: Number,
  helpfulVotes: Number,
  unhelpfulVotes: Number,
  askedCount: { type: Number, default: 1 },
  isPublished: Boolean,
  isDeleted: Boolean,
}, { timestamps: true });

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);
const AQ = mongoose.models.AQ || mongoose.model('AQ', aqSchema);

const seedAQs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const faqs = await FAQ.find({ isDeleted: false });
    console.log(`Found ${faqs.length} FAQs to copy.`);

    // Clear existing AQs to avoid dupes while testing
    await AQ.deleteMany({});

    for (const faq of faqs) {
      await AQ.create({
        section: faq.section,
        sectionNumber: faq.sectionNumber,
        question: faq.question,
        answer: faq.answer,
        tags: faq.tags,
        slug: faq.slug,
        viewCount: faq.viewCount,
        helpfulVotes: faq.helpfulVotes,
        unhelpfulVotes: faq.unhelpfulVotes,
        askedCount: 1, // initialize with 1
        isPublished: faq.isPublished,
        isDeleted: faq.isDeleted
      });
    }

    console.log('Successfully seeded AQs from FAQs.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding AQs:', error);
    process.exit(1);
  }
};

seedAQs();
