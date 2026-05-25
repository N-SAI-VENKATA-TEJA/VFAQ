const FAQPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">Find answers to common questions, or submit your own.</p>
      </div>

      <div className="w-full p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">FAQ content will load here</h2>
        <p className="text-gray-600">This is a stub for Task 6. Real data fetching will be implemented in the next task.</p>
      </div>
    </div>
  );
};

export default FAQPage;
