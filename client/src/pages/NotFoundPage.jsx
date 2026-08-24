import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleReturn = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role === 'ADMINISTRATOR') {
      navigate('/admin/dashboard');
    } else if (role === 'RECEPTIONIST') {
      navigate('/receptionist/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 — Page Not Found</h1>
      <p className="text-sm text-slate-600 max-w-md mt-2">
        The requested URL path does not exist on the Jayam Visitor Pass Management portal.
      </p>
      <div className="mt-6">
        <Button variant="primary" size="md" icon={ArrowLeft} onClick={handleReturn}>
          Back to Safety
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
