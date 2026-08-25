import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

/**
 * Accessible, High-Fidelity SVG Vertical Bar Chart for Department Visitor Traffic
 * Real API data, sorted descending, numeric Y-axis grid, hover tooltips & responsive layout.
 */
export const DepartmentBarChart = ({ departments = [], totalVisitors = 0, isLoading = false }) => {
  const [hoveredDept, setHoveredDept] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-4 py-4 animate-pulse">
        <div className="h-44 bg-slate-100 rounded-xl w-full" />
        <div className="flex justify-between gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-slate-100 rounded w-16" />
          ))}
        </div>
      </div>
    );
  }

  // Filter out departments with 0 if any, and sort descending
  const sortedDepts = [...departments]
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  if (sortedDepts.length === 0 || totalVisitors === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
          <Building2 className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-slate-700">No department visit records found</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Visits in the selected date range will appear grouped by host department</p>
      </div>
    );
  }

  // Calculate nice Y-Axis scale
  const rawMax = Math.max(...sortedDepts.map((d) => d.count), 1);
  let yMax = 5;
  let ticks = [0, 1, 2, 3, 4, 5];

  if (rawMax <= 5) {
    yMax = 5;
    ticks = [0, 1, 2, 3, 4, 5];
  } else if (rawMax <= 10) {
    yMax = 10;
    ticks = [0, 2, 4, 6, 8, 10];
  } else if (rawMax <= 20) {
    yMax = 20;
    ticks = [0, 5, 10, 15, 20];
  } else {
    const step = Math.ceil(rawMax / 4 / 5) * 5;
    yMax = step * 4;
    ticks = [0, step, step * 2, step * 3, step * 4];
  }

  // Chart coordinate math
  const chartWidth = Math.max(480, sortedDepts.length * 75);
  const chartHeight = 220;
  const paddingLeft = 42;
  const paddingRight = 24;
  const paddingTop = 26;
  const paddingBottom = 48;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const slotWidth = plotWidth / sortedDepts.length;
  const barWidth = Math.min(42, Math.max(22, slotWidth * 0.5));

  return (
    <div className="space-y-2">
      {/* Active Selection Tooltip / Summary Pill */}
      <div className="h-6 flex items-center justify-between text-xs px-1">
        {hoveredDept ? (
          <div className="flex items-center gap-2 animate-fadeIn">
            <span className="font-bold text-slate-900">{hoveredDept.department}:</span>
            <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {hoveredDept.count} {hoveredDept.count === 1 ? 'visit' : 'visits'}
            </span>
            <span className="text-slate-500 font-medium">
              ({totalVisitors > 0 ? ((hoveredDept.count / totalVisitors) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        ) : (
          <span className="text-slate-400 font-medium text-[11px]">
            Hover over any bar to view department traffic breakdown
          </span>
        )}
      </div>

      {/* Responsive Horizontal Scroll Container if many departments */}
      <div className="w-full overflow-x-auto pb-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[340px] select-none overflow-visible"
          style={{ maxHeight: '240px' }}
          role="img"
          aria-label="Department Visitor Traffic Bar Chart"
        >
          {/* Horizontal Gridlines & Y-Axis Labels */}
          {ticks.map((tick) => {
            const yPos = paddingTop + plotHeight - (tick / yMax) * plotHeight;

            return (
              <g key={tick} className="text-slate-400">
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={chartWidth - paddingRight}
                  y2={yPos}
                  stroke="#e2e8f0"
                  strokeDasharray={tick === 0 ? 'none' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={yPos + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  fill="#94a3b8"
                  className="font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Department Bars */}
          {sortedDepts.map((d, idx) => {
            const isHovered = hoveredDept?.department === d.department;
            const barHeight = Math.max(4, (d.count / yMax) * plotHeight);
            const xCenter = paddingLeft + idx * slotWidth + slotWidth / 2;
            const barX = xCenter - barWidth / 2;
            const barY = paddingTop + plotHeight - barHeight;

            const percent = totalVisitors > 0 ? ((d.count / totalVisitors) * 100).toFixed(1) : 0;
            const truncatedName =
              d.department.length > 12 ? `${d.department.substring(0, 11)}…` : d.department;

            return (
              <g
                key={d.department}
                className="cursor-pointer transition-all outline-none"
                onMouseEnter={() => setHoveredDept(d)}
                onMouseLeave={() => setHoveredDept(null)}
                onFocus={() => setHoveredDept(d)}
                onBlur={() => setHoveredDept(null)}
                tabIndex={0}
                role="button"
                aria-label={`${d.department}: ${d.count} visitors (${percent}%)`}
              >
                {/* Invisible wider hit area for easy hover on touch / pointer */}
                <rect
                  x={paddingLeft + idx * slotWidth}
                  y={paddingTop}
                  width={slotWidth}
                  height={plotHeight + paddingBottom}
                  fill="transparent"
                />

                {/* The Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="5"
                  fill={isHovered ? '#3730a3' : '#4f46e5'}
                  className="transition-all duration-150"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(79, 70, 229, 0.35))' : 'none',
                  }}
                />

                {/* Count Badge Above Bar */}
                <text
                  x={xCenter}
                  y={barY - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={isHovered ? '#3730a3' : '#1e293b'}
                  className="transition-colors"
                >
                  {d.count}
                </text>

                {/* Department Label Below Bar */}
                <text
                  x={xCenter}
                  y={paddingTop + plotHeight + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isHovered ? '#0f172a' : '#475569'}
                  className="transition-colors"
                >
                  {truncatedName}
                  <title>{d.department}</title>
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default DepartmentBarChart;
