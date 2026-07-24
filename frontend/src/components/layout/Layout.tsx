import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary font-sans selection:bg-brand-aqua-30 selection:text-text-primary">
      <Navbar />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
