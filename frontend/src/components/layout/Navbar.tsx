import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, LogOut, Settings, User } from 'lucide-react';
import api from '../../api/axios';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    }
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/40 border-b border-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left Side: Navigation Links (Only if logged in) */}
          <div className="flex-1 flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link to="/" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">Home</Link>
                <Link to="/faqs" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">FAQs</Link>
                <Link to="/aqs" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">AQs</Link>
              </>
            )}
          </div>

          {/* Center: Brand Title (Always visible & absolutely centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-sky-400 to-lavender-500 p-2 rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-indigo-700">
                Vicharanashala FAQ
              </span>
            </Link>
          </div>
          
          {/* Right Side: Auth controls */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white/50 px-3 py-1.5 rounded-full border border-white/60">
                  <User className="w-4 h-4 text-sky-600" />
                  {user?.name}
                </div>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-medium transition-colors">
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/80 text-gray-700 hover:text-red-600 border border-white/60 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
