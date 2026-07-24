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
    <nav className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-[58rem] mx-auto bg-bg-tertiary text-text-white rounded-pill px-4 py-2 flex items-center justify-between shadow-button-primary">
        
        {/* Left Side: Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity px-3 py-2">Home</Link>
              <Link to="/faqs" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity px-3 py-2">FAQs</Link>
              <Link to="/aqs" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity px-3 py-2">AQs</Link>
            </>
          ) : (
            <Link to="/" className="flex items-center gap-2 group px-2">
              <div className="bg-bg-aqua p-1.5 rounded-full">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <span className="font-semibold tracking-tight">V FAQ</span>
            </Link>
          )}
        </div>

        {/* Center: Brand Title (If logged in) */}
        {isAuthenticated && (
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-bg-aqua p-1.5 rounded-full group-hover:scale-105 transition-transform">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <span className="font-semibold tracking-tight">V FAQ</span>
            </Link>
          </div>
        )}
        
        {/* Right Side: Auth controls */}
        <div className="flex items-center justify-end gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-1.5 text-xs font-medium bg-brand-neutral-dark px-3 py-1.5 rounded-pill border border-brand-black-light">
                <User className="w-3.5 h-3.5 text-brand-aqua" />
                {user?.name}
              </div>
              
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity px-2 flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="bg-brand-white text-text-primary px-4 py-2 rounded-pill text-sm font-medium hover:scale-95 transition-transform flex items-center gap-1.5 shadow-button-primary"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-brand-white text-text-primary px-5 py-2 rounded-pill text-sm font-medium hover:scale-95 transition-transform shadow-button-primary">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
