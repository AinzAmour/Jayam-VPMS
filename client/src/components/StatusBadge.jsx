import React from 'react';

const statusConfigs = {
  PENDING_APPROVAL: {
    label: 'Pending Approval',
    bg: 'bg-amber-50 border-amber-200 text-amber-800',
    dot: 'bg-amber-500',
  },
  APPROVED: {
    label: 'Approved',
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    dot: 'bg-emerald-500',
  },
  CHECKED_IN: {
    label: 'Inside (Checked In)',
    bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    dot: 'bg-indigo-600 animate-pulse',
  },
  CHECKED_OUT: {
    label: 'Checked Out',
    bg: 'bg-slate-100 border-slate-200 text-slate-700',
    dot: 'bg-slate-400',
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-50 border-rose-200 text-rose-800',
    dot: 'bg-rose-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-gray-100 border-gray-200 text-gray-600',
    dot: 'bg-gray-400',
  },
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = statusConfigs[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 border-slate-200 text-slate-700',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
