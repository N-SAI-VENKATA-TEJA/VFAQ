import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full mt-8 border-t border-border-primary bg-bg-primary pt-10 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[65rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
        
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 group mb-6">
            <div className="bg-bg-aqua p-1.5 rounded-full">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="font-semibold tracking-tight text-text-primary">V FAQ</span>
          </Link>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            The official crowd-sourced knowledge base for the Vicharanashala online internship program at IIT Ropar.
          </p>
          <div className="flex items-center gap-4 text-text-tertiary">
            <a href="#" className="text-sm hover:text-text-primary transition-colors">Twitter</a>
            <a href="#" className="text-sm hover:text-text-primary transition-colors">GitHub</a>
            <a href="#" className="text-sm hover:text-text-primary transition-colors">LinkedIn</a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-badge uppercase text-text-primary mb-6">Resources</h4>
          <ul className="space-y-4">
            <li><Link to="/faqs" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">Official FAQs</Link></li>
            <li><Link to="/aqs" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">Community AQs</Link></li>
            <li><Link to="/my-queries" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">Submit a Query</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-badge uppercase text-text-primary mb-6">Program</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">About IIT Ropar</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">VLED Labs</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">Internship Details</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-badge uppercase text-text-primary mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-sm text-text-secondary hover:text-text-aqua transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-[65rem] mx-auto pt-0 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-text-tertiary">
          © {new Date().getFullYear()} Vicharanashala Lab for Education Design. All rights reserved.
        </p>
        <p className="text-xs text-text-tertiary flex items-center gap-1">
          Made with <span className="text-red-500">♥</span> for the student community.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
