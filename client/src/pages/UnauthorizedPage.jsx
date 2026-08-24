import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleReturn = () => {
    if (role === 'ADMINISTRATOR') navigate('/admin/dashboard');
    else if (role === 'RECEPTIONIST') navigate('/receptionist/dashboard');
    else if (role === 'EMPLOYEE') navigate('/employee/dashboard');
    else navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">403 — Access Denied</h1>
      <p className="text-sm text-slate-600 max-w-md mt-2">
        You do not have permission to access this restricted page. Your assigned role (<span className="font-bold text-slate-800">{role || 'GUEST'}</span>) does not have sufficient clearance.
      </p>
      <div className="mt-6">
        <Button variant="primary" size="md" icon={ArrowLeft} onClick={handleReturn}>
          Return to Permitted Dashboard
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
