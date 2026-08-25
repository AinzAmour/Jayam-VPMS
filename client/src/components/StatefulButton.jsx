import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';

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

/**
 * StatefulButton — reusable async-action button with loading → success/error feedback.
 *
 * Props:
 *  - onClick        (required) — sync or async (Promise-returning) handler
 *  - onSuccess      (optional) — called after success display completes
 *  - onError        (optional) — called with error after error display completes
 *  - children       — idle label (fallback if idleText not provided)
 *  - idleText       — explicit idle label
 *  - loadingText    — label during loading (default: same as idle)
 *  - successText    — label during success (default: 'Done')
 *  - idleIcon       — Lucide icon component for idle state
 *  - successIcon    — Lucide icon component for success state (default: Check)
 *  - variant        — matches Button.jsx variants
 *  - size           — matches Button.jsx sizes
 *  - successDuration — ms to hold success state (default: 500)
 *  - disabled       — external disable
 *  - type           — button type attribute
 *  - className      — additional classes
 */
export const StatefulButton = ({
  onClick,
  onSuccess,
  onError,
  children,
  idleText,
  loadingText,
  successText = 'Done',
  idleIcon: IdleIcon,
  successIcon: SuccessIcon = Check,
  variant = 'primary',
  size = 'md',
  successDuration = 500,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  // State machine: 'idle' | 'loading' | 'success' | 'error'
  const [state, setState] = useState('idle');
  const [isShaking, setIsShaking] = useState(false);
  const mountedRef = useRef(true);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const label = idleText || children;

  const handleClick = useCallback(
    async (e) => {
      if (state === 'loading' || state === 'success') return;

      setState('loading');

      try {
        const result = await Promise.resolve(onClick(e));

        if (!mountedRef.current) return;
        setState('success');

        setTimeout(() => {
          if (!mountedRef.current) return;
          setState('idle');
          onSuccess?.(result);
        }, successDuration);
      } catch (err) {
        if (!mountedRef.current) return;
        setState('error');
        setIsShaking(true);

        setTimeout(() => {
          if (!mountedRef.current) return;
          setIsShaking(false);
          setState('idle');
          onError?.(err);
        }, 400);
      }
    },
    [onClick, onSuccess, onError, state, successDuration]
  );

  // Style tokens (matching Button.jsx)
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500 active:bg-indigo-800',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 active:bg-emerald-800',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500 active:bg-rose-800',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-slate-400 active:bg-slate-100',
    outline:
      'bg-transparent hover:bg-indigo-50 text-indigo-600 border border-indigo-300 focus:ring-indigo-400',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-300',
    logout:
      'bg-transparent text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 focus:ring-rose-500 active:bg-rose-600/30',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 gap-1',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const currentVariant =
    state === 'success'
      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 focus:ring-emerald-500'
      : variants[variant] || variants.primary;

  const motionProps = prefersReduced
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 4, filter: 'blur(2px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -4, filter: 'blur(2px)' },
        transition: { duration: 0.15, ease: 'easeOut' },
      };

  return (
    <div className={isShaking && !prefersReduced ? 'animate-btn-shake' : ''}>
      <button
        type={type}
        disabled={disabled || state === 'loading' || state === 'success'}
        onClick={handleClick}
        className={`${baseStyles} ${currentVariant} ${sizes[size] || sizes.md} ${className}`}
        {...props}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === 'loading' && (
            <motion.span key="loading" className="inline-flex items-center gap-2" {...motionProps}>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{loadingText || label}</span>
            </motion.span>
          )}

          {state === 'success' && (
            <motion.span key="success" className="inline-flex items-center gap-2" {...motionProps}>
              <SuccessIcon className="w-4 h-4 shrink-0" />
              <span>{successText}</span>
            </motion.span>
          )}

          {(state === 'idle' || state === 'error') && (
            <motion.span key="idle" className="inline-flex items-center gap-2" {...motionProps}>
              {IdleIcon && <IdleIcon className="w-4 h-4 shrink-0" />}
              <span>{label}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default StatefulButton;
