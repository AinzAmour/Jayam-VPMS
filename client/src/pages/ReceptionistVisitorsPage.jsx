import React, { useState, useEffect } from 'react';
import visitorService from '../services/visitorService';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import PassSlipModal from '../components/PassSlipModal';
import AuditTimelineModal from '../components/AuditTimelineModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import {
  Search,
  Calendar,
  Eye,
  History,
  Ban,
  LogIn,
  LogOut,
  Building,
  Phone,
  Clock,
} from 'lucide-react';

export const ReceptionistVisitorsPage = () => {
  const [passes, setPasses] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [selectedPass, setSelectedPass] = useState(null);
  const [auditPass, setAuditPass] = useState(null);
  const [cancelPassTarget, setCancelPassTarget] = useState(null);

  const toast = useToast();

  useEffect(() => {
    loadPasses(1);
  }, [statusFilter, dateFilter]);

  const loadPasses = async (page = 1) => {
    setIsLoading(true);
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
    } catch (err) {
      toast.error(err.message || 'Failed to load visitor records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPasses(1);
  };

  const handleCheckIn = async (pass) => {
    setActionLoadingId(pass._id);
    try {
      await visitorService.checkIn(pass._id);
      toast.success(`Checked in ${pass.visitorName} successfully.`);
      loadPasses(pagination.currentPage);
    } catch (err) {
      toast.error(err.message || 'Check-in failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCheckOut = async (pass) => {
    setActionLoadingId(pass._id);
    try {
      await visitorService.checkOut(pass._id);
      toast.success(`Checked out ${pass.visitorName}.`);
      loadPasses(pagination.currentPage);
    } catch (err) {
      toast.error(err.message || 'Check-out failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelPass = async () => {
    if (!cancelPassTarget) return;
    setActionLoadingId(cancelPassTarget._id);
    try {
      await visitorService.cancel(cancelPassTarget._id, 'Cancelled by front desk');
      toast.success(`Visit pass for ${cancelPassTarget.visitorName} cancelled.`);
      setCancelPassTarget(null);
      loadPasses(pagination.currentPage);
    } catch (err) {
      toast.error(err.message || 'Cancellation failed.');
    } finally {
      setActionLoadingId(null);
    }
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
      header: 'Host Staff',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{row.hostEmployeeId?.fullName}</div>
          <div className="text-[11px] text-slate-500">{row.hostEmployeeId?.department}</div>
        </div>
      ),
    },
    {
      header: 'Schedule & Time',
      render: (row) => (
        <div className="text-xs">
          <div className="font-medium text-slate-900 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" /> {row.visitDate}
          </div>
          <div className="text-slate-500 flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" /> Arrival: {row.expectedArrivalTime}
          </div>
          {row.checkInTime && (
            <div className="text-[10px] text-emerald-700 font-semibold">
              In: {new Date(row.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      render: (row) => {
        const isOperating = actionLoadingId === row._id;

        return (
          <div className="flex items-center justify-end gap-1.5">
            {row.status === 'APPROVED' && (
              <Button
                variant="checkin"
                size="xs"
                icon={LogIn}
                onClick={() => handleCheckIn(row)}
                isLoading={isOperating}
              >
                Check In
              </Button>
            )}
            {row.status === 'CHECKED_IN' && (
              <Button
                variant="checkout"
                size="xs"
                icon={LogOut}
                onClick={() => handleCheckOut(row)}
                isLoading={isOperating}
              >
                Check Out
              </Button>
            )}

            <button
              onClick={() => setSelectedPass(row)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
              title="View / Print Pass Slip"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAuditPass(row)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
              title="View Audit Timeline"
            >
              <History className="w-4 h-4" />
            </button>

            {['PENDING_APPROVAL', 'APPROVED'].includes(row.status) && (
              <button
                onClick={() => setCancelPassTarget(row)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                title="Cancel Visit"
              >
                <Ban className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Visitor Records</h2>
          <p className="text-xs text-slate-500 mt-0.5">Search and filter visitor history and pass records</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex items-center gap-2">
          <Input
            placeholder="Search visitor, phone, company, pass ID..."
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
              placeholder="Filter Date"
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
                { value: 'CHECKED_IN', label: 'Checked In (Inside)' },
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={passes}
        isLoading={isLoading}
        emptyMessage="No visitor passes found matching your search filters."
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalRecords: pagination.totalRecords,
          onPageChange: (newPage) => loadPasses(newPage),
        }}
      />

      {/* Modals */}
      <PassSlipModal isOpen={!!selectedPass} onClose={() => setSelectedPass(null)} pass={selectedPass} />
      <AuditTimelineModal isOpen={!!auditPass} onClose={() => setAuditPass(null)} passRef={auditPass} />

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={!!cancelPassTarget}
        onClose={() => setCancelPassTarget(null)}
        onConfirm={handleCancelPass}
        title="Cancel Visitor Pass"
        message={`Are you sure you want to cancel the pass for ${cancelPassTarget?.visitorName}?`}
        confirmText="Confirm Cancellation"
        variant="danger"
        isLoading={!!actionLoadingId}
      />
    </div>
  );
};

export default ReceptionistVisitorsPage;
