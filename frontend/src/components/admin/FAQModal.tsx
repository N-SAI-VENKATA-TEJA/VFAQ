import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FAQ {
  _id?: string;
  section: string;
  sectionNumber: number;
  question: string;
  answer: string;
  isPublished: boolean;
  tags?: string[];
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Partial<FAQ>) => Promise<void>;
  faq: FAQ | null;
  sections: string[];
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose, onSave, faq, sections }) => {
  const [formData, setFormData] = useState<Partial<FAQ>>({
    section: '',
    question: '',
    answer: '',
    isPublished: true,
  });
  const [isNewSection, setIsNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faq) {
      setFormData(faq);
      setIsNewSection(false);
      setNewSectionName(faq.section && !sections.includes(faq.section) ? faq.section : '');
    } else {
      setFormData({
        section: '',
        question: '',
        answer: '',
        isPublished: true,
      });
      setIsNewSection(false);
      setNewSectionName('');
    }
  }, [faq, isOpen, sections]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSection = isNewSection ? newSectionName : formData.section;
    
    if (!finalSection) {
      alert("Please select or enter a section name.");
      return;
    }

    setLoading(true);
    // Submit without sectionNumber, let the backend calculate it if needed
    const { sectionNumber, ...dataToSubmit } = formData;
    await onSave({ ...dataToSubmit, section: finalSection });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 animate-in fade-in duration-300">
      <div className="bg-brand-white border border-border-primary shadow-card-inner rounded-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-brand-white/90 backdrop-blur-md px-8 py-6 border-b border-border-primary flex justify-between items-center z-10">
          <h2 className="text-2xl font-medium tracking-tight-xl text-text-primary">
            {faq ? 'Edit FAQ' : 'Create New FAQ'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary text-text-secondary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary ml-4">Section Name</label>
              <select 
                required={!isNewSection}
                value={isNewSection ? 'new' : formData.section || ''}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setIsNewSection(true);
                  } else {
                    setIsNewSection(false);
                    setFormData({ ...formData, section: e.target.value });
                  }
                }}
                className="block w-full px-6 py-3 min-h-[3.5rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base cursor-pointer"
              >
                <option value="" disabled>Select a section...</option>
                {sections.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
                <option value="new" className="font-semibold text-brand-aqua">+ Create New Section</option>
              </select>
            </div>
            
            {isNewSection && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-text-primary ml-4">New Section Name</label>
                <input 
                  type="text"
                  required
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g. Intern Onboarding"
                  className="block w-full px-6 py-3 min-h-[3.5rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A]"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary ml-4">Question</label>
            <input 
              type="text"
              required
              value={formData.question || ''}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="block w-full px-6 py-3 min-h-[3.5rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary ml-4">Answer (HTML allowed)</label>
            <textarea 
              required
              rows={5}
              value={formData.answer || ''}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="block w-full px-6 py-4 rounded-[1.5rem] bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A] resize-y"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-2 ml-4">
            <input 
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-5 h-5 text-brand-aqua rounded focus:ring-brand-aqua/30"
            />
            <label htmlFor="isPublished" className="font-medium text-text-primary">Published (Visible to public)</label>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border-primary">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-pill bg-brand-white border border-brand-gray-light hover:bg-bg-secondary text-text-primary font-semibold transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-pill bg-bg-tertiary hover:bg-[#353539] text-brand-white font-semibold transition-colors shadow-button-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQModal;
