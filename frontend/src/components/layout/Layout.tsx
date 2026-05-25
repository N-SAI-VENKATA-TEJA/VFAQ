import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e0f2fe] via-[#f3e8ff] to-[#ccfbf1] text-gray-800 font-sans selection:bg-sky-200 selection:text-sky-900">
      <Navbar />
      
      {/* Decorative blurred background blobs for extra glassmorphism effect */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="fixed top-40 right-10 w-72 h-72 bg-lavender-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="fixed -bottom-8 left-40 w-72 h-72 bg-mint-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
