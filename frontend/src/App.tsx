import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import FAQPage from './pages/FAQPage';
import AuthPage from './pages/AuthPage';
import MyQueries from './pages/MyQueries';
import AdminDashboard from './pages/AdminDashboard';
import { useAuthStore } from './store/authStore';
import api from './api/axios';

// Protected Route for any authenticated user
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Protected Route strictly for Admins
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isInitializing, login, setInitialized } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        login(response.data);
      } catch (error) {
        // Not logged in or session expired
      } finally {
        setInitialized();
      }
    };

    checkAuth();
  }, [login, setInitialized]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#f3e8ff] to-[#ccfbf1]">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<AuthPage />} />
          
          <Route 
            index 
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            } 
          />
          <Route 
            path="faqs" 
            element={
              <RequireAuth>
                <FAQPage />
              </RequireAuth>
            } 
          />
          <Route 
            path="my-queries" 
            element={
              <RequireAuth>
                <MyQueries />
              </RequireAuth>
            } 
          />
          <Route 
            path="admin" 
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
