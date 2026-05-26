import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import FAQPage from './pages/FAQPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import { useAuthStore } from './store/authStore';

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
