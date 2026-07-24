import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';
import Accordion from '../components/ui/Accordion';
import { useAuthStore } from '../store/authStore';

interface FAQ {
  _id: string;
  section: string;
  sectionNumber: number;
  question: string;
  answer: string;
  slug: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
}

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await api.get('/faqs');
        setFaqs(response.data);
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  const categories = useMemo(() => {
    const uniqueSections = Array.from(new Set(faqs.map(faq => faq.section)));
    return ['All Categories', ...uniqueSections];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = !searchQuery || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All Categories' || faq.section === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, selectedCategory]);

  const groupedFaqs = useMemo(() => {
    const groups: { [key: string]: FAQ[] } = {};
    filteredFaqs.forEach((faq) => {
      const sectionName = `${faq.sectionNumber}. ${faq.section}`;
      if (!groups[sectionName]) {
        groups[sectionName] = [];
      }
      groups[sectionName].push(faq);
    });
    
    return Object.entries(groups).sort((a, b) => {
      const numA = parseInt(a[0].split('.')[0]);
      const numB = parseInt(b[0].split('.')[0]);
      return numA - numB;
    });
  }, [filteredFaqs]);

  return (
    <div className="w-full max-w-[70.5rem] mx-auto space-y-12 animate-fade-up">
      <div className="text-center mb-16 pt-10">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight-xl text-text-primary mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-text-secondary mb-10">Find answers to common questions about the internship.</p>
        
        {/* Search and Filter Bar */}
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-tertiary" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-6 py-4 min-h-[4rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A]"
              placeholder="Search the FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-72">
            <select
              className="block w-full px-6 py-4 min-h-[4rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base appearance-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-text-tertiary">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 rounded-card bg-bg-secondary border border-border-primary shadow-card-inner mb-16 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-medium tracking-tight-xl text-text-primary mb-2">Can't find your answer?</h2>
          <p className="text-text-secondary">Submit a question and our team will answer it!</p>
        </div>
        
        <form 
          className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('question') as HTMLInputElement;
            if (!input.value.trim()) return;
            
            try {
              const category = selectedCategory === 'All Categories' ? 'General' : selectedCategory;
              await api.post('/questions/submit', { 
                question: input.value,
                category,
                submitterName: user?.name,
                submitterEmail: user?.email
              });
              alert('Question submitted successfully! It is now pending review.');
              input.value = '';
            } catch (error) {
              console.error('Error submitting question', error);
              alert('Failed to submit question.');
            }
          }}
        >
          <input 
            type="text" 
            name="question"
            required
            placeholder="Type your question here..."
            className="flex-1 px-6 py-3 min-h-[4rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A]"
          />
          <button 
            type="submit"
            className="px-8 py-3 h-[4rem] rounded-[0.75rem] bg-bg-tertiary hover:bg-[#353539] text-brand-white font-semibold transition-colors duration-200 whitespace-nowrap shadow-button-primary"
          >
            Submit
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-aqua"></div>
        </div>
      ) : (
        <div className="space-y-16">
          {groupedFaqs.length === 0 ? (
            <div className="text-center py-16 bg-bg-secondary rounded-card border border-border-primary">
              <p className="text-xl font-medium text-text-secondary">No FAQs found matching "{searchQuery}"</p>
            </div>
          ) : (
            groupedFaqs.map(([sectionTitle, sectionFaqs]) => (
              <div key={sectionTitle} className="scroll-mt-24">
                <h2 className="text-3xl font-medium tracking-tight-xl text-text-primary mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-aqua text-brand-white text-base font-semibold">{sectionTitle.split('.')[0]}</span>
                  {sectionTitle.split('.').slice(1).join('.')}
                </h2>
                <div className="space-y-4">
                  {sectionFaqs.map((faq) => (
                    <Accordion key={faq._id} faq={faq} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default FAQPage;
