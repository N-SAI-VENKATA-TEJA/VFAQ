import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  question: string;
  answer: string; // HTML string
}

const Accordion: React.FC<AccordionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-6 py-5 text-left focus:outline-none focus-visible:ring focus-visible:ring-sky-300 focus-visible:ring-opacity-50"
      >
        <span className="text-lg font-medium text-gray-800 pr-4">{question}</span>
        <div className={`p-1.5 rounded-full bg-sky-100/50 text-sky-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div 
          className="px-6 pb-6 pt-2 text-gray-600 prose prose-sky max-w-none"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
};

export default Accordion;
