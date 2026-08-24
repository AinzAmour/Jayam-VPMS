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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/25 mb-4 border border-indigo-400/30">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Jayam VPMS</h2>
        <p className="mt-1 text-sm text-slate-400 font-medium">Visitor Pass & Facility Access Management</p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Sign in to your account</h3>
            <p className="text-xs text-slate-500 mt-1">Enter your organizational credentials to proceed</p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
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
              className="w-full mt-2 font-semibold shadow-md"
              icon={LogIn}
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick Demo Switcher</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Click any role pill to prefill test credentials:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@jayam.com')}
                className="flex items-center justify-between p-2 rounded-lg bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-left transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-rose-900">Administrator</p>
                  <p className="text-[10px] text-rose-700">admin@jayam.com</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('receptionist@jayam.com')}
                className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-left transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-indigo-900">Receptionist</p>
                  <p className="text-[10px] text-indigo-700">receptionist@jayam.com</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('david.chen@jayam.com')}
                className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-900">David (Engineering)</p>
                  <p className="text-[10px] text-emerald-700">david.chen@jayam.com</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ananya.sharma@jayam.com')}
                className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-emerald-900">Ananya (HR)</p>
                  <p className="text-[10px] text-emerald-700">ananya.sharma@jayam.com</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
