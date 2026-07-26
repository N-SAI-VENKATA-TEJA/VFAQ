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
        return { icon: CheckCircle2, color: 'text-brand-aqua', text: 'Approved & Added to FAQ' };
      case 'rejected':
        return { icon: XCircle, color: 'text-text-tertiary', text: 'Rejected/Duplicate' };
      default:
        return { icon: Clock, color: 'text-text-primary', text: 'Pending Review' };
    }
  };

  return (
    <div className="w-full max-w-[58rem] mx-auto space-y-12 animate-fade-up pt-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-medium tracking-tight-xl text-text-primary mb-6 flex items-center justify-center gap-4">
          <div className="p-3 rounded-full bg-brand-aqua-20 text-brand-aqua">
            <ClipboardList className="w-8 h-8" />
          </div>
          My Queries
        </h1>
        <p className="text-lg text-text-secondary">Track the status of questions you've submitted to the team.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-aqua"></div>
        </div>
      ) : queries.length === 0 ? (
        <div className="text-center py-20 px-8 bg-bg-secondary rounded-card border border-border-primary shadow-card-inner">
          <div className="w-20 h-20 bg-brand-white rounded-full flex items-center justify-center shadow-button-primary mx-auto mb-6">
            <MessageCircleQuestion className="w-10 h-10 text-brand-aqua opacity-80" />
          </div>
          <h3 className="text-3xl font-medium tracking-tight-xl text-text-primary mb-3">No queries yet!</h3>
          <p className="text-text-secondary mb-10 max-w-md mx-auto">You haven't submitted any questions. If you can't find what you're looking for, ask us!</p>
          <Link 
            to="/faqs"
            className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-pill bg-bg-tertiary text-brand-white font-medium shadow-button-primary hover:scale-95 transition-transform duration-300"
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
              <div key={query._id} className="p-8 rounded-card bg-brand-white border border-brand-gray-light shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-medium tracking-tight-xl text-text-primary leading-tight">{query.question}</h3>
                    <p className="text-sm text-text-tertiary mt-3">Submitted on {new Date(query.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-5 py-2.5 rounded-pill bg-brand-white border border-brand-gray-light shadow-sm ${statusConfig.color} font-semibold text-xs tracking-badge uppercase whitespace-nowrap self-start`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.text}
                  </div>
                </div>

                {query.aiGeneratedAnswer && query.status === 'pending' && (
                  <div className="mt-6 p-6 rounded-card bg-bg-secondary border border-border-primary">
                    <h4 className="text-sm font-semibold text-text-primary tracking-badge uppercase mb-3 flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-aqua opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-aqua"></span>
                      </span>
                      AI Suggested Answer
                    </h4>
                    <p className="text-text-secondary leading-relaxed text-base">{query.aiGeneratedAnswer}</p>
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
