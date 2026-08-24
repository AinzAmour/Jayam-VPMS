import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
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

export const AppLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build navigation items based on role
  let navItems = [];
  if (role === 'ADMINISTRATOR') {
    navItems = [
      { to: '/admin/dashboard', label: 'Workplace Overview', icon: LayoutDashboard },
      { to: '/admin/employees', label: 'Staff Directory', icon: Users },
      { to: '/admin/users', label: 'User Accounts', icon: UserCheck },
      { to: '/admin/reports', label: 'Visitor Reports', icon: BarChart3 },
      { to: '/admin/audit-logs', label: 'Audit Trail', icon: History },
    ];
  } else if (role === 'RECEPTIONIST') {
    navItems = [
      { to: '/receptionist/dashboard', label: 'Lobby Operations', icon: LayoutDashboard },
      { to: '/receptionist/register', label: 'Register Visitor', icon: UserPlus },
      { to: '/receptionist/visitors', label: 'Visitor Records', icon: ClipboardList },
    ];
  } else if (role === 'EMPLOYEE') {
    navItems = [
      { to: '/employee/dashboard', label: 'Pending Approvals', icon: CheckSquare },
      { to: '/employee/history', label: 'My Host History', icon: History },
    ];
  }

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
    <div className="min-h-screen flex bg-surface-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 bg-slate-950/70 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-base leading-none">JAYAM VPMS</h1>
            <p className="text-[10px] text-indigo-400 font-semibold tracking-wider mt-1">ACCESS OPERATIONS</p>
          </div>
        </div>

        {/* Role Badge Section */}
        <div className="px-5 py-4 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 font-bold flex items-center justify-center text-sm shrink-0">
              {getInitials(user?.fullName)}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white text-sm truncate">{user?.fullName}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider mt-1 ${roleColors[role] || 'bg-slate-700 text-white'}`}>
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: active }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 rounded-xl transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-full bg-slate-900 text-slate-300 z-10 shadow-2xl">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-base">JAYAM VPMS</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="p-4 border-b border-slate-800">
              <p className="font-semibold text-white text-sm">{user?.fullName}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider mt-1 ${roleColors[role]}`}>
                {role}
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-400 border border-rose-500/30 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
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
              <span>Headquarters Lobby</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="capitalize text-slate-700 font-semibold">{role?.toLowerCase()} Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
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
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
