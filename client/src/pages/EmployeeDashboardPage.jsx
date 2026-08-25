import React, { useState, useEffect } from 'react';
import visitorService from '../services/visitorService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import TextArea from '../components/TextArea';
import PassSlipModal from '../components/PassSlipModal';
import AuditTimelineModal from '../components/AuditTimelineModal';
import ErrorBanner from '../components/ErrorBanner';
import Button from '../components/Button';
import {
  CheckSquare,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Building,
  Phone,
  FileText,
  Eye,
  History,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const EmployeeDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Review Modal state (Approve / Reject)
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVE');
  const [hostRemarks, setHostRemarks] = useState('');
  const [remarksError, setRemarksError] = useState('');

  // Pass preview & audit modals
  const [selectedPass, setSelectedPass] = useState(null);
  const [auditPass, setAuditPass] = useState(null);

  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await visitorService.getEmployeeDashboardStats();
      setDashboardData(res.data);
      setError(null);
    } catch (err) {
      const errMsg = err.message || 'Failed to load employee dashboard.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReview = (pass, action) => {
    setReviewTarget(pass);
    setReviewAction(action);
    setHostRemarks(action === 'APPROVE' ? 'Approved. Please escort guest upon arrival.' : '');
    setRemarksError('');
  };

  const handleConfirmReview = async (e) => {
    e.preventDefault();
    if (reviewAction === 'REJECT' && (!hostRemarks || !hostRemarks.trim())) {
      setRemarksError('Please provide explanatory remarks for rejecting this visit request.');
      return;
    }

    setActionLoading(true);
    try {
      await visitorService.updateStatus(reviewTarget._id, reviewAction, hostRemarks);
      toast.success(
        reviewAction === 'APPROVE'
          ? `Approved visitor request for ${reviewTarget.visitorName}`
          : `Rejected visitor request for ${reviewTarget.visitorName}`
      );
      setReviewTarget(null);
      setHostRemarks('');
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update visitor status.');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = dashboardData?.pendingCount || 0;
  const isLimitReached = pendingCount >= 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Pending Requests {user?.fullName ? `— ${user.fullName}` : ''}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming visit requests assigned to you and track today's scheduled guests
          </p>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <ErrorBanner
          message="Unable to load employee dashboard"
          detail={error}
          onRetry={loadDashboardData}
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Pending Requests"
          value={`${pendingCount} / 3`}
          icon={CheckSquare}
          variant={isLimitReached ? 'rose' : pendingCount > 0 ? 'amber' : 'slate'}
          subtitle={isLimitReached ? 'Pending limit reached (3)' : 'Awaiting your review'}
          isLoading={isLoading}
        />
        <MetricCard
          title="Today's Approved Visits"
          value={dashboardData?.todayApprovedVisits?.length ?? 0}
          icon={Clock}
          variant="indigo"
          subtitle="Expected or on site today"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Guests Hosted"
          value={dashboardData?.totalHostedCount ?? 0}
          icon={UserCheck}
          variant="slate"
          subtitle="Completed past visits"
          isLoading={isLoading}
        />
      </div>

      {/* Alert Banner if at limit */}
      {isLimitReached && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Notice: You have reached the maximum of 3 pending requests</p>
            <p className="mt-0.5 text-rose-700">
              New visitor requests cannot be routed to you until pending requests below are approved or rejected.
            </p>
          </div>
        </div>
      )}

      {/* Pending Requests Review Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pending Requests</h3>
            <p className="text-xs text-slate-500 mt-0.5">Review and approve or reject visitor access</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            {pendingCount} pending
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !dashboardData?.pendingRequests?.length ? (
          <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">All caught up</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You have no pending visitor requests awaiting review. New requests from reception will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dashboardData.pendingRequests.map((pass) => (
              <div
                key={pass._id}
                className="p-5 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-sm"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded border border-indigo-200">
                      {pass.passId}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{pass.visitorName}</h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" /> {pass.visitorCompany}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Date: <strong>{pass.visitDate}</strong> at{' '}
                      <strong>{pass.expectedArrivalTime}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {pass.visitorPhone}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200/70 text-xs text-slate-700 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Purpose:</strong> {pass.purpose}</span>
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <Button
                    variant="success"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={() => handleOpenReview(pass, 'APPROVE')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() => handleOpenReview(pass, 'REJECT')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Scheduled Visits for this Employee */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Today's Scheduled & Inside Visitors</h3>
        <p className="text-xs text-slate-500 mb-4">Guests approved by you scheduled for admission today</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">Pass ID</th>
                <th className="px-4 py-3">Visitor Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Expected Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!dashboardData?.todayApprovedVisits?.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No approved visitors scheduled for today.
                  </td>
                </tr>
              ) : (
                dashboardData.todayApprovedVisits.map((pass) => (
                  <tr key={pass._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-indigo-600">{pass.passId}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 text-xs">{pass.visitorName}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{pass.visitorCompany}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{pass.expectedArrivalTime}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={pass.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedPass(pass)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                          title="View Pass Slip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAuditPass(pass)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          title="View Audit Timeline"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal (Approve / Reject) */}
      <Modal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        title={reviewAction === 'APPROVE' ? 'Approve Visitor Pass' : 'Reject Visitor Pass'}
        subtitle={`Request for ${reviewTarget?.visitorName} (${reviewTarget?.visitorCompany})`}
      >
        <form onSubmit={handleConfirmReview} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <p><strong>Scheduled Arrival:</strong> {reviewTarget?.visitDate} at {reviewTarget?.expectedArrivalTime}</p>
            <p><strong>Purpose:</strong> {reviewTarget?.purpose}</p>
          </div>

          <TextArea
            label={reviewAction === 'APPROVE' ? 'Host Remarks / Instructions (Optional)' : 'Rejection Reason (Required)'}
            placeholder={
              reviewAction === 'APPROVE'
                ? 'e.g. Approved. Please ask visitor to wait in Lobby 3.'
                : 'e.g. Host unavailable; meeting rescheduled.'
            }
            value={hostRemarks}
            onChange={(e) => {
              setHostRemarks(e.target.value);
              setRemarksError('');
            }}
            error={remarksError}
            required={reviewAction === 'REJECT'}
          />

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setReviewTarget(null)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={reviewAction === 'APPROVE' ? 'success' : 'danger'}
              size="sm"
              isLoading={actionLoading}
            >
              {reviewAction === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modals */}
      <PassSlipModal isOpen={!!selectedPass} onClose={() => setSelectedPass(null)} pass={selectedPass} />
      <AuditTimelineModal isOpen={!!auditPass} onClose={() => setAuditPass(null)} passRef={auditPass} />
    </div>
  );
};

export default EmployeeDashboardPage;
