import { Search } from 'lucide-react';
import api from '../api/axios';
import Accordion from '../components/ui/Accordion';
import { useAuthStore } from '../store/authStore';

interface AQ {
  _id: string;
  section: string;
  sectionNumber: number;
  question: string;
  answer: string;
  slug: string;
}

const AQPage = () => {
  const [aqs, setAqs] = useState<AQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchAQs = async () => {
      try {
        const response = await api.get('/aqs');
        setAqs(response.data);
      } catch (error) {
        console.error('Failed to fetch AQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAQs();
  }, []);

  // Extract unique categories (sections) dynamically from fetched AQs
  const categories = useMemo(() => {
    const uniqueSections = Array.from(new Set(aqs.map(aq => aq.section)));
    // Optional: Sort alphabetically or keep original order. Let's keep original sorting by sectionNumber if possible
    // but the Set will preserve insertion order which might be good enough since they are fetched sorted.
    return ['All Categories', ...uniqueSections];
  }, [aqs]);

  // Client-side filtering by Search AND Category
  const filteredAQs = useMemo(() => {
    return aqs.filter((aq) => {
      const matchesSearch = !searchQuery || 
        aq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aq.answer?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All Categories' || aq.section === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [aqs, searchQuery, selectedCategory]);

  // Group by section
  const groupedAQs = useMemo(() => {
    const groups: { [key: string]: AQ[] } = {};
    filteredAQs.forEach((aq) => {
      const sectionName = `${aq.sectionNumber}. ${aq.section}`;
      if (!groups[sectionName]) {
        groups[sectionName] = [];
      }
      groups[sectionName].push(aq);
    });
    
    // Sort sections by sectionNumber
    return Object.entries(groups).sort((a, b) => {
import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';
import Accordion from '../components/ui/Accordion';
import { useAuthStore } from '../store/authStore';

interface AQ {
  _id: string;
  section: string;
  sectionNumber: number;
  question: string;
  answer: string;
  slug: string;
}

const AQPage = () => {
  const [aqs, setAqs] = useState<AQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchAQs = async () => {
      try {
        const response = await api.get('/aqs');
        setAqs(response.data);
      } catch (error) {
        console.error('Failed to fetch AQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAQs();
  }, []);

  // Extract unique categories (sections) dynamically from fetched AQs
  const categories = useMemo(() => {
    const uniqueSections = Array.from(new Set(aqs.map(aq => aq.section)));
    // Optional: Sort alphabetically or keep original order. Let's keep original sorting by sectionNumber if possible
    // but the Set will preserve insertion order which might be good enough since they are fetched sorted.
    return ['All Categories', ...uniqueSections];
  }, [aqs]);

  // Client-side filtering by Search AND Category
  const filteredAQs = useMemo(() => {
    return aqs.filter((aq) => {
      const matchesSearch = !searchQuery || 
        aq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aq.answer?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All Categories' || aq.section === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [aqs, searchQuery, selectedCategory]);

  // Group by section
  const groupedAQs = useMemo(() => {
    const groups: { [key: string]: AQ[] } = {};
    filteredAQs.forEach((aq) => {
      const sectionName = `${aq.sectionNumber}. ${aq.section}`;
      if (!groups[sectionName]) {
        groups[sectionName] = [];
      }
      groups[sectionName].push(aq);
    });
    
    // Sort sections by sectionNumber
    return Object.entries(groups).sort((a, b) => {
      const numA = parseInt(a[0].split('.')[0]);
      const numB = parseInt(b[0].split('.')[0]);
      return numA - numB;
    });
  }, [filteredAQs]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Asked Questions (AQs)</h1>
        <p className="text-lg text-gray-600 mb-8">Browse questions asked by the community. Upvote questions you also have!</p>
        
        {/* Search and Filter Bar */}
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-sky-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg shadow-sky-100/50 focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all text-gray-800 text-lg placeholder-gray-400"
              placeholder="Search AQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-72">
            <select
              className="block w-full px-4 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg shadow-sky-100/50 focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all text-gray-800 text-lg appearance-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Ask a Question Form */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl border border-white/80 shadow-xl shadow-sky-100/50 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Can't find your answer?</h2>
        <p className="text-gray-600 mb-6">Submit a question and our team will answer it!</p>
        
        <form 
          className="space-y-4"
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
          <div className="flex gap-4">
            <input 
              type="text" 
              name="question"
              required
              placeholder="Type your question here..."
              className="flex-1 px-5 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800"
            />
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-lg shadow-sky-200 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {groupedAQs.length === 0 ? (
            <div className="text-center py-12 bg-white/40 rounded-3xl border border-white/60">
              <p className="text-xl text-gray-500">No AQs found matching "{searchQuery}"</p>
            </div>
          ) : (
            groupedAQs.map(([sectionTitle, sectionAQs]) => (
              <div key={sectionTitle} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-sky-400">
                  {sectionTitle}
                </h2>
                <div className="space-y-4">
                  {sectionAQs.map((aq) => (
                    <Accordion key={aq._id} faq={aq as any} type="AQ" />
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

export default AQPage;
