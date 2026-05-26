import React, { useState, useEffect } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import api from '../../api/axios';

interface AccordionProps {
  faq: {
    _id: string;
    question: string;
    answer: string;
    helpfulVotes?: number;
    unhelpfulVotes?: number;
    viewCount?: number;
  };
}

const Accordion: React.FC<AccordionProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [voteType, setVoteType] = useState<'helpful' | 'unhelpful' | null>(null);
  
  // Local state for optimistic updates
  const [helpfulCount, setHelpfulCount] = useState(faq.helpfulVotes || 0);
  const [unhelpfulCount, setUnhelpfulCount] = useState(faq.unhelpfulVotes || 0);

  useEffect(() => {
    if (isOpen && !hasViewed) {
      setHasViewed(true);
      api.post(`/faqs/${faq._id}/view`).catch(err => console.error('Failed to track view', err));
    }
  }, [isOpen, hasViewed, faq._id]);

  const handleVote = async (type: 'helpful' | 'unhelpful') => {
    if (voteType) return; // Prevent multiple votes per session
    
    // Optimistic UI update
    setVoteType(type);
    if (type === 'helpful') setHelpfulCount(c => c + 1);
    else setUnhelpfulCount(c => c + 1);

    try {
      await api.post(`/faqs/${faq._id}/vote`, { voteType: type });
    } catch (error) {
      console.error('Failed to vote', error);
      // Revert if failed
      setVoteType(null);
      if (type === 'helpful') setHelpfulCount(c => c - 1);
      else setUnhelpfulCount(c => c - 1);
    }
  };

  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-6 py-5 text-left focus:outline-none focus-visible:ring focus-visible:ring-sky-300 focus-visible:ring-opacity-50"
      >
        <span className="text-lg font-medium text-gray-800 pr-4">{faq.question}</span>
        <div className={`p-1.5 rounded-full bg-sky-100/50 text-sky-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div 
          className="px-6 pb-4 pt-2 text-gray-600 prose prose-sky max-w-none"
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        />
        
        {/* Voting Section */}
        <div className="px-6 pb-6 pt-2 flex items-center gap-4 text-sm font-medium text-gray-500 border-t border-gray-200/60 mt-2">
          <span>Was this helpful?</span>
          <div className="flex gap-2">
            <button 
              onClick={() => handleVote('helpful')}
              disabled={voteType !== null}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                voteType === 'helpful' 
                  ? 'bg-sky-100 border-sky-300 text-sky-700' 
                  : voteType === 'unhelpful' 
                    ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                    : 'bg-white hover:bg-sky-50 border-gray-300 hover:border-sky-300 hover:text-sky-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{helpfulCount}</span>
            </button>
            <button 
              onClick={() => handleVote('unhelpful')}
              disabled={voteType !== null}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                voteType === 'unhelpful' 
                  ? 'bg-red-50 border-red-300 text-red-700' 
                  : voteType === 'helpful'
                    ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                    : 'bg-white hover:bg-red-50 border-gray-300 hover:border-red-300 hover:text-red-600'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{unhelpfulCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
