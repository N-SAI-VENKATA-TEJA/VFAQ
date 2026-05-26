import { Link } from 'react-router-dom';
import { Search, ArrowRight, MessageCircleQuestion } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in duration-700">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm mb-8">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
        <span className="text-sm font-medium text-sky-800">Applications open for Summer 2026</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 drop-shadow-sm">
        Vicharanashala <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-lavender-600">
          Internship FAQ
        </span>
      </h1>
      
      <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
        Your crowd-sourced guide to the Vicharanashala online internship at IIT Ropar. 
        Find answers to everything from selection to team formation.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-2xl">
        <Link 
          to="/faqs" 
          className="flex-1 inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-lg shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-1 transition-all duration-300"
        >
          <Search className="w-5 h-5" />
          Browse FAQs
        </Link>
        <Link 
          to="/aqs" 
          className="flex-1 inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-md border border-sky-200 text-sky-800 font-semibold text-lg shadow-sm hover:bg-sky-50 hover:-translate-y-1 transition-all duration-300"
        >
          <MessageCircleQuestion className="w-5 h-5 text-sky-600" />
          Browse AQs
        </Link>
        <Link 
          to="/my-queries" 
          className="flex-1 inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 text-gray-800 font-semibold text-lg hover:bg-white/70 hover:-translate-y-1 transition-all duration-300"
        >
          <MessageCircleQuestion className="w-5 h-5 text-indigo-600" />
          My Queries
        </Link>
      </div>
    </div>
  );
};

export default Home;
