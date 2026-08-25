import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import StatefulButton from '../components/StatefulButton';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const leftPanelRef = useRef(null);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Soft cursor spotlight on the desktop dark left panel
  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
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
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) btn.click();
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#0B1220] lg:bg-white overflow-x-hidden">
      {/* LEFT / TOP PANEL:
          - Desktop (lg+): Full-height (~46% width) edge-to-edge dark panel with vertical centering
          - Mobile / Tablet (<1024px): Compact top brand bar with crisp title */}
      <aside
        ref={leftPanelRef}
        onMouseMove={handleMouseMove}
        className="w-full lg:w-[46%] xl:w-[44%] bg-[#0B1220] border-b lg:border-b-0 lg:border-r border-slate-800/90 text-slate-100 py-4 px-5 sm:py-6 sm:px-8 lg:py-12 lg:px-12 xl:px-16 2xl:px-20 flex flex-col justify-between relative overflow-hidden select-none shrink-0"
      >
        {/* Soft Edge-to-Edge Cursor Spotlight (Desktop only) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 hidden lg:block"
          style={{
            background:
              'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.14), transparent 75%)',
          }}
        />

        {/* Top Wordmark */}
        <div className="flex items-center gap-2.5 z-20 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white block">JAYAM VPMS</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block lg:hidden">Visitor Pass Management</span>
          </div>
        </div>

        {/* Headline & Whitespace (Centered on Desktop) */}
        <div className="mt-2 mb-1 sm:mt-4 sm:mb-2 lg:my-auto py-1 sm:py-2 lg:py-8 space-y-1.5 sm:space-y-2.5 lg:space-y-4 z-20">
          <h1 className="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Visitor access, <br className="hidden sm:inline lg:inline" />
            <span className="text-indigo-400">handled seamlessly.</span>
          </h1>
          <p className="hidden lg:block text-xs sm:text-sm xl:text-base text-slate-400 font-normal leading-relaxed max-w-md">
            Streamlined check-ins, instant approvals, badge generation, and audit logging in one unified workplace platform.
          </p>
        </div>

        {/* Bottom Metadata Anchor (Desktop only) */}
        <div className="hidden lg:flex items-center justify-between text-[11px] text-slate-500 font-mono tracking-wider uppercase z-20 shrink-0">
          <span>Enterprise Access System</span>
          <span className="text-slate-600">v1.0.0</span>
        </div>
      </aside>

      {/* RIGHT / BOTTOM PANEL:
          Sign-in Form Canvas — Vertically Centered & fluidly scaled across all screen sizes */}
      <main className="w-full lg:w-[54%] xl:w-[56%] bg-white flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 md:px-12 lg:px-12 xl:px-16 2xl:px-24 flex-1 min-h-0 overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-2 sm:py-6">
          {/* Form Header */}
          <div className="mb-5 sm:mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign in
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Enter your corporate credentials to continue.
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

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors mr-2.5 shrink-0" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-transparent border-b border-slate-300 focus:border-indigo-600 focus:shadow-[0_2px_8px_-1px_rgba(99,102,241,0.25)] py-2 sm:py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-medium disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-b border-slate-300 focus:border-indigo-600 focus:shadow-[0_2px_8px_-1px_rgba(99,102,241,0.25)] py-2 sm:py-2.5 pr-8 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 font-medium disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 p-1 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
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
                className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-transform"
              />
            </div>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Quick demo accounts
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-click fill</span>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@jayam.com')}
                className="min-h-[46px] p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 active:scale-[0.98] transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Admin</p>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">Full</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">admin@jayam.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('receptionist@jayam.com')}
                className="min-h-[46px] p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 active:scale-[0.98] transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Receptionist</p>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">Front</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">receptionist@jayam.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('david.chen@jayam.com')}
                className="min-h-[46px] p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 active:scale-[0.98] transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Host (David)</p>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">Host</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">david.chen@jayam.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ananya.sharma@jayam.com')}
                className="min-h-[46px] p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-200 active:scale-[0.98] transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Host (Ananya)</p>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">HR</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">ananya.sharma@jayam.com</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
