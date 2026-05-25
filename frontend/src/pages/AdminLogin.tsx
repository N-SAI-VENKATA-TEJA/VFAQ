const AdminLogin = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-indigo-100/50 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Access</h2>
          <p className="text-gray-600 mt-2">Sign in to manage FAQs and approve questions.</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full px-5 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              placeholder="admin@vicharanashala.ai"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 rounded-xl bg-white/60 border border-white/80 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="button"
            className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-lg shadow-gray-200 hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
