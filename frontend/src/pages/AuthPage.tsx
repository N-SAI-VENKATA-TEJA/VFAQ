import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/ui/Logo';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, password });
        const userData = response.data;
        
        // Validation: Prevent normal users from logging in via Admin tab, and vice versa
        if (activeTab === 'admin' && userData.role !== 'admin') {
          throw new Error("Unauthorized access. Admin privileges required.");
        }
        if (activeTab === 'student' && userData.role === 'admin') {
          throw new Error("Please use the Admin tab to log in to your administrator account.");
        }
        
        login(userData);
        
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        if (activeTab === 'admin') {
          throw new Error("Admins cannot be registered here.");
        }
        const response = await api.post('/auth/register', { name, email, password });
        login(response.data);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center py-12 px-4 relative">
      {/* Brand Header */}
      <div className="w-full max-w-[65rem] mb-6 flex items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-aqua-20 text-brand-aqua flex items-center justify-center p-1 overflow-hidden">
          <Logo className="w-full h-full" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight-xl text-text-primary">Vicharanashala FAQ Portal</h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[65rem] rounded-[2rem] bg-brand-white border border-border-primary shadow-card-inner flex flex-col md:flex-row overflow-hidden animate-fade-up">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-center items-center md:w-5/12 p-12 bg-brand-aqua text-brand-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-aqua to-sky-600 opacity-90 z-0"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-brand-white rounded-full flex items-center justify-center mb-8 shadow-xl p-2 overflow-hidden">
               <Logo className="w-full h-full" />
             </div>
             <h2 className="text-4xl font-medium tracking-tight-xl mb-4 leading-tight text-brand-white">Vicharanashala<br/>Knowledge Base</h2>
             <p className="text-brand-white/80 text-lg">Discover, ask, and learn from the community's questions.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-14 bg-brand-white flex flex-col justify-center">
          
          {/* Tabs */}
          <div className="flex p-1.5 rounded-pill bg-bg-secondary border border-border-primary mb-10 w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold rounded-pill transition-all ${
                activeTab === 'student' 
                  ? 'bg-brand-aqua text-brand-white shadow-button-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold rounded-pill transition-all ${
                activeTab === 'admin' 
                  ? 'bg-brand-aqua text-brand-white shadow-button-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-medium tracking-tight-xl text-text-primary">
              {activeTab === 'admin' ? 'Admin Login' : (isLogin ? 'Student Login' : 'Create Student Account')}
            </h2>
            <p className="text-text-secondary mt-2">
              {activeTab === 'admin' 
                ? 'Sign in to access the admin dashboard.' 
                : (isLogin ? 'Sign in to access FAQs.' : 'Sign up to ask questions and explore.')}
            </p>
          </div>
          
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-5 max-w-md mx-auto w-full" onSubmit={handleAuth}>
            {!isLogin && activeTab === 'student' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary ml-4">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full px-6 py-4 min-h-[4rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A]"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary ml-4">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-6 py-4 min-h-[4rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A]"
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary ml-4">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-6 py-4 min-h-[4rem] rounded-pill bg-brand-white border border-brand-gray-light shadow-input-inner focus:outline-none focus:border-border-secondary transition-colors text-text-primary text-base placeholder-[#8C8C9A]"
                placeholder="••••••••"
              />
            </div>
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 rounded-[0.75rem] bg-bg-tertiary hover:bg-[#353539] disabled:bg-brand-gray-light disabled:text-text-tertiary text-brand-white font-semibold transition-colors duration-200 shadow-button-primary"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-brand-white/30 border-t-brand-white rounded-full animate-spin"></div>
                ) : (
                  isLogin ? 'Login' : 'Sign Up'
                )}
              </button>
            </div>
          </form>

          {activeTab === 'student' && (
            <div className="mt-8 text-center text-sm font-medium text-text-secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-text-aqua hover:underline transition-all"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
