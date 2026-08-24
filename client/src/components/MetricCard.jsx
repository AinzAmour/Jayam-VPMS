import React from 'react';

const variantMap = {
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600',
    border: 'hover:border-indigo-200',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600',
    border: 'hover:border-emerald-200',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600',
    border: 'hover:border-amber-200',
  },
  rose: {
    bg: 'bg-rose-50 text-rose-600',
    border: 'hover:border-rose-200',
  },
  slate: {
    bg: 'bg-slate-100 text-slate-600',
    border: 'hover:border-slate-300',
  },
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = 'indigo',
  isLoading = false,
  className = '',
  onClick,
}) => {
  const currentVariant = variantMap[variant] || variantMap.indigo;

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-8 bg-slate-200 rounded w-16 mt-3"></div>
        <div className="h-3 bg-slate-200 rounded w-32 mt-2"></div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${currentVariant.border} ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${currentVariant.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
