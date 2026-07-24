import { Link } from 'react-router-dom';
import { Search, MessageCircleQuestion, Zap, ShieldCheck, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-up">
      
      {/* 1 & 2. Hero Section */}
      <div className="relative -mt-10 pt-20 pb-32 flex flex-col items-center justify-center min-h-[85vh] text-center px-4 bg-hero-gradient rounded-[3rem] overflow-hidden shadow-card-inner w-full mb-16">
        
        {/* Floating decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-aqua-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-white border border-brand-gray-light shadow-sm mb-8">
            <span className="text-xs font-medium text-text-primary uppercase tracking-badge">Applications open for Summer 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tight-2xl text-text-primary mb-6 max-w-4xl">
            Vicharanashala <br />
            <span className="text-text-aqua">
              Internship FAQ
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg text-text-secondary mb-10 leading-relaxed">
            Your crowd-sourced guide to the Vicharanashala online internship at IIT Ropar. 
            Find answers to everything from selection to team formation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-2xl">
            <Link 
              to="/faqs" 
              className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-4 rounded-pill bg-bg-tertiary text-text-white font-medium text-base hover:scale-95 transition-transform duration-300 shadow-button-primary"
            >
              <Search className="w-5 h-5" />
              Browse FAQs
            </Link>
            <Link 
              to="/aqs" 
              className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-4 rounded-pill bg-brand-white text-text-primary font-medium text-base hover:scale-95 transition-transform duration-300 shadow-button-primary"
            >
              <MessageCircleQuestion className="w-5 h-5 text-brand-aqua" />
              Browse AQs
            </Link>
            <Link 
              to="/my-queries" 
              className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-4 rounded-pill bg-brand-white text-text-primary font-medium text-base hover:bg-bg-tertiary hover:text-text-white transition-colors duration-300 shadow-button-primary group"
            >
              <MessageCircleQuestion className="w-5 h-5 group-hover:text-text-white text-text-secondary transition-colors" />
              My Queries
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Social Proof Section */}
      <section className="w-full max-w-[65rem] py-4 px-4 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 opacity-90 hover:opacity-100 transition-opacity duration-500">
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <img src="/logos.png" alt="IIT Ropar" className="w-40 md:w-56 object-contain" />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-semibold tracking-tight text-text-primary mb-3">Vicharanashala Lab for Education Design</h3>
            <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
              An initiative of IIT Ropar dedicated to transforming educational experiences through technology, crowd-sourced knowledge, and innovative design.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="w-full max-w-[65rem] py-8 px-4 mb-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-medium tracking-tight-xl text-text-primary mb-4">Everything you need to succeed</h2>
          <p className="text-lg text-text-secondary">We've built a comprehensive knowledge base to answer all your internship queries.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon={<Search className="w-6 h-6 text-brand-aqua" />}
            title="Searchable FAQs"
            description="Instantly find official answers curated by the administration, organized perfectly by category."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-brand-aqua" />}
            title="Community Asked Questions (AQs)"
            description="Browse and learn from questions asked by other students. Upvote the ones you care about."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-brand-aqua" />}
            title="Verified Admin Moderation"
            description="Admins review all submitted queries to ensure you get accurate, high-quality answers."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-brand-aqua" />}
            title="AI-Powered Suggestions"
            description="Submit a query and immediately receive an AI-generated suggested answer while you wait for admin review."
          />
        </div>
      </section>
      
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-card bg-bg-secondary border border-border-primary shadow-card-inner hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-full bg-brand-white border border-brand-gray-light flex items-center justify-center shadow-sm mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-medium tracking-tight text-text-primary mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed">{description}</p>
  </div>
);

export default Home;
