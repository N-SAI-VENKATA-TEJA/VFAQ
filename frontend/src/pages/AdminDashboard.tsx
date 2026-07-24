import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Edit, Trash2, Plus, RefreshCcw, Check, X as XIcon } from 'lucide-react';
import FAQModal from '../components/admin/FAQModal';
import ApproveQuestionModal from '../components/admin/ApproveQuestionModal';

interface Stats {
  totalFaqs: number;
  pendingQuestions: number;
  totalHelpfulVotes: number;
  totalUnhelpfulVotes: number;
}

interface FAQ {
  _id: string;
  section: string;
  sectionNumber: number;
  question: string;
  answer: string;
  isPublished: boolean;
}

interface PendingQuestion {
  _id: string;
  question: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [aqs, setAqs] = useState<any[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedApproveQuestion, setSelectedApproveQuestion] = useState<PendingQuestion | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, faqsRes, aqsRes, questionsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/faqs'),
        api.get('/aqs'),
        api.get('/admin/questions?status=pending')
      ]);
      setStats(statsRes.data);
      setFaqs(faqsRes.data);
      setAqs(aqsRes.data);
      setPendingQuestions(questionsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete FAQ', error);
      alert('Error deleting FAQ');
    }
  };

  const handleSaveFaq = async (faqData: Partial<FAQ>) => {
    try {
      if (editingFaq && editingFaq._id) {
        await api.put(`/admin/faqs/${editingFaq._id}`, faqData);
      } else {
        await api.post('/admin/faqs', faqData);
      }
      fetchData();
    } catch (error: any) {
      console.error('Failed to save FAQ', error);
      alert(error.response?.data?.message || 'Error saving FAQ');
      throw error;
    }
  };

  const openCreateModal = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleApproveQuestion = (question: PendingQuestion) => {
    setSelectedApproveQuestion(question);
    setIsApproveModalOpen(true);
  };

  const submitApproveQuestion = async (id: string, data: any) => {
    try {
      await api.patch(`/admin/questions/${id}`, { 
        status: 'approved',
        ...data 
      });
      setIsApproveModalOpen(false);
      setSelectedApproveQuestion(null);
      fetchData();
    } catch (error) {
      console.error('Failed to approve question', error);
      alert('Failed to approve question');
    }
  };

  const handleRejectQuestion = async (id: string) => {
    if (!window.confirm('Reject and delete this question?')) return;
    try {
      await api.patch(`/admin/questions/${id}`, { status: 'rejected' });
      fetchData();
    } catch (error) {
      console.error('Failed to reject question', error);
    }
  };

  const handlePromoteAQ = async (id: string) => {
    if (!window.confirm('Promote this AQ to an official FAQ?')) return;
    try {
      await api.post(`/aqs/${id}/promote`);
      alert('Promoted to FAQ successfully!');
      fetchData();
    } catch (error) {
      console.error('Failed to promote AQ', error);
      alert('Error promoting AQ');
    }
  };

  const handleDeleteAQ = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this AQ?')) return;
    try {
      await api.delete(`/aqs/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete AQ', error);
      alert('Error deleting AQ');
    }
  };

  return (
    <div className="w-full max-w-[87rem] mx-auto space-y-12 animate-fade-up pb-16 pt-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-medium tracking-tight-xl text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-2 text-lg">Manage platform content and queued questions.</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-3 rounded-full bg-brand-white border border-brand-gray-light text-text-secondary hover:text-text-primary transition-colors shadow-button-primary hover:scale-95 transition-transform"
          title="Refresh Data"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-brand-aqua' : ''}`} />
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <MetricCard title="Total FAQs" value={stats?.totalFaqs} color="text-brand-aqua" />
        <MetricCard title="Pending Questions" value={stats?.pendingQuestions} color="text-text-primary" />
        <MetricCard title="Helpful Votes" value={stats?.totalHelpfulVotes} color="text-brand-aqua" />
        <MetricCard title="Unhelpful Votes" value={stats?.totalUnhelpfulVotes} color="text-text-tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* FAQs Management Section */}
        <div className="lg:col-span-2 p-10 rounded-card bg-bg-secondary border border-border-primary shadow-card-inner">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-medium tracking-tight-xl text-text-primary">Manage FAQs</h2>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-brand-aqua text-brand-white rounded-pill font-medium transition-transform shadow-button-primary hover:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create FAQ
            </button>
          </div>

          <div className="overflow-x-auto max-h-[600px] rounded-[1rem] border border-brand-gray-light bg-brand-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-brand-white z-10 shadow-sm">
                <tr className="border-b border-border-primary text-text-tertiary text-sm">
                  <th className="py-5 font-medium px-6">Sec</th>
                  <th className="py-5 font-medium px-6">Question</th>
                  <th className="py-5 font-medium px-6 text-center">Status</th>
                  <th className="py-5 font-medium px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {loading && faqs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-tertiary">Loading FAQs...</td>
                  </tr>
                ) : faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-brand-neutral-lighter transition-colors group">
                    <td className="py-4 px-6 text-text-secondary font-medium whitespace-nowrap">{faq.sectionNumber}.0</td>
                    <td className="py-4 px-6">
                      <p className="text-text-primary font-medium line-clamp-1">{faq.question}</p>
                      <p className="text-text-tertiary text-xs line-clamp-1 mt-1">{faq.section}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1.5 rounded-pill text-[10px] font-semibold tracking-badge uppercase border ${faq.isPublished ? 'bg-brand-aqua-20 text-brand-aqua border-brand-aqua-50' : 'bg-brand-gray-light text-text-secondary border-border-primary'}`}>
                        {faq.isPublished ? 'Pub' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(faq)}
                          className="p-2 rounded-lg bg-brand-white text-text-aqua hover:bg-brand-neutral-lighter transition-colors border border-brand-gray-light shadow-sm"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(faq._id)}
                          className="p-2 rounded-lg bg-brand-white text-[#E53935] hover:bg-[#ffebee] transition-colors border border-brand-gray-light shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Questions Section */}
        <div className="lg:col-span-1 p-10 rounded-card bg-bg-secondary border border-border-primary shadow-card-inner">
          <h2 className="text-2xl font-medium tracking-tight-xl text-text-primary mb-8 flex items-center gap-3">
            Pending Queue
            {pendingQuestions.length > 0 && (
              <span className="bg-bg-tertiary text-brand-white text-[10px] py-1 px-3 rounded-pill font-semibold tracking-badge uppercase">
                {pendingQuestions.length} New
              </span>
            )}
          </h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {pendingQuestions.length === 0 ? (
              <div className="text-center py-12 bg-brand-white rounded-[1.5rem] border border-border-primary shadow-sm">
                <Check className="w-10 h-10 text-brand-aqua mx-auto mb-3 opacity-50" />
                <p className="text-text-secondary font-medium">All caught up!</p>
                <p className="text-sm text-text-tertiary mt-1">No pending questions.</p>
              </div>
            ) : pendingQuestions.map(q => (
              <div key={q._id} className="p-5 bg-brand-white rounded-[1rem] border border-brand-gray-light shadow-sm hover:shadow-md transition-shadow">
                <p className="text-text-primary font-medium text-sm mb-5 leading-relaxed">{q.question}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleApproveQuestion(q)}
                    className="flex-1 py-2.5 bg-brand-aqua text-brand-white text-xs font-semibold tracking-badge uppercase rounded-pill transition-transform hover:scale-95 flex items-center justify-center gap-1.5 shadow-button-primary"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleRejectQuestion(q._id)}
                    className="flex-1 py-2.5 bg-brand-white hover:bg-brand-neutral-lighter text-text-primary text-xs font-semibold tracking-badge uppercase rounded-pill transition-transform hover:scale-95 flex items-center justify-center gap-1.5 border border-brand-gray-light shadow-button-primary"
                  >
                    <XIcon className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manage AQs Section */}
      <div className="p-10 rounded-card bg-bg-secondary border border-border-primary shadow-card-inner mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-medium tracking-tight-xl text-text-primary">Manage AQs (Asked Questions)</h2>
        </div>

        <div className="overflow-x-auto max-h-[400px] rounded-[1rem] border border-brand-gray-light bg-brand-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-brand-white z-10 shadow-sm">
              <tr className="border-b border-border-primary text-text-tertiary text-sm">
                <th className="py-5 font-medium px-6 w-24">Sec</th>
                <th className="py-5 font-medium px-6">Question</th>
                <th className="py-5 font-medium px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {loading && aqs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-text-tertiary">Loading AQs...</td>
                </tr>
              ) : aqs.map((aq) => (
                <tr key={aq._id} className="hover:bg-brand-neutral-lighter transition-colors group">
                  <td className="py-4 px-6 font-medium text-text-secondary">
                    {aq.sectionNumber}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-text-primary font-medium line-clamp-1">{aq.question}</p>
                    <p className="text-text-tertiary text-xs line-clamp-1 mt-1">{aq.section}</p>
                  </td>
                  <td className="py-4 px-6 text-right space-x-3 whitespace-nowrap">
                    <button 
                      onClick={() => handlePromoteAQ(aq._id)}
                      className="px-4 py-2 rounded-pill bg-brand-aqua text-brand-white text-xs font-semibold uppercase tracking-badge transition-transform hover:scale-95 shadow-button-primary inline-flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Promote
                    </button>
                    <button 
                      onClick={() => handleDeleteAQ(aq._id)}
                      className="px-4 py-2 rounded-pill bg-brand-white hover:bg-[#ffebee] text-[#E53935] text-xs font-semibold uppercase tracking-badge transition-transform hover:scale-95 border border-brand-gray-light shadow-button-primary inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FAQModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveFaq}
        faq={editingFaq}
      />

      <ApproveQuestionModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedApproveQuestion(null);
        }}
        onApprove={submitApproveQuestion}
        question={selectedApproveQuestion}
      />
    </div>
  );
};

const MetricCard = ({ title, value, color }: { title: string, value?: number, color: string }) => (
  <div className="p-8 rounded-card bg-bg-secondary border border-border-primary shadow-card-inner">
    <h3 className="text-text-secondary font-semibold text-xs tracking-badge uppercase">{title}</h3>
    <p className={`text-5xl font-medium mt-4 tracking-tight-xl ${color}`}>
      {value !== undefined ? value : '--'}
    </p>
  </div>
);

export default AdminDashboard;
