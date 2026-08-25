import React, { useState } from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';

/**
 * Accessible, High-Fidelity SVG Donut Chart for Pass Status Distribution
 * Real API data, semantic status colors, interactive hover states & responsive legend.
 */
export const PassStatusDonutChart = ({ statusBreakdown = {}, totalVisitors = 0, isLoading = false }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-6 py-6 animate-pulse">
        <div className="w-44 h-44 rounded-full bg-slate-100 shrink-0" />
        <div className="flex-1 w-full space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 bg-slate-100 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate semantic category counts from statusBreakdown
  const approvedCount =
    (statusBreakdown.APPROVED || 0) +
    (statusBreakdown.CHECKED_IN || 0) +
    (statusBreakdown.CHECKED_OUT || 0);
  const pendingCount = statusBreakdown.PENDING_APPROVAL || 0;
  const rejectedCount = statusBreakdown.REJECTED || 0;
  const cancelledCount = statusBreakdown.CANCELLED || 0;

  const total = totalVisitors;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
          <PieChartIcon className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-slate-700">No visitor activity in this period</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Adjust date filter above to view historical distributions</p>
      </div>
    );
  }

  const segments = [
    {
      id: 'APPROVED',
      label: 'Approved / Completed',
      shortLabel: 'Approved',
      count: approvedCount,
      color: '#10b981', // emerald-500
      hoverColor: '#059669', // emerald-600
    },
    {
      id: 'PENDING',
      label: 'Pending Review',
      shortLabel: 'Pending',
      count: pendingCount,
      color: '#f59e0b', // amber-500
      hoverColor: '#d97706', // amber-600
    },
    {
      id: 'REJECTED',
      label: 'Rejected by Host',
      shortLabel: 'Rejected',
      count: rejectedCount,
      color: '#f43f5e', // rose-500
      hoverColor: '#e11d48', // rose-600
    },
    {
      id: 'CANCELLED',
      label: 'Cancelled',
      shortLabel: 'Cancelled',
      count: cancelledCount,
      color: '#94a3b8', // slate-400
      hoverColor: '#64748b', // slate-500
    },
  ];

  // SVG Donut Math
  const radius = 68;
  const circumference = 2 * Math.PI * radius; // ~427.2566
  let accumulatedPercent = 0;

  const segmentData = segments.map((seg) => {
    const percent = total > 0 ? seg.count / total : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    return {
      ...seg,
      percent: percent * 100,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSegment = hoveredIndex !== null ? segmentData[hoveredIndex] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Donut Chart SVG */}
      <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full transform -rotate-90 select-none overflow-visible"
          role="img"
          aria-label={`Pass Status Distribution Donut Chart. Total: ${total} visitors.`}
        >
          {/* Subtle Background Ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="24"
          />

          {/* Data Segments */}
          {segmentData.map((seg, idx) => {
            if (seg.count === 0) return null;
            const isHovered = hoveredIndex === idx;

            return (
              <circle
                key={seg.id}
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={isHovered ? seg.hoverColor : seg.color}
                strokeWidth={isHovered ? 28 : 24}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-200 cursor-pointer outline-none"
                style={{
                  filter: isHovered ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'none',
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(idx)}
                onBlur={() => setHoveredIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`${seg.label}: ${seg.count} passes (${seg.percent.toFixed(1)}%)`}
              />
            );
          })}
        </svg>

        {/* Center Dynamic Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {activeSegment ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[110px]">
                {activeSegment.shortLabel}
              </span>
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {activeSegment.count}
              </span>
              <span className="text-[11px] font-bold text-indigo-600">
                {activeSegment.percent.toFixed(1)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                TOTAL
              </span>
              <span className="text-3xl font-extrabold text-slate-900 leading-none mt-0.5">
                {total}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-1">
                Visits
              </span>
            </>
          )}
        </div>
      </div>

      {/* Structured Legend Beside / Below */}
      <div className="flex-1 w-full space-y-1.5 min-w-0">
        {segmentData.map((seg, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={seg.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${seg.label}: ${seg.count} (${seg.percent.toFixed(1)}%)`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer border ${
                isHovered
                  ? 'bg-slate-100/90 border-slate-300 shadow-sm'
                  : 'bg-slate-50/50 border-transparent hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0 transition-transform"
                  style={{
                    backgroundColor: seg.color,
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
                <span className={`text-xs font-semibold truncate ${isHovered ? 'text-slate-900' : 'text-slate-700'}`}>
                  {seg.label}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3 text-right">
                <span className="text-xs font-bold text-slate-900">
                  {seg.count}
                </span>
                <span className="text-[11px] font-medium text-slate-500 w-12 text-right">
                  {seg.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PassStatusDonutChart;
