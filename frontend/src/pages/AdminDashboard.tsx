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
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform content and queued questions.</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 text-gray-600 transition-colors shadow-sm"
          title="Refresh Data"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-sky-500' : ''}`} />
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total FAQs" value={stats?.totalFaqs} color="text-sky-600" />
        <MetricCard title="Pending Questions" value={stats?.pendingQuestions} color="text-amber-600" />
        <MetricCard title="Helpful Votes" value={stats?.totalHelpfulVotes} color="text-emerald-600" />
        <MetricCard title="Unhelpful Votes" value={stats?.totalUnhelpfulVotes} color="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* FAQs Management Section */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage FAQs</h2>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create FAQ
            </button>
          </div>

          <div className="overflow-x-auto max-h-[600px] rounded-xl border border-white/40">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <tr className="border-b border-gray-300/50 text-gray-500 text-sm">
                  <th className="py-4 font-semibold px-4">Sec</th>
                  <th className="py-4 font-semibold px-4">Question</th>
                  <th className="py-4 font-semibold px-4 text-center">Status</th>
                  <th className="py-4 font-semibold px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 bg-white/20">
                {loading && faqs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">Loading FAQs...</td>
                  </tr>
                ) : faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-white/50 transition-colors group">
                    <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{faq.sectionNumber}.0</td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 font-medium line-clamp-1">{faq.question}</p>
                      <p className="text-gray-500 text-xs line-clamp-1 mt-1">{faq.section}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${faq.isPublished ? 'bg-emerald-100/80 text-emerald-700' : 'bg-gray-200/80 text-gray-600'}`}>
                        {faq.isPublished ? 'Pub' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(faq)}
                          className="p-2 rounded-lg bg-white/60 text-sky-700 hover:bg-sky-100 transition-colors border border-sky-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(faq._id)}
                          className="p-2 rounded-lg bg-white/60 text-rose-700 hover:bg-rose-100 transition-colors border border-rose-100"
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
        <div className="lg:col-span-1 p-8 rounded-3xl bg-gradient-to-b from-white/50 to-amber-50/30 backdrop-blur-xl border border-white/60 shadow-xl shadow-amber-100/20">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Pending Queue
            {pendingQuestions.length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs py-1 px-2.5 rounded-full font-bold">
                {pendingQuestions.length} New
              </span>
            )}
          </h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {pendingQuestions.length === 0 ? (
              <div className="text-center py-10 bg-white/30 rounded-2xl border border-white/50">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                <p className="text-gray-500 font-medium">All caught up!</p>
                <p className="text-xs text-gray-400 mt-1">No pending questions.</p>
              </div>
            ) : pendingQuestions.map(q => (
              <div key={q._id} className="p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-800 font-medium text-sm mb-4 leading-snug">{q.question}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveQuestion(q)}
                    className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1 border border-emerald-200"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => handleRejectQuestion(q._id)}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1 border border-rose-200"
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
      <div className="p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-indigo-100/50 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage AQs (Asked Questions)</h2>
        </div>

        <div className="overflow-x-auto max-h-[400px] rounded-xl border border-white/40">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <tr className="border-b border-gray-300/50 text-gray-500 text-sm">
                <th className="py-4 font-semibold px-4 w-24">Sec</th>
                <th className="py-4 font-semibold px-4">Question</th>
                <th className="py-4 font-semibold px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 bg-white/20">
              {loading && aqs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">Loading AQs...</td>
                </tr>
              ) : aqs.map((aq) => (
                <tr key={aq._id} className="hover:bg-white/50 transition-colors group">
                  <td className="py-4 px-4 font-medium text-gray-600">
                    {aq.sectionNumber}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-900 font-medium line-clamp-1">{aq.question}</p>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-1">{aq.section}</p>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => handlePromoteAQ(aq._id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider transition-colors border border-indigo-200 inline-flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Promote
                    </button>
                    <button 
                      onClick={() => handleDeleteAQ(aq._id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider transition-colors border border-rose-200 inline-flex items-center gap-1"
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
  <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-lg shadow-sky-100/30">
    <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
    <p className={`text-4xl font-extrabold mt-2 ${color}`}>
      {value !== undefined ? value : '--'}
    </p>
  </div>
);

export default AdminDashboard;
