import React, { useState, useEffect } from 'react';
import activityService from '../services/activityService';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import ErrorBanner from '../components/ErrorBanner';
import Input from '../components/Input';
import Select from '../components/Select';
import { History, Search, Clock, User, ShieldCheck } from 'lucide-react';

const actionBadgeStyles = {
  CREATED: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  APPROVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
  CHECKED_IN: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  CHECKED_OUT: 'bg-slate-100 text-slate-700 border-slate-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const AdminAuditLogsPage = () => {
  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();

  useEffect(() => {
    loadActivities(1);
  }, [actionFilter]);

  const loadActivities = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await activityService.getAll({
        page,
        limit: 15,
        action: actionFilter !== 'ALL' ? actionFilter : undefined,
        search: searchTerm.trim() ? searchTerm.trim() : undefined,
      });
      setActivities(res.data?.records || []);
      setPagination(res.data?.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0 });
      setError(null);
    } catch (err) {
      const errMsg = err.message || 'Failed to load audit logs.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadActivities(1);
  };

  const columns = [
    {
      header: 'Timestamp',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{new Date(row.timestamp).toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: 'Pass ID',
      accessor: 'passId',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100">
          {row.passId}
        </span>
      ),
    },
    {
      header: 'Lifecycle Action',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
            actionBadgeStyles[row.action] || 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.action}
        </span>
      ),
    },
    {
      header: 'Actor (User & Role)',
      render: (row) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-900 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            {row.performedByName}
          </div>
          <div className="text-slate-400 text-[11px] uppercase tracking-wider">{row.performedByRole}</div>
        </div>
      ),
    },
    {
      header: 'Audit Remarks / Details',
      render: (row) => (
        <div className="text-xs text-slate-700 max-w-md truncate">
          {row.remarks || <span className="text-slate-400 italic">No notes</span>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Audit Trail</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of visitor pass registrations, approvals, check-ins, and departures
          </p>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <ErrorBanner
          message="Unable to load audit logs"
          detail={error}
          onRetry={() => loadActivities(pagination.currentPage || 1)}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-80 flex items-center gap-2">
          <Input
            placeholder="Search by Pass ID, Actor, Notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </form>
        <div className="w-full sm:w-60">
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Lifecycle Actions' },
              { value: 'CREATED', label: 'Pass Created' },
              { value: 'APPROVED', label: 'Host Approved' },
              { value: 'REJECTED', label: 'Host Rejected' },
              { value: 'CHECKED_IN', label: 'Admitted (Checked In)' },
              { value: 'CHECKED_OUT', label: 'Exited (Checked Out)' },
              { value: 'CANCELLED', label: 'Visit Cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={activities}
        isLoading={isLoading}
        emptyMessage="No audit activities matching current filters."
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalRecords: pagination.totalRecords,
          onPageChange: (newPage) => loadActivities(newPage),
        }}
      />
    </div>
  );
};

export default AdminAuditLogsPage;
