import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface PendingQuestion {
  _id: string;
  question: string;
  category: string;
  submitterEmail?: string;
  submitterName?: string;
  createdAt: string;
}

interface ApproveQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, data: any) => void;
  question: PendingQuestion | null;
  sections: string[];
}

const ApproveQuestionModal: React.FC<ApproveQuestionModalProps> = ({ isOpen, onClose, onApprove, question, sections }) => {
  const [formData, setFormData] = useState({
    answer: '',
    section: '',
    tags: '',
  });
  const [isNewSection, setIsNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  useEffect(() => {
    if (question) {
      setFormData({
        answer: '',
        section: question.category && sections.includes(question.category) ? question.category : '',
        tags: '',
      });
      setIsNewSection(false);
      setNewSectionName(question.category && !sections.includes(question.category) ? question.category : '');
    }
  }, [question, sections]);

  if (!isOpen || !question) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSection = isNewSection ? newSectionName : formData.section;
    
    if (!finalSection) {
      alert("Please select or enter a section.");
      return;
    }

    onApprove(question._id, {
      ...formData,
      section: finalSection,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-white/60 animate-in slide-in-from-bottom-8 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-emerald-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Approve Question & Create FAQ</h2>
            <p className="text-sm text-gray-500 mt-1">Provide an answer before publishing to the community.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Question from User</label>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium">
              {question.question}
            </div>
            {question.submitterName && (
              <p className="text-xs text-gray-500 mt-2">Asked by: {question.submitterName} ({question.submitterEmail})</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Answer</label>
            <textarea
              required
              rows={4}
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Write a clear, helpful answer..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category (Section)</label>
              <select
                required={!isNewSection}
                value={isNewSection ? 'new' : formData.section}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setIsNewSection(true);
                  } else {
                    setIsNewSection(false);
                    setFormData({ ...formData, section: e.target.value });
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="" disabled>Select a section...</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
                <option value="new" className="font-semibold text-emerald-600">+ Create New Section</option>
              </select>
            </div>
            
            {isNewSection && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Section Name</label>
                <input
                  type="text"
                  required
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g. Intern Onboarding"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. selection, internship, dates"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Publish to FAQs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApproveQuestionModal;
