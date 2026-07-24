import React, { useState, useEffect } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import DOMPurify from 'dompurify';
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
  const [helpfulCount] = useState(faq.helpfulVotes || 0);
  const [unhelpfulCount] = useState(faq.unhelpfulVotes || 0);

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
    <div className="mb-4 overflow-hidden rounded-card bg-bg-secondary border border-border-primary transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
      >
        <span className="text-xl font-medium text-text-primary pr-4 tracking-tight-xl">{faq.question}</span>
        <div className={`p-2 rounded-full bg-brand-white shadow-button-primary text-text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div 
          className="px-6 pb-4 pt-2 text-text-secondary text-base leading-relaxed max-w-none prose prose-p:text-text-secondary prose-a:text-text-aqua"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer) }}
        />
        
        {/* Voting Section */}
        <div className="px-6 pb-6 pt-4 flex items-center gap-4 text-sm font-medium text-text-tertiary border-t border-border-primary mx-6">
          <span>Was this helpful?</span>
          <div className="flex gap-2">
            {type === 'AQ' && (
              <button
                onClick={() => handleVote('ask')}
                className={`flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium transition-all shadow-button-primary ${
                  voteType === 'ask' 
                    ? 'bg-brand-aqua-50 text-text-primary' 
                    : 'bg-brand-white text-text-primary hover:bg-brand-neutral-lighter'
                }`}
              >
                <span>+1 Me too</span>
                {faq.askedCount !== undefined && <span className="text-xs opacity-70">({faq.askedCount + (voteType === 'ask' ? 1 : 0)})</span>}
              </button>
            )}
            <button 
              onClick={() => handleVote('helpful')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-pill transition-all shadow-button-primary ${
                voteType === 'helpful' 
                  ? 'bg-brand-aqua text-brand-white' 
                  : 'bg-brand-white text-text-primary hover:text-brand-aqua'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{helpfulCount}</span>
            </button>
            <button 
              onClick={() => handleVote('unhelpful')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-pill transition-all shadow-button-primary ${
                voteType === 'unhelpful' 
                  ? 'bg-bg-tertiary text-brand-white' 
                  : 'bg-brand-white text-text-primary'
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
