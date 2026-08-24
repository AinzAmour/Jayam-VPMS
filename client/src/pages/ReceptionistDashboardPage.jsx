import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import visitorService from '../services/visitorService';
import { useToast } from '../context/ToastContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import PassSlipModal from '../components/PassSlipModal';
import AuditTimelineModal from '../components/AuditTimelineModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/Button';
import {
  Users,
  Building2,
  Clock,
  AlertCircle,
  UserPlus,
  LogIn,
  LogOut,
  Eye,
  History,
  Ban,
  Phone,
  Building,
} from 'lucide-react';

export const ReceptionistDashboardPage = () => {
  const [queueData, setQueueData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modals
  const [selectedPass, setSelectedPass] = useState(null);
  const [auditPass, setAuditPass] = useState(null);
  const [cancelPassTarget, setCancelPassTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadTodayQueue();
  }, []);

  const loadTodayQueue = async () => {
    setIsLoading(true);
    try {
      const res = await visitorService.getTodayQueue();
      setQueueData(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load lobby queue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (pass) => {
    setActionLoadingId(pass._id);
    try {
      await visitorService.checkIn(pass._id);
      toast.success(`Checked in ${pass.visitorName} successfully!`);
      loadTodayQueue();
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
      toast.success(`Checked out ${pass.visitorName}. Visit completed.`);
      loadTodayQueue();
    } catch (err) {
      toast.error(err.message || 'Check-out failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelPassTarget) return;
    setActionLoadingId(cancelPassTarget._id);
    try {
      await visitorService.cancel(cancelPassTarget._id, cancelReason || 'Cancelled at front desk');
      toast.success(`Visit pass for ${cancelPassTarget.visitorName} cancelled.`);
      setCancelPassTarget(null);
      setCancelReason('');
      loadTodayQueue();
    } catch (err) {
      toast.error(err.message || 'Cancellation failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Visitor Desk</h2>
          <p className="text-xs text-slate-500 mt-1">Today's arrivals, check-in queue, and visitor departures</p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={UserPlus}
          onClick={() => navigate('/receptionist/register')}
        >
          Register New Visitor
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Inside Now"
          value={queueData?.insideCount ?? 0}
          icon={Building2}
          variant="indigo"
          subtitle="Currently on site"
          isLoading={isLoading}
        />
        <MetricCard
          title="Today's Passes"
          value={queueData?.totalToday ?? 0}
          icon={Users}
          variant="slate"
          subtitle="Registered today"
          isLoading={isLoading}
        />
        <MetricCard
          title="Expected Today"
          value={queueData?.scheduledCount ?? 0}
          icon={Clock}
          variant="slate"
          subtitle="Scheduled arrivals"
          isLoading={isLoading}
        />
        <MetricCard
          title="Awaiting Approval"
          value={queueData?.pendingApprovalCount ?? 0}
          icon={AlertCircle}
          variant="amber"
          subtitle="Waiting for host review"
          isLoading={isLoading}
        />
      </div>

      {/* Today's Live Reception Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Visitor Queue</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Check in approved visitors on arrival and check them out on departure
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {queueData?.queue?.length || 0} visits today
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3.5">Pass ID</th>
                <th className="px-4 py-3.5">Visitor & Company</th>
                <th className="px-4 py-3.5">Host Staff</th>
                <th className="px-4 py-3.5">Expected Time</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Admission Action</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="h-4 bg-slate-200 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : !queueData?.queue?.length ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Users className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">No visitors in today's queue.</p>
                      <p className="text-xs text-slate-400 mt-1">Click "Register New Visitor" to create a visit pass.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                queueData.queue.map((pass) => {
                  const isOperating = actionLoadingId === pass._id;

                  return (
                    <tr key={pass._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-indigo-600">
                        {pass.passId}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-xs">{pass.visitorName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" /> {pass.visitorCompany}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {pass.visitorPhone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 text-xs">{pass.hostEmployeeId?.fullName}</div>
                        <div className="text-[11px] text-slate-500">{pass.hostEmployeeId?.department}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                        {pass.expectedArrivalTime}
                        {pass.checkInTime && (
                          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                            In: {new Date(pass.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={pass.status} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {pass.status === 'APPROVED' ? (
                          <Button
                            variant="checkin"
                            size="xs"
                            icon={LogIn}
                            onClick={() => handleCheckIn(pass)}
                            isLoading={isOperating}
                          >
                            Check In
                          </Button>
                        ) : pass.status === 'CHECKED_IN' ? (
                          <Button
                            variant="checkout"
                            size="xs"
                            icon={LogOut}
                            onClick={() => handleCheckOut(pass)}
                            isLoading={isOperating}
                          >
                            Check Out
                          </Button>
                        ) : pass.status === 'PENDING_APPROVAL' ? (
                          <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200">
                            Awaiting Host
                          </span>
                        ) : pass.status === 'REJECTED' ? (
                          <span className="text-[11px] text-rose-700 font-medium bg-rose-50 px-2 py-1 rounded border border-rose-200">
                            Host Denied
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Completed</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedPass(pass)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                            title="View / Print Pass Slip"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setAuditPass(pass)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                            title="View Audit History"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          {['PENDING_APPROVAL', 'APPROVED'].includes(pass.status) && (
                            <button
                              onClick={() => setCancelPassTarget(pass)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                              title="Cancel Visit"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PassSlipModal isOpen={!!selectedPass} onClose={() => setSelectedPass(null)} pass={selectedPass} />
      <AuditTimelineModal isOpen={!!auditPass} onClose={() => setAuditPass(null)} passRef={auditPass} />

      {/* Cancel Visit Dialog */}
      <ConfirmDialog
        isOpen={!!cancelPassTarget}
        onClose={() => setCancelPassTarget(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Visitor Pass"
        message={`Are you sure you want to cancel the visit for ${cancelPassTarget?.visitorName}?`}
        confirmText="Confirm Cancellation"
        variant="danger"
        isLoading={!!actionLoadingId}
      />
    </div>
  );
};

export default ReceptionistDashboardPage;
