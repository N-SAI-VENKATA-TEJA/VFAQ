const AdminDashboard = () => {
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform content and queued questions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50">
            <h3 className="text-gray-500 font-medium">Metric {i}</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">--</p>
          </div>
        ))}
      </div>

      <div className="w-full p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-sky-100/50 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Management</h2>
        <p className="text-gray-600">This is a stub for Task 6. Real admin views will be built later.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
