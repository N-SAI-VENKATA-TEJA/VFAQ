import { useEffect, useState } from 'react';
import { ClipboardList, Clock, CheckCircle2, XCircle, Search, MessageCircleQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface SubmittedQuestion {
  _id: string;
  question: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  aiGeneratedAnswer?: string;
  createdAt: string;
}

const MyQueries = () => {
  const [queries, setQueries] = useState<SubmittedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyQueries = async () => {
      try {
        const response = await api.get('/questions/my-queries');
        setQueries(response.data);
      } catch (error) {
        console.error('Failed to fetch my queries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyQueries();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100/50', border: 'border-green-200', text: 'Approved & Added to FAQ' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100/50', border: 'border-red-200', text: 'Rejected/Duplicate' };
      default:
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100/50', border: 'border-yellow-200', text: 'Pending Review' };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <ClipboardList className="w-10 h-10 text-sky-500" />
          My Queries
        </h1>
        <p className="text-lg text-gray-600 mb-8">Track the status of questions you've submitted to the team.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
      ) : queries.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/40 rounded-3xl border border-white/60 shadow-sm">
          <MessageCircleQuestion className="w-16 h-16 text-sky-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No queries yet!</h3>
          <p className="text-gray-600 mb-8">You haven't submitted any questions. If you can't find what you're looking for, ask us!</p>
          <Link 
            to="/faqs"
            className="inline-flex justify-center items-center gap-2 px-8 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow-lg shadow-sky-200 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Search className="w-5 h-5" />
            Go to FAQs to ask a question
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {queries.map((query) => {
            const statusConfig = getStatusConfig(query.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={query._id} className="p-6 rounded-3xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
                      {query.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800">{query.question}</h3>
                    <p className="text-sm text-gray-400 mt-1">Submitted on {new Date(query.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} font-medium text-sm whitespace-nowrap self-start`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.text}
                  </div>
                </div>

                {query.aiGeneratedAnswer && query.status === 'pending' && (
                  <div className="mt-4 p-4 rounded-2xl bg-sky-50 border border-sky-100">
                    <h4 className="text-sm font-bold text-sky-800 mb-2 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                      </span>
                      AI Suggested Answer
                    </h4>
                    <p className="text-sky-900 text-sm">{query.aiGeneratedAnswer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyQueries;
