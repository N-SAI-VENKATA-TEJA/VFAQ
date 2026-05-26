import React, { useState, useEffect } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import api from '../../api/axios';

interface AccordionProps {
  faq: {
    _id: string;
    question: string;
    answer: string;
    helpfulVotes: number;
    unhelpfulVotes: number;
    askedCount?: number;
  };
  type?: 'FAQ' | 'AQ';
}

const Accordion: React.FC<AccordionProps> = ({ faq, type = 'FAQ' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [voteType, setVoteType] = useState<'helpful' | 'unhelpful' | 'ask' | null>(null);
  
  // Local state for optimistic updates
  const [helpfulCount, setHelpfulCount] = useState(faq.helpfulVotes || 0);
  const [unhelpfulCount, setUnhelpfulCount] = useState(faq.unhelpfulVotes || 0);

  useEffect(() => {
    const trackView = async () => {
      if (isOpen && !hasViewed) {
        try {
          const endpoint = type === 'AQ' ? `/aqs/${faq._id}/view` : `/faqs/${faq._id}/view`;
          await api.post(endpoint);
          setHasViewed(true);
        } catch (err) {
          console.error('Failed to track view', err);
        }
      }
    };
    trackView();
  }, [isOpen, hasViewed, faq._id, type]);

  const handleVote = async (targetVote: 'helpful' | 'unhelpful' | 'ask') => {
    const previousVoteType = voteType;
    const isRemoving = voteType === targetVote;
    
    // Optimistic UI update logic
    if (isRemoving) {
      setVoteType(null);
    } else {
      setVoteType(targetVote);
    }

    try {
      const endpoint = type === 'AQ' ? `/aqs/${faq._id}/vote` : `/faqs/${faq._id}/vote`;
      await api.post(endpoint, { voteType: targetVote });
    } catch (error) {
      console.error('Failed to vote', error);
      setVoteType(previousVoteType);
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
            {type === 'AQ' && (
              <button
                onClick={() => handleVote('ask')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  voteType === 'ask' 
                    ? 'bg-sky-100 text-sky-700 border border-sky-300' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>+1 Me too</span>
                {faq.askedCount !== undefined && <span className="text-xs opacity-70">({faq.askedCount + (voteType === 'ask' ? 1 : 0)})</span>}
              </button>
            )}
            <button 
              onClick={() => handleVote('helpful')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                voteType === 'helpful' 
                  ? 'bg-sky-100 border-sky-300 text-sky-700 hover:bg-sky-200' 
                  : 'bg-white hover:bg-sky-50 border-gray-300 hover:border-sky-300 hover:text-sky-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{helpfulCount}</span>
            </button>
            <button 
              onClick={() => handleVote('unhelpful')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                voteType === 'unhelpful' 
                  ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' 
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
