import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import StatefulButton from '../components/StatefulButton';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const leftPanelRef = useRef(null);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Soft cursor spotlight on the desktop dark left panel
  const handleMouseMove = (e) => {
    if (window.innerWidth < 900) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const panel = leftPanelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    panel.style.setProperty('--mouse-x', `${x}px`);
    panel.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      throw new Error('Please enter both email address and password.');
    }

    setErrorMessage('');

    try {
      const loggedInUser = await login(email, password);
      toast.success(`Welcome back, ${loggedInUser.fullName}!`);
      return loggedInUser;
    } catch (err) {
      setErrorMessage(err.message || 'Failed to authenticate. Please check your credentials.');
      throw err;
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
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
  };

  const handleQuickLogin = (demoEmail, demoPassword = 'Password123!') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Find the StatefulButton's underlying <button> and click it to trigger its state machine
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) btn.click();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0B1220] lg:bg-white overflow-x-hidden">
      {/* LEFT / TOP PANEL:
          Desktop: Full-height (~48% width) edge-to-edge dark panel with generous vertical centering.
          Mobile (<900px): Compact top header band displaying wordmark & headline with zero dead whitespace. */}
      <aside
        ref={leftPanelRef}
        onMouseMove={handleMouseMove}
        className="w-full lg:w-[48%] bg-[#0B1220] border-b lg:border-b-0 lg:border-r border-slate-800/90 text-slate-100 py-6 px-6 sm:px-8 lg:py-12 lg:px-14 xl:px-20 flex flex-col justify-between relative overflow-hidden select-none shrink-0"
      >
        {/* Soft Edge-to-Edge Cursor Spotlight (Desktop only) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 hidden lg:block"
          style={{
            background:
              'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.12), transparent 75%)',
          }}
        />

        {/* Top Wordmark (Understated, non-hero) */}
        <div className="flex items-center gap-2.5 z-20 shrink-0">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight text-white">JAYAM VPMS</span>
        </div>

        {/* Headline & Whitespace (Vertically Centered across all desktop heights) */}
        <div className="mt-3 mb-1 sm:mt-4 sm:mb-2 lg:my-auto py-2 lg:py-8 space-y-2 lg:space-y-3.5 z-20">
          <h1 className="text-xl sm:text-2xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug lg:leading-tight">
            Visitor access, <br className="hidden sm:inline lg:inline" />
            <span className="text-indigo-400">handled.</span>
          </h1>
          <p className="hidden lg:block text-sm text-slate-400 font-normal leading-relaxed max-w-sm">
            Approvals, check-ins, and audit logs in one place.
          </p>
        </div>

        {/* Bottom Metadata Anchor (Desktop only) */}
        <div className="hidden lg:block text-[11px] text-slate-500 font-mono tracking-wider uppercase z-20 shrink-0">
          Facility Access System
        </div>
      </aside>

      {/* RIGHT / BOTTOM PANEL:
          Sign-in Form Canvas — Vertically Centered across all screen heights (short tablets, tall phones, laptops) */}
      <main className="w-full lg:w-[52%] bg-white flex flex-col justify-center p-6 sm:p-10 lg:p-14 xl:p-20 flex-1 min-h-0 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto my-auto py-2 sm:py-4">
          {/* Header */}
          <div className="mb-6 sm:mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sign in
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Enter your credentials to continue.
            </p>
          </div>

          {/* Inline Error State */}
          {errorMessage && (
            <div
              className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 animate-login-entrance"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <p className="text-xs font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Login Form with Underline-Only Inputs */}
          <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Email address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors mr-2.5 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-transparent border-b border-slate-300 focus:border-indigo-600 focus:shadow-[0_2px_8px_-1px_rgba(99,102,241,0.25)] py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-medium disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors mr-2.5 shrink-0" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-b border-slate-300 focus:border-indigo-600 focus:shadow-[0_2px_8px_-1px_rgba(99,102,241,0.25)] py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-medium disabled:opacity-60"
                />
              </div>
            </div>

            {/* Sign In — StatefulButton (loading → success → redirect, or error shake) */}
            <StatefulButton
              type="submit"
              onClick={handleLogin}
              onSuccess={handleLoginSuccess}
              idleIcon={LogIn}
              idleText="Sign In"
              loadingText="Signing in…"
              successText="Signed in"
              successDuration={450}
              variant="primary"
              size="md"
              className="w-full mt-3 h-10 font-semibold shadow-md shadow-indigo-600/20"
            />
          </form>

          {/* Quick Demo Fill Buttons (Minimalist Grayscale) */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick demo fill
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-click</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@jayam.com')}
                className="p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-slate-800">Admin</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">admin@jayam.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('receptionist@jayam.com')}
                className="p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-slate-800">Receptionist</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">receptionist@jayam.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('david.chen@jayam.com')}
                className="p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-slate-800">Host (David)</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">david.chen@jayam.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ananya.sharma@jayam.com')}
                className="p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
              >
                <p className="text-xs font-semibold text-slate-800">Host (Ananya)</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">ananya.sharma@jayam.com</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
