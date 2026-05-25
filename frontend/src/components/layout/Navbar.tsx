import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/40 border-b border-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-sky-400 to-lavender-500 p-2 rounded-xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-indigo-700">
                Vicharanashala FAQ
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">Home</Link>
            <Link to="/faqs" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">FAQs</Link>
            
            {isAuthenticated && user?.role === 'admin' ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/60">
                <Link to="/admin" className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-medium transition-colors">
                  <Settings className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/80 text-gray-700 hover:text-red-600 border border-white/60 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors ml-4">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
