import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Reusable inline error banner with retry recovery action.
 * Consistent across all Jayam VPMS data views.
 */
export const ErrorBanner = ({
  message = 'Unable to load data',
  detail,
  onRetry,
  className = '',
  compact = false,
}) => {
  const detailText = typeof detail === 'string' ? detail : detail?.message || null;

  return (
    <div
      role="alert"
      className={`p-4 bg-rose-50/90 border border-rose-200 rounded-xl text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm text-rose-950 leading-tight">{message}</p>
          {detailText && (
            <p className="text-rose-700 mt-1 leading-relaxed text-xs break-words">
              {detailText}
            </p>
          )}
        </div>
      </div>

      {onRetry && (
        <Button
          variant="secondary"
          size={compact ? 'xs' : 'sm'}
          icon={RefreshCw}
          onClick={onRetry}
          className="shrink-0 border-rose-300 bg-white hover:bg-rose-100/70 text-rose-900 font-semibold shadow-2xs self-start sm:self-center"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorBanner;
