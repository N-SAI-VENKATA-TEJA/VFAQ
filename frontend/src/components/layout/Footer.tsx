const Footer = () => {
  return (
    <footer className="mt-auto backdrop-blur-lg bg-white/30 border-t border-white/60 py-8 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600 font-medium">
          &copy; {new Date().getFullYear()} Vicharanashala, IIT Ropar. All rights reserved.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Crowd-sourced learning and internship platform.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
