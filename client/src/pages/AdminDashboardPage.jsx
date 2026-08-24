import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reportService from '../services/reportService';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import PassSlipModal from '../components/PassSlipModal';
import AuditTimelineModal from '../components/AuditTimelineModal';
import Button from '../components/Button';
import {
  Users,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  UserPlus,
  History,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);
  const [auditPass, setAuditPass] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await reportService.getAdminDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Visitor Overview</h2>
          <p className="text-xs text-slate-500 mt-1">Today's visitor activity and site access</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={UserCheck} onClick={() => navigate('/admin/users')}>
            User Accounts
          </Button>
          <Button variant="primary" size="sm" icon={Users} onClick={() => navigate('/admin/employees')}>
            Staff Directory
          </Button>
        </div>
      </div>

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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today's Visitor Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Most recent visitor registrations and state transitions</p>
            </div>
            <Button variant="ghost" size="xs" onClick={() => navigate('/admin/reports')}>
              Full History &rarr;
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-4 py-3">Pass ID</th>
                  <th className="px-4 py-3">Visitor</th>
                  <th className="px-4 py-3">Host Staff</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-4 py-3.5">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : !stats?.recentPasses?.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs font-medium">
                      No visitor passes created today yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentPasses.map((pass) => (
                    <tr key={pass._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-indigo-600">
                        {pass.passId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 text-xs">{pass.visitorName}</div>
                        <div className="text-[11px] text-slate-500">{pass.visitorCompany}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium text-slate-800">{pass.hostEmployeeId?.fullName}</div>
                        <div className="text-[10px] text-slate-500">{pass.hostEmployeeId?.department}</div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={pass.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
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

        {/* Right Col: Live System Audit Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Live Audit Trail</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Live logging" />
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                ))
              ) : !stats?.recentActivities?.length ? (
                <p className="text-xs text-slate-500 text-center py-6">No audit activities recorded.</p>
              ) : (
                stats.recentActivities.map((act) => (
                  <div key={act._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-indigo-900 font-mono">{act.passId}</span>
                      <span className="font-semibold text-slate-600">{act.action}</span>
                    </div>
                    <p className="text-slate-600 mt-1 truncate">{act.remarks || 'Status update logged'}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-200/50">
                      <span>By: {act.performedByName}</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
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

      {/* Pass Slip & Audit Modals */}
      <PassSlipModal isOpen={!!selectedPass} onClose={() => setSelectedPass(null)} pass={selectedPass} />
      <AuditTimelineModal isOpen={!!auditPass} onClose={() => setAuditPass(null)} passRef={auditPass} />
    </div>
  );
};

export default AdminDashboardPage;
