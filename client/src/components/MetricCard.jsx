import React, { useState, useEffect, useRef } from 'react';

const variantMap = {
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600',
    border: 'hover:border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600',
    border: 'hover:border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-700',
    border: 'hover:border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  rose: {
    bg: 'bg-rose-50 text-rose-600',
    border: 'hover:border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  slate: {
    bg: 'bg-slate-100 text-slate-600',
    border: 'hover:border-slate-300',
    iconBg: 'bg-slate-100 text-slate-600',
  },
};

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

// Subtle count-up hook that animates only on mount or when value changes
const useCountUp = (targetValue, duration = 400) => {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const prevValueRef = useRef(targetValue);
  const isInitialMount = useRef(true);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof targetValue !== 'number' || prefersReduced) {
      setDisplayValue(targetValue);
      prevValueRef.current = targetValue;
      return;
    }

    const startVal = isInitialMount.current ? 0 : prevValueRef.current ?? 0;
    isInitialMount.current = false;
    const endVal = targetValue;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    let startTime = null;
    let animationFrameId;

    const easeOutQuad = (t) => t * (2 - t);

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = Math.round(startVal + (endVal - startVal) * easedProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        prevValueRef.current = endVal;
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration, prefersReduced]);

  return typeof targetValue === 'number' ? displayValue : targetValue;
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
  isPriority = false,
}) => {
  const currentVariant = variantMap[variant] || variantMap.indigo;
  const animatedValue = useCountUp(value);

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
      className={`bg-white rounded-xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isPriority ? 'border-amber-300 ring-1 ring-amber-200/60' : 'border-slate-200'
      } ${onClick ? 'cursor-pointer' : ''} ${currentVariant.border} ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className={`text-2xl font-bold tracking-tight ${isPriority && (value > 0) ? 'text-amber-900' : 'text-slate-900'}`}>
          {animatedValue}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
