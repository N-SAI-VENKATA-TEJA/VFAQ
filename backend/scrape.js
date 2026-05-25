const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeFAQs() {
  try {
    const { data } = await axios.get('https://samagama.in/internship/faq');
    const $ = cheerio.load(data);
    const faqs = [];
    
    // The structure: sections are h2, and within or following them are <details class="faq-q">
    let currentSection = '';
    let currentSectionNumber = 0;

    $('h2, details.faq-q').each((i, el) => {
      if ($(el).is('h2')) {
        const text = $(el).text().trim();
        const match = text.match(/^(\d+)\.\s+(.*?)(?:\s+§)?$/);
        if (match) {
          currentSectionNumber = parseInt(match[1]);
          currentSection = match[2].trim();
        } else {
            // For sections that might not have numbers like "Contents"
            if (!text.includes('Contents')) {
                currentSection = text;
                currentSectionNumber++;
            }
        }
      } else if ($(el).is('details')) {
        const summary = $(el).find('summary').text().trim();
        // Remove the anchor symbol at the end
        const cleanQuestion = summary.replace(/§$/, '').trim();
        
        // Extract inner HTML for answer to keep formatting (p, ul, li)
        // Remove the summary element, then get HTML
        const answerHtml = $(el).children().not('summary').toArray().map(c => $.html(c)).join('').trim();
        
        // Generate a slug
        const slug = cleanQuestion.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        if (cleanQuestion && answerHtml) {
          faqs.push({
            section: currentSection,
            sectionNumber: currentSectionNumber,
            question: cleanQuestion,
            answer: answerHtml,
            slug: slug,
            isPublished: true,
            tags: []
          });
        }
      }
    });

    const dir = path.join(__dirname, 'src', 'data');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'faqs.json'), JSON.stringify(faqs, null, 2));
    console.log(`Successfully scraped ${faqs.length} FAQs into src/data/faqs.json`);
  } catch (error) {
    console.error('Error scraping:', error);
  }
}

scrapeFAQs();
