import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

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

export const BootScreen = () => {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1220] flex flex-col items-center justify-center select-none"
      role="status"
      aria-label="Loading Jayam VPMS"
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {/* Brand Icon with subtle pulse */}
        <motion.div
          animate={
            prefersReduced
              ? {}
              : {
                  scale: [1, 1.04, 1],
                  opacity: [0.9, 1, 0.9],
                }
          }
          transition={
            prefersReduced
              ? { duration: 0 }
              : {
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }
          }
          className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 mb-3.5"
        >
          <ShieldCheck className="w-6 h-6" />
        </motion.div>

        {/* Wordmark */}
        <h1 className="text-sm font-bold text-white tracking-tight leading-none">
          JAYAM VPMS
        </h1>
        <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
          Visitor Management System
        </p>

        {/* Indeterminate Loading Bar */}
        <div className="w-28 h-0.5 bg-slate-800 rounded-full overflow-hidden mt-5 relative">
          {prefersReduced ? (
            <div className="w-1/2 h-full bg-indigo-500 rounded-full mx-auto" />
          ) : (
            <motion.div
              className="h-full w-1/3 bg-indigo-500 rounded-full"
              animate={{
                x: ['-100%', '300%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BootScreen;
