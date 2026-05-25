import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-indigo-100/50 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Access</h2>
          <p className="text-gray-600 mt-2">Sign in to manage FAQs and approve questions.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-100/80 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800"
              placeholder="admin@vicharanashala.ai"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all text-gray-800"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-700 text-white font-semibold shadow-lg shadow-gray-200 hover:-translate-y-0.5 transition-all duration-300"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
