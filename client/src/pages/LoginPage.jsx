import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { ShieldCheck, Mail, Lock, LogIn, ArrowRight, User, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const loggedInUser = await login(email, password);
      toast.success(`Welcome back, ${loggedInUser.fullName}!`);

      // Determine redirect path
      const from = location.state?.from?.pathname;
      if (from && !from.includes('/login')) {
        navigate(from, { replace: true });
      } else if (loggedInUser.role === 'ADMINISTRATOR') {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedInUser.role === 'RECEPTIONIST') {
        navigate('/receptionist/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword = 'Password123!') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-900/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-4">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20 mb-2 border border-indigo-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Jayam VPMS</h2>
          <p className="text-xs text-slate-400 font-medium">Visitor Pass & Facility Access Management</p>
        </div>

        {/* Main Card */}
        <div className="bg-white py-6 px-5 sm:px-8 shadow-xl rounded-xl border border-slate-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Sign in</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enter your credentials to access the system</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-1 font-semibold"
              icon={LogIn}
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Discreet Demo Accounts Selector */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-medium text-slate-600">Quick demo fill:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@jayam.com')}
                className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('receptionist@jayam.com')}
                className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
              >
                Receptionist
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('david.chen@jayam.com')}
                className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
              >
                Host (David)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ananya.sharma@jayam.com')}
                className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
              >
                Host (Ananya)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
