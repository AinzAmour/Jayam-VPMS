import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import reportService from '../services/reportService';
import visitorService from '../services/visitorService';
import { useToast } from '../context/ToastContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import PassSlipModal from '../components/PassSlipModal';
import AuditTimelineModal from '../components/AuditTimelineModal';
import VisitorDetailsDrawer from '../components/VisitorDetailsDrawer';
import Button from '../components/Button';
import {
  Users,
  UserCheck,
  Building2,
  Clock,
  AlertCircle,
  History,
  ShieldCheck,
  Eye,
  Printer,
  RotateCw,
  AlertTriangle,
  Building,
  Calendar,
  FileText,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modals & Drawer State
  const [selectedPassForDrawer, setSelectedPassForDrawer] = useState(null);
  const [selectedPassSlip, setSelectedPassSlip] = useState(null);
  const [auditPass, setAuditPass] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const res = await reportService.getAdminDashboardStats();
      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      if (!isSilent) {
        setError(err.message || 'Unable to load dashboard data. Please verify your connection.');
      } else {
        toast.error('Background refresh failed.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle local state updates from VisitorDetailsDrawer with deterministic metrics & server reconciliation
  const handlePassUpdated = (updatedPass, previousPass) => {
    // 1. Update recentPasses locally
    setStats((prev) => {
      if (!prev) return prev;
      const updatedList = (prev.recentPasses || []).map((p) =>
        p._id === updatedPass._id ? { ...p, ...updatedPass } : p
      );

      // Deterministic adjustments
      let currentInside = prev.currentInside;
      let pendingApprovals = prev.pendingApprovals;

      const prevStatus = previousPass?.status;
      const newStatus = updatedPass.status;

      if (prevStatus === 'PENDING_APPROVAL' && newStatus !== 'PENDING_APPROVAL') {
        pendingApprovals = Math.max(0, pendingApprovals - 1);
      }

      if (prevStatus !== 'CHECKED_IN' && newStatus === 'CHECKED_IN') {
        currentInside = currentInside + 1;
      } else if (prevStatus === 'CHECKED_IN' && newStatus !== 'CHECKED_IN') {
        currentInside = Math.max(0, currentInside - 1);
      }

      return {
        ...prev,
        recentPasses: updatedList,
        currentInside,
        pendingApprovals,
      };
    });

    // 2. Background reconciliation to fetch server truth (activities, exact counts) without layout flash
    loadDashboardData(true);
  };

  // Open drawer for a pass clicked in audit feed
  const handleAuditPassClick = async (passId) => {
    if (!passId) return;
    const match = stats?.recentPasses?.find((p) => p.passId === passId);
    if (match) {
      setSelectedPassForDrawer(match);
    } else {
      try {
        // If not in recent passes list, query by search or fetch directly
        const res = await visitorService.getAll({ search: passId, limit: 1 });
        if (res.data?.records?.length) {
          setSelectedPassForDrawer(res.data.records[0]);
        }
      } catch (err) {
        console.error('Could not find pass for audit item:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visitor Overview</h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
              <Calendar className="w-3 h-3 text-slate-400" />
              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time site access metrics, today's visitor registrations, and system audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCw}
            isLoading={isRefreshing}
            onClick={() => loadDashboardData(true)}
            title="Refresh dashboard data"
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={UserCheck}
            onClick={() => navigate('/admin/users')}
          >
            User Accounts
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Users}
            onClick={() => navigate('/admin/employees')}
          >
            Staff Directory
          </Button>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Unable to load dashboard data</p>
              <p className="text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadDashboardData(false)}
            className="shrink-0 border-rose-300 hover:bg-rose-100/60 text-rose-900"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Inside Now"
          value={stats?.currentInside ?? 0}
          icon={Building2}
          variant="indigo"
          subtitle="Currently on site"
          isLoading={isLoading}
        />
        <MetricCard
          title="Today's Passes"
          value={stats?.todayTotal ?? 0}
          icon={Users}
          variant="slate"
          subtitle="Registered today"
          isLoading={isLoading}
        />
        <MetricCard
          title="Expected Today"
          value={stats?.scheduledToday ?? 0}
          icon={Clock}
          variant="slate"
          subtitle="Expected arrivals"
          isLoading={isLoading}
        />
        <MetricCard
          title="Pending Approvals"
          value={stats?.pendingApprovals ?? 0}
          icon={AlertCircle}
          variant="amber"
          subtitle="Awaiting host review"
          isLoading={isLoading}
          isPriority={(stats?.pendingApprovals ?? 0) > 0}
        />
        <MetricCard
          title="Total Staff"
          value={stats?.totalEmployees ?? 0}
          icon={ShieldCheck}
          variant="slate"
          subtitle="Active directory"
          isLoading={isLoading}
        />
      </div>

      {/* Two Column Layout: Recent Passes & Live Activity Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Today's Recent Visitor Passes */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Visitor Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any row to open the visitor details drawer and inspect history
                </p>
              </div>
              <Button variant="ghost" size="xs" onClick={() => navigate('/admin/reports')}>
                Full History &rarr;
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm" role="table">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th scope="col" className="px-4 py-3">Pass ID</th>
                    <th scope="col" className="px-4 py-3">Visitor</th>
                    <th scope="col" className="px-4 py-3">Host Staff</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3.5"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                        <td className="px-4 py-3.5"><div className="h-4 bg-slate-200 rounded w-36 mb-1" /><div className="h-3 bg-slate-100 rounded w-24" /></td>
                        <td className="px-4 py-3.5"><div className="h-4 bg-slate-200 rounded w-28 mb-1" /><div className="h-3 bg-slate-100 rounded w-20" /></td>
                        <td className="px-4 py-3.5"><div className="h-5 bg-slate-200 rounded-full w-24" /></td>
                        <td className="px-4 py-3.5 text-right"><div className="h-6 bg-slate-200 rounded w-16 ml-auto" /></td>
                      </tr>
                    ))
                  ) : !stats?.recentPasses?.length ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                            <Users className="w-5 h-5" />
                          </div>
                          <p className="font-semibold text-slate-700 text-sm">No visitor activity yet today</p>
                          <p className="text-xs text-slate-400 mt-0.5">Passes registered today will appear here in real-time.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stats.recentPasses.map((pass) => (
                      <tr
                        key={pass._id}
                        onClick={() => setSelectedPassForDrawer(pass)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedPassForDrawer(pass);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View details for ${pass.visitorName}, Pass ID ${pass.passId}`}
                        className="hover:bg-slate-50/90 transition-colors cursor-pointer focus:outline-none focus:bg-slate-50/90 focus:ring-1 focus:ring-inset focus:ring-indigo-500 group"
                      >
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                          {pass.passId}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 text-xs">{pass.visitorName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{pass.visitorCompany}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-xs font-semibold text-slate-800">{pass.hostEmployeeId?.fullName || 'Host Staff'}</div>
                          <div className="text-[10px] text-slate-500">{pass.hostEmployeeId?.department}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={pass.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPassForDrawer(pass);
                              }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
                              title="View Details Drawer"
                              aria-label="View Details Drawer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPassSlip(pass);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                              title="Print Pass Slip"
                              aria-label="Print Pass Slip"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAuditPass(pass);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                              title="View Audit Timeline"
                              aria-label="View Audit Timeline"
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
        </div>

        {/* Right Col: Live System Audit Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Live Audit Trail</h3>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  REAL-TIME
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System logging active" />
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                ))
              ) : !stats?.recentActivities?.length ? (
                <p className="text-xs text-slate-500 text-center py-8">No audit activities recorded.</p>
              ) : (
                stats.recentActivities.map((act) => (
                  <div
                    key={act._id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => handleAuditPassClick(act.passId)}
                        className="font-bold text-indigo-700 font-mono hover:underline focus:outline-none"
                        title="Inspect pass in drawer"
                      >
                        {act.passId}
                      </button>
                      <span className="font-semibold text-slate-700 text-[11px] bg-slate-200/60 px-1.5 py-0.5 rounded">
                        {act.action}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-1 truncate text-[11px]">
                      {act.remarks || 'Status update logged'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200/60">
                      <span>By: <strong className="text-slate-700 font-medium">{act.performedByName}</strong></span>
                      <span className="font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              icon={History}
              onClick={() => navigate('/admin/audit-logs')}
            >
              View Full Audit Trail
            </Button>
          </div>
        </div>
      </div>

      {/* Visitor Details Drawer */}
      <VisitorDetailsDrawer
        isOpen={!!selectedPassForDrawer}
        onClose={() => setSelectedPassForDrawer(null)}
        pass={selectedPassForDrawer}
        onPassUpdated={handlePassUpdated}
        onOpenPassSlip={(pass) => setSelectedPassSlip(pass)}
      />

      {/* Pass Slip & Audit Modals */}
      <PassSlipModal
        isOpen={!!selectedPassSlip}
        onClose={() => setSelectedPassSlip(null)}
        pass={selectedPassSlip}
      />
      <AuditTimelineModal
        isOpen={!!auditPass}
        onClose={() => setAuditPass(null)}
        passRef={auditPass}
      />
    </div>
  );
};

export default AdminDashboardPage;

