import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  History,
  UserPlus,
  ClipboardList,
  CheckSquare,
} from 'lucide-react';

/**
 * Single source of truth for application navigation and role accessibility.
 * Reused by both Sidebar (AppLayout) and Command Palette.
 */
export const NAVIGATION_CONFIG = {
  ADMINISTRATOR: [
    {
      to: '/admin/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      cmdkIcon: 'HomeIcon',
      keywords: ['home', 'dashboard', 'metrics', 'kpi', 'statistics', 'overview'],
    },
    {
      to: '/admin/employees',
      label: 'Staff Directory',
      icon: Users,
      cmdkIcon: 'UsersIcon',
      keywords: ['employees', 'staff', 'departments', 'directory', 'hosts', 'team'],
    },
    {
      to: '/admin/users',
      label: 'User Accounts',
      icon: UserCheck,
      cmdkIcon: 'UserGroupIcon',
      keywords: ['users', 'roles', 'accounts', 'authentication', 'security', 'logins'],
    },
    {
      to: '/admin/reports',
      label: 'Visitor Reports',
      icon: BarChart3,
      cmdkIcon: 'ChartBarIcon',
      keywords: ['reports', 'analytics', 'charts', 'summary', 'csv', 'export', 'print'],
    },
    {
      to: '/admin/audit-logs',
      label: 'Audit Trail',
      icon: History,
      cmdkIcon: 'ClockIcon',
      keywords: ['audit', 'logs', 'activity', 'security', 'trail', 'timeline'],
    },
  ],
  RECEPTIONIST: [
    {
      to: '/receptionist/dashboard',
      label: 'Visitor Desk',
      icon: LayoutDashboard,
      cmdkIcon: 'HomeIcon',
      keywords: ['desk', 'dashboard', 'check-in', 'check-out', 'active visitors', 'today'],
    },
    {
      to: '/receptionist/register',
      label: 'Register Visitor',
      icon: UserPlus,
      cmdkIcon: 'PlusCircleIcon',
      keywords: ['register', 'new visitor', 'pass', 'form', 'entry', 'walk-in'],
    },
    {
      to: '/receptionist/visitors',
      label: 'Visitor Records',
      icon: ClipboardList,
      cmdkIcon: 'ClipboardDocumentListIcon',
      keywords: ['records', 'passes', 'history', 'all visitors', 'table', 'search'],
    },
  ],
  EMPLOYEE: [
    {
      to: '/employee/dashboard',
      label: 'Pending Requests',
      icon: CheckSquare,
      cmdkIcon: 'CheckCircleIcon',
      keywords: ['requests', 'approvals', 'pending', 'dashboard', 'review', 'reject', 'approve'],
    },
    {
      to: '/employee/history',
      label: 'Visit History',
      icon: History,
      cmdkIcon: 'ClockIcon',
      keywords: ['history', 'completed', 'past visitors', 'approved', 'archive'],
    },
  ],
};

/**
 * Quick actions per role
 */
export const QUICK_ACTIONS_CONFIG = {
  ADMINISTRATOR: [
    {
      id: 'action-view-reports',
      label: 'Generate & View Reports',
      to: '/admin/reports',
      icon: BarChart3,
      cmdkIcon: 'ChartBarIcon',
      keywords: ['reports', 'export', 'download', 'analytics'],
    },
    {
      id: 'action-staff-directory',
      label: 'Manage Staff Directory',
      to: '/admin/employees',
      icon: Users,
      cmdkIcon: 'UsersIcon',
      keywords: ['staff', 'add employee', 'directory'],
    },
    {
      id: 'action-audit-trail',
      label: 'Review Audit Logs',
      to: '/admin/audit-logs',
      icon: History,
      cmdkIcon: 'ClockIcon',
      keywords: ['security', 'audit', 'logs', 'history'],
    },
  ],
  RECEPTIONIST: [
    {
      id: 'action-register-visitor',
      label: 'Register New Visitor',
      to: '/receptionist/register',
      icon: UserPlus,
      cmdkIcon: 'PlusCircleIcon',
      keywords: ['new visitor', 'register', 'pass creation', 'check in'],
    },
    {
      id: 'action-view-records',
      label: 'Search Visitor Records',
      to: '/receptionist/visitors',
      icon: ClipboardList,
      cmdkIcon: 'ClipboardDocumentListIcon',
      keywords: ['find visitor', 'records', 'passes', 'search'],
    },
  ],
  EMPLOYEE: [
    {
      id: 'action-pending-approvals',
      label: 'Review Pending Approvals',
      to: '/employee/dashboard',
      icon: CheckSquare,
      cmdkIcon: 'CheckCircleIcon',
      keywords: ['approve', 'reject', 'pending requests', 'host review'],
    },
    {
      id: 'action-visit-history',
      label: 'View Host Visit History',
      to: '/employee/history',
      icon: History,
      cmdkIcon: 'ClockIcon',
      keywords: ['my visitors', 'history', 'past logs'],
    },
  ],
};

export const getNavItemsForRole = (role) => {
  return NAVIGATION_CONFIG[role] || [];
};

export const getQuickActionsForRole = (role) => {
  return QUICK_ACTIONS_CONFIG[role] || [];
};
