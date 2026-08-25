import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  Printer,
  History,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  Ban,
  ShieldAlert,
  AlertCircle,
  FilePlus,
  ArrowRight,
} from 'lucide-react';
import visitorService from '../services/visitorService';
import { useToast } from '../context/ToastContext';
import StatusBadge from './StatusBadge';
import StatefulButton from './StatefulButton';
import Button from './Button';

const actionIconMap = {
  CREATED: { icon: FilePlus, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  APPROVED: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  REJECTED: { icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  CHECKED_IN: { icon: LogIn, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  CHECKED_OUT: { icon: LogOut, color: 'text-slate-600 bg-slate-100 border-slate-200' },
  CANCELLED: { icon: Ban, color: 'text-gray-600 bg-gray-100 border-gray-200' },
};

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

export const VisitorDetailsDrawer = ({
  isOpen,
  onClose,
  pass,
  onPassUpdated,
  onOpenPassSlip,
}) => {
  const [currentPass, setCurrentPass] = useState(pass);
  const [activities, setActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activityError, setActivityError] = useState(null);

  // Rejection / Cancellation inline prompts
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const toast = useToast();
  const prefersReduced = useReducedMotion();

  // Sync pass prop when changed
  useEffect(() => {
    setCurrentPass(pass);
    setIsRejecting(false);
    setIsCancelling(false);
    setRejectionReason('');
    setCancellationReason('');
  }, [pass]);

  // Load activities when drawer opens
  const loadActivities = useCallback(async (passId) => {
    if (!passId) return;
    setIsLoadingActivities(true);
    setActivityError(null);
    try {
      const res = await visitorService.getActivities(passId);
      setActivities(res.data || []);
    } catch (err) {
      setActivityError(err.message || 'Failed to load activity timeline.');
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && currentPass?._id) {
      loadActivities(currentPass._id);
      // Focus close button on open for keyboard accessibility
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [isOpen, currentPass?._id, loadActivities]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentPass) return null;

  // Real state action handlers with optimistic local update + server reconciliation
  const handleApprove = async () => {
    const prev = currentPass;
    const res = await visitorService.updateStatus(
      currentPass._id,
      'APPROVE',
      'Approved via Administrator Dashboard'
    );
    const updated = res.data;
    setCurrentPass(updated);
    toast.success(`Visit pass ${updated.passId} approved for ${updated.visitorName}.`);
    onPassUpdated?.(updated, prev);
    loadActivities(updated._id);
    return res;
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.warning('Please provide a reason for rejecting this visit.');
      return;
    }
    const prev = currentPass;
    const res = await visitorService.updateStatus(
      currentPass._id,
      'REJECT',
      rejectionReason.trim()
    );
    const updated = res.data;
    setCurrentPass(updated);
    setIsRejecting(false);
    setRejectionReason('');
    toast.success(`Visit request for ${updated.visitorName} rejected.`);
    onPassUpdated?.(updated, prev);
    loadActivities(updated._id);
    return res;
  };

  const handleCheckIn = async () => {
    const prev = currentPass;
    const res = await visitorService.checkIn(currentPass._id);
    const updated = res.data;
    setCurrentPass(updated);
    toast.success(`Checked in ${updated.visitorName} (Pass: ${updated.passId}).`);
    onPassUpdated?.(updated, prev);
    loadActivities(updated._id);
    return res;
  };

  const handleCheckOut = async () => {
    const prev = currentPass;
    const res = await visitorService.checkOut(currentPass._id);
    const updated = res.data;
    setCurrentPass(updated);
    toast.success(`Checked out ${updated.visitorName}. Visit completed.`);
    onPassUpdated?.(updated, prev);
    loadActivities(updated._id);
    return res;
  };

  const handleConfirmCancel = async () => {
    const prev = currentPass;
    const reason = cancellationReason.trim() || 'Cancelled via Admin Dashboard';
    const res = await visitorService.cancel(currentPass._id, reason);
    const updated = res.data;
    setCurrentPass(updated);
    setIsCancelling(false);
    setCancellationReason('');
    toast.success(`Pass ${updated.passId} cancelled.`);
    onPassUpdated?.(updated, prev);
    loadActivities(updated._id);
    return res;
  };

  // Animation configuration
  const drawerVariants = prefersReduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Visitor Pass Details">
      {/* Backdrop — restrained bg-slate-900/40 without heavy blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <motion.div
          ref={drawerRef}
          {...drawerVariants}
          className="w-screen max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full focus:outline-none"
        >
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                {currentPass.passId}
              </span>
              <StatusBadge status={currentPass.status} />
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              aria-label="Close details drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visitor Identity Banner */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{currentPass.visitorName}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {currentPass.visitorCompany}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentPass.visitorPhone}</span>
                </div>
                {currentPass.visitorEmail && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{currentPass.visitorEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Host Employee Details */}
            <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Host Staff
                </p>
                {currentPass.hostEmployeeId?.employeeCode && (
                  <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                    {currentPass.hostEmployeeId.employeeCode}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {currentPass.hostEmployeeId?.fullName || 'Host Staff'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentPass.hostEmployeeId?.designation} • {currentPass.hostEmployeeId?.department}
                </p>
                {currentPass.hostEmployeeId?.phone && (
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {currentPass.hostEmployeeId.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Visit Schedule & Timing */}
            <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Visit Schedule
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Visit Date</span>
                  <span className="font-semibold text-slate-800">{currentPass.visitDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Expected Time</span>
                  <span className="font-semibold text-slate-800">{currentPass.expectedArrivalTime}</span>
                </div>
                {currentPass.checkInTime && (
                  <div>
                    <span className="text-slate-500 block text-[11px]">Checked In</span>
                    <span className="font-semibold text-emerald-700">
                      {new Date(currentPass.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                {currentPass.checkOutTime && (
                  <div>
                    <span className="text-slate-500 block text-[11px]">Checked Out</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(currentPass.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Purpose of Visit */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Purpose of Visit
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">{currentPass.purpose}</p>
            </div>

            {/* Remarks / Rejection / Cancellation Notes if present */}
            {currentPass.hostRemarks && (
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-3.5 text-xs text-amber-900">
                <p className="font-bold mb-0.5">Host Remarks:</p>
                <p className="italic">"{currentPass.hostRemarks}"</p>
              </div>
            )}

            {currentPass.cancellationReason && (
              <div className="bg-rose-50 rounded-xl border border-rose-200 p-3.5 text-xs text-rose-900">
                <p className="font-bold mb-0.5">Cancellation Reason:</p>
                <p className="italic">"{currentPass.cancellationReason}"</p>
              </div>
            )}

            {/* Activity History Timeline (Real Data) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-400" /> Activity Timeline
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activities.length} {activities.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              {isLoadingActivities ? (
                <div className="space-y-3 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activityError ? (
                <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
                  {activityError}
                </p>
              ) : activities.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No activity log recorded for this pass yet.
                </p>
              ) : (
                <div className="relative pl-5 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activities.map((act) => {
                    const config = actionIconMap[act.action] || actionIconMap.CREATED;
                    const IconComp = config.icon;

                    return (
                      <div key={act._id} className="relative group">
                        {/* Dot / Icon Node */}
                        <div
                          className={`absolute -left-5 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${config.color}`}
                        >
                          <IconComp className="w-3 h-3" />
                        </div>

                        {/* Event Content */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-xs">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 text-xs">{act.action}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                            <span>By:</span>
                            <span className="font-semibold text-slate-800">{act.performedByName}</span>
                            <span className="text-slate-400 font-mono text-[10px]">({act.performedByRole})</span>
                          </div>

                          {act.remarks && (
                            <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200/80 mt-1.5 italic">
                              "{act.remarks}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Inline Rejection Reason Form */}
            {isRejecting && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3 animate-login-entrance">
                <div className="flex items-center gap-2 text-rose-900 text-xs font-bold">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Reject Visitor Request</span>
                </div>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide reason for rejection (required)..."
                  className="w-full text-xs p-2.5 bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button variant="secondary" size="xs" onClick={() => setIsRejecting(false)}>
                    Cancel
                  </Button>
                  <StatefulButton
                    variant="danger"
                    size="xs"
                    idleText="Confirm Rejection"
                    loadingText="Rejecting..."
                    successText="Rejected"
                    onClick={handleConfirmReject}
                  />
                </div>
              </div>
            )}

            {/* Inline Cancellation Form */}
            {isCancelling && (
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-3 animate-login-entrance">
                <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
                  <Ban className="w-4 h-4 text-slate-600" />
                  <span>Cancel Visitor Pass</span>
                </div>
                <textarea
                  rows={2}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Reason for cancellation (optional)..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button variant="secondary" size="xs" onClick={() => setIsCancelling(false)}>
                    Back
                  </Button>
                  <StatefulButton
                    variant="danger"
                    size="xs"
                    idleText="Confirm Cancel"
                    loadingText="Cancelling..."
                    successText="Cancelled"
                    onClick={handleConfirmCancel}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Drawer Actions Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Printer}
              onClick={() => onOpenPassSlip?.(currentPass)}
            >
              Pass Slip
            </Button>

            <div className="flex items-center gap-2">
              {currentPass.status === 'PENDING_APPROVAL' && !isRejecting && !isCancelling && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() => setIsRejecting(true)}
                  >
                    Reject
                  </Button>
                  <StatefulButton
                    variant="success"
                    size="sm"
                    idleText="Approve Pass"
                    loadingText="Approving..."
                    successText="Approved"
                    idleIcon={CheckCircle2}
                    onClick={handleApprove}
                  />
                </>
              )}

              {currentPass.status === 'APPROVED' && !isCancelling && (
                <>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => setIsCancelling(true)}
                  >
                    Cancel Pass
                  </Button>
                  <StatefulButton
                    variant="checkin"
                    size="sm"
                    idleText="Check In Visitor"
                    loadingText="Checking In..."
                    successText="Checked In"
                    idleIcon={LogIn}
                    onClick={handleCheckIn}
                  />
                </>
              )}

              {currentPass.status === 'CHECKED_IN' && (
                <StatefulButton
                  variant="checkout"
                  size="sm"
                  idleText="Check Out Visitor"
                  loadingText="Checking Out..."
                  successText="Checked Out"
                  idleIcon={LogOut}
                  onClick={handleCheckOut}
                />
              )}

              {['CHECKED_OUT', 'REJECTED', 'CANCELLED'].includes(currentPass.status) && (
                <span className="text-xs text-slate-500 font-medium">
                  {currentPass.status === 'CHECKED_OUT' && 'Visit completed'}
                  {currentPass.status === 'REJECTED' && 'Pass was rejected'}
                  {currentPass.status === 'CANCELLED' && 'Pass was cancelled'}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisitorDetailsDrawer;
