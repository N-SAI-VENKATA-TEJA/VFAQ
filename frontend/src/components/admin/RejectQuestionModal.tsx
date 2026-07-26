import React, { useState } from 'react';
import { X, XCircle } from 'lucide-react';

interface PendingQuestion {
  _id: string;
  question: string;
  category: string;
  submitterEmail?: string;
  submitterName?: string;
  createdAt: string;
}

interface RejectQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (id: string, reason: string) => void;
  question: PendingQuestion | null;
}

const PREDEFINED_REASONS = [
  "Duplicate question",
  "Out of scope for this FAQ",
  "Spam or inappropriate content",
  "Not clear / Needs more information",
  "Other"
];

const RejectQuestionModal: React.FC<RejectQuestionModalProps> = ({ isOpen, onClose, onReject, question }) => {
  const [selectedReason, setSelectedReason] = useState(PREDEFINED_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !question) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason;
    onReject(question._id, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/60 animate-in slide-in-from-bottom-8 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-red-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Reject Question</h2>
            <p className="text-sm text-gray-500 mt-1">Provide a reason for rejecting this question.</p>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Rejection</label>
            <select
              required
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all cursor-pointer bg-white"
            >
              {PREDEFINED_REASONS.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          {selectedReason === 'Other' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Custom Reason</label>
              <textarea
                required
                rows={3}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Write specific details for rejection..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
              />
            </div>
          )}

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
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-200 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Reject Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectQuestionModal;
