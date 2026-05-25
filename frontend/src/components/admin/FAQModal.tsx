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
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose, onSave, faq }) => {
  const [formData, setFormData] = useState<Partial<FAQ>>({
    section: '',
    sectionNumber: 1,
    question: '',
    answer: '',
    isPublished: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faq) {
      setFormData(faq);
    } else {
      setFormData({
        section: '',
        sectionNumber: 1,
        question: '',
        answer: '',
        isPublished: true,
      });
    }
  }, [faq, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {faq ? 'Edit FAQ' : 'Create New FAQ'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200/50 text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Section Number</label>
              <input 
                type="number"
                required
                value={formData.sectionNumber || ''}
                onChange={(e) => setFormData({ ...formData, sectionNumber: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-gray-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Section Name</label>
              <input 
                type="text"
                required
                value={formData.section || ''}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/60 border border-gray-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Question</label>
            <input 
              type="text"
              required
              value={formData.question || ''}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/60 border border-gray-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Answer (HTML allowed)</label>
            <textarea 
              required
              rows={5}
              value={formData.answer || ''}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/60 border border-gray-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none resize-y"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
            />
            <label htmlFor="isPublished" className="font-medium text-gray-700">Published (Visible to public)</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/60">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
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
