import React, { useState, useEffect } from 'react';
import visitorService from '../services/visitorService';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import PassSlipModal from '../components/PassSlipModal';
import AuditTimelineModal from '../components/AuditTimelineModal';
import ErrorBanner from '../components/ErrorBanner';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { Search, Calendar, Eye, History, Building, Phone } from 'lucide-react';

export const EmployeeHistoryPage = () => {
  const [passes, setPasses] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [selectedPass, setSelectedPass] = useState(null);
  const [auditPass, setAuditPass] = useState(null);

  const toast = useToast();

  useEffect(() => {
    loadMyHistory(1);
  }, [statusFilter, dateFilter]);

  const loadMyHistory = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 15,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        date: dateFilter ? dateFilter : undefined,
        search: searchTerm.trim() ? searchTerm.trim() : undefined,
      };
      const res = await visitorService.getAll(params);
      setPasses(res.data?.records || []);
      setPagination(res.data?.pagination || { currentPage: 1, totalPages: 1, totalRecords: 0 });
      setError(null);
    } catch (err) {
      const errMsg = err.message || 'Failed to load visit history.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMyHistory(1);
  };

  const columns = [
    {
      header: 'Pass ID',
      accessor: 'passId',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
          {row.passId}
        </span>
      ),
    },
    {
      header: 'Visitor Details',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900 text-xs">{row.visitorName}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Building className="w-3 h-3 text-slate-400" /> {row.visitorCompany}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400" /> {row.visitorPhone}
          </div>
        </div>
      ),
    },
    {
      header: 'Visit Date & Time',
      render: (row) => (
        <div className="text-xs">
          <div className="font-medium text-slate-900 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" /> {row.visitDate}
          </div>
          <div className="text-slate-500 text-[11px]">Arrival: {row.expectedArrivalTime}</div>
        </div>
      ),
    },
    {
      header: 'Purpose / Remarks',
      render: (row) => (
        <div className="text-xs max-w-xs">
          <div className="text-slate-800 font-medium truncate">{row.purpose}</div>
          {row.hostRemarks && (
            <div className="text-slate-500 text-[11px] italic mt-0.5 truncate">
              "{row.hostRemarks}"
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setSelectedPass(row)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
            title="View Pass Slip"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAuditPass(row)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
            title="View Audit Timeline"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Visit History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Log of all visitor requests and visits hosted by you</p>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <ErrorBanner
          message="Unable to load visit history"
          detail={error}
          onRetry={() => loadMyHistory(pagination.currentPage || 1)}
        />
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex items-center gap-2">
          <Input
            placeholder="Search visitor, phone, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-40">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'CHECKED_IN', label: 'Inside Premises' },
                { value: 'CHECKED_OUT', label: 'Checked Out' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
          </div>

          {(searchTerm || dateFilter || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setDateFilter('');
                setStatusFilter('ALL');
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={passes}
        isLoading={isLoading}
        emptyMessage="You have not hosted any visitors matching your filters."
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalRecords: pagination.totalRecords,
          onPageChange: (newPage) => loadMyHistory(newPage),
        }}
      />

      {/* Modals */}
      <PassSlipModal isOpen={!!selectedPass} onClose={() => setSelectedPass(null)} pass={selectedPass} />
      <AuditTimelineModal isOpen={!!auditPass} onClose={() => setAuditPass(null)} passRef={auditPass} />
    </div>
  );
};

export default EmployeeHistoryPage;
