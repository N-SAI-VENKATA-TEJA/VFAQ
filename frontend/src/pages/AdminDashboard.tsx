import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Edit, Trash2, Plus, RefreshCcw } from 'lucide-react';
import FAQModal from '../components/admin/FAQModal';

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

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, faqsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/faqs')
      ]);
      setStats(statsRes.data);
      setFaqs(faqsRes.data);
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
      if (editingFaq) {
        await api.put(`/admin/faqs/${editingFaq._id}`, faqData);
      } else {
        await api.post('/admin/faqs', faqData);
      }
      fetchData();
    } catch (error: any) {
      console.error('Failed to save FAQ', error);
      alert(error.response?.data?.message || 'Error saving FAQ');
      throw error; // Rethrow to prevent modal close on error
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

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform content and queued questions.</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/60 text-gray-600 transition-colors"
          title="Refresh Data"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total FAQs" value={stats?.totalFaqs} color="text-sky-600" />
        <MetricCard title="Pending Questions" value={stats?.pendingQuestions} color="text-amber-600" />
        <MetricCard title="Helpful Votes" value={stats?.totalHelpfulVotes} color="text-emerald-600" />
        <MetricCard title="Unhelpful Votes" value={stats?.totalUnhelpfulVotes} color="text-rose-600" />
      </div>

      {/* FAQs Management Section */}
      <div className="w-full p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50 mt-8">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300/50 text-gray-500 text-sm">
                <th className="pb-3 font-medium px-4">Sec</th>
                <th className="pb-3 font-medium px-4">Question</th>
                <th className="pb-3 font-medium px-4 text-center">Status</th>
                <th className="pb-3 font-medium px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {loading && faqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">Loading FAQs...</td>
                </tr>
              ) : faqs.map((faq) => (
                <tr key={faq._id} className="hover:bg-white/40 transition-colors group">
                  <td className="py-4 px-4 text-gray-600 font-medium whitespace-nowrap">{faq.sectionNumber}.0</td>
                  <td className="py-4 px-4">
                    <p className="text-gray-900 font-medium line-clamp-1">{faq.question}</p>
                    <p className="text-gray-500 text-xs line-clamp-1 mt-1">{faq.section}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${faq.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                      {faq.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(faq)}
                        className="p-2 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(faq._id)}
                        className="p-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors"
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

      <FAQModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveFaq}
        faq={editingFaq}
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
