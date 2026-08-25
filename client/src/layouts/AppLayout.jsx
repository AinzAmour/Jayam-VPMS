import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  History,
  UserPlus,
  ClipboardList,
  CheckSquare,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';
import Button from '../components/Button';
import NotificationPopover from '../components/NotificationPopover';
import StatefulButton from '../components/StatefulButton';
import CommandPalette from '../components/CommandPalette';
import { getNavItemsForRole } from '../config/navigation';
import { Search } from 'lucide-react';

const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
};

export const AppLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  const handleLogout = async () => {
    // Brief beat so the user sees the "Signing out…" feedback
    await new Promise((r) => setTimeout(r, 350));
  };

  const handleLogoutSuccess = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Nav links per role from single source of truth
  const navItems = getNavItemsForRole(role);

  const roleColors = {
    ADMINISTRATOR: 'bg-rose-100 text-rose-800 border-rose-200',
    RECEPTIONIST: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    EMPLOYEE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="h-screen flex bg-surface-bg overflow-hidden">
      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        setIsOpen={setCommandPaletteOpen}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 h-screen sticky top-0 bg-slate-900 border-r border-slate-800 text-slate-300 select-none shrink-0">
        {/* Brand Header */}
        <div className="h-14 flex items-center gap-3 px-5 bg-slate-950/70 border-b border-slate-800/80 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-sm leading-none">JAYAM VPMS</h1>
            <p className="text-[9px] text-slate-400 font-medium tracking-wider mt-1">VISITOR MANAGEMENT</p>
          </div>
        </div>

        {/* Role Badge Section */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
              {getInitials(user?.fullName)}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white text-xs truncate">{user?.fullName}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider mt-0.5 ${roleColors[role] || 'bg-slate-700 text-white'}`}>
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links with Animated Indicator */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto min-h-0">
          <div className="px-3 pb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {/* Animated active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-slate-800/50 rounded-lg"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }
                    }
                  />
                )}

                {/* Animated left accent bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-indigo-400 rounded-full"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }
                    }
                  />
                )}

                <Icon className="w-4 h-4 shrink-0 relative z-10" />
                <span className="truncate relative z-10">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
          <StatefulButton
            onClick={handleLogout}
            onSuccess={handleLogoutSuccess}
            idleIcon={LogOut}
            idleText="Sign Out"
            loadingText="Signing out…"
            successText="Signed out"
            variant="logout"
            size="sm"
            successDuration={400}
            className="w-full text-xs font-semibold"
          />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-full bg-slate-900 text-slate-300 z-10 shadow-2xl h-full">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-5 bg-slate-950 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-sm">JAYAM VPMS</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="p-4 border-b border-slate-800 shrink-0">
              <p className="font-semibold text-white text-sm">{user?.fullName}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider mt-1 ${roleColors[role]}`}>
                {role}
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'text-white font-semibold bg-slate-800/50'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-indigo-400 rounded-full" />
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-slate-800 shrink-0">
              <StatefulButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                onSuccess={handleLogoutSuccess}
                idleIcon={LogOut}
                idleText="Sign Out"
                loadingText="Signing out…"
                successText="Signed out"
                variant="logout"
                size="sm"
                successDuration={400}
                className="w-full text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Jayam VPMS</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="capitalize text-slate-700 font-semibold">{role?.toLowerCase()} Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Command Palette Trigger Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-700 transition-colors text-xs font-medium cursor-pointer"
              aria-label="Open command palette"
              title="Open Command Palette"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline text-slate-400">Search commands…</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded shadow-2xs text-slate-600">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>

            {role === 'RECEPTIONIST' && (
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => navigate('/receptionist/register')}
                className="hidden sm:inline-flex"
              >
                New Visitor
              </Button>
            )}

            {/* Notification Bell (Admin only — /api/activities is restricted to ADMINISTRATOR) */}
            {role === 'ADMINISTRATOR' && <NotificationPopover />}

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
                {getInitials(user?.fullName)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
