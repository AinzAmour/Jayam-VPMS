import React, { useState, useEffect } from 'react';
import reportService from '../services/reportService';
import { useToast } from '../context/ToastContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import PassSlipModal from '../components/PassSlipModal';
import PassStatusDonutChart from '../components/PassStatusDonutChart';
import DepartmentBarChart from '../components/DepartmentBarChart';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import {
  BarChart3,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  Printer,
  Download,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminReportsPage = () => {
  const [filterPreset, setFilterPreset] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState(null);

  const toast = useToast();

  useEffect(() => {
    loadReport();
  }, [filterPreset]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const params = { filter: filterPreset };
      if (filterPreset === 'custom') {
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
      }
      const res = await reportService.getSummary(params);
      setReportData(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to generate report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCustomDates = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.warning('Please select both start date and end date.');
      return;
    }
    loadReport();
  };

  const handleExportCSV = () => {
    if (!reportData?.records?.length) {
      toast.warning('No visitor records available to export.');
      return;
    }

    const headers = ['Pass ID', 'Visitor Name', 'Phone', 'Company', 'Host Staff', 'Department', 'Visit Date', 'Arrival Time', 'Status', 'Check-In', 'Check-Out'];
    const rows = reportData.records.map((r) => [
      r.passId,
      `"${r.visitorName}"`,
      `"${r.visitorPhone}"`,
      `"${r.visitorCompany}"`,
      `"${r.hostEmployeeId?.fullName || ''}"`,
      `"${r.hostEmployeeId?.department || ''}"`,
      r.visitDate,
      r.expectedArrivalTime,
      r.status,
      r.checkInTime ? new Date(r.checkInTime).toLocaleString() : '',
      r.checkOutTime ? new Date(r.checkOutTime).toLocaleString() : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jayam_vpms_report_${filterPreset}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Report exported successfully.');
  };

  return (
    <div className="printable-area space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Visitor Reports</h2>
            <p className="text-xs text-slate-500 mt-1">Summary metrics, department distributions, and daily visit logs</p>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
              Print Report
            </Button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 no-print">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setFilterPreset('today')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterPreset === 'today' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterPreset('this_week')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterPreset === 'this_week' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilterPreset('custom')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterPreset === 'custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Range
            </button>
          </div>

          {filterPreset === 'custom' && (
            <form onSubmit={handleApplyCustomDates} className="flex flex-wrap items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <span className="text-xs text-slate-400 font-semibold">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
              <Button type="submit" variant="primary" size="sm">
                Apply Range
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visitors"
          value={reportData?.totalVisitors ?? 0}
          icon={Users}
          variant="indigo"
          subtitle={`Range: ${reportData?.startDate || 'Today'} to ${reportData?.endDate || 'Today'}`}
          isLoading={isLoading}
        />
        <MetricCard
          title="Completed Visits"
          value={reportData?.statusBreakdown?.CHECKED_OUT ?? 0}
          icon={CheckCircle2}
          variant="emerald"
          subtitle="Safely checked out"
          isLoading={isLoading}
        />
        <MetricCard
          title="Currently Inside"
          value={reportData?.currentInside ?? 0}
          icon={Building2}
          variant="slate"
          subtitle="On site right now"
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg Visit Duration"
          value={reportData?.avgDurationMinutes ? `${reportData.avgDurationMinutes} mins` : 'N/A'}
          icon={Clock}
          variant="amber"
          subtitle="From check-in to check-out"
          isLoading={isLoading}
        />
      </div>

      {/* Status Breakdown & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Pass Status Distribution</h3>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {reportData?.totalVisitors ?? 0} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Proportion of passes across each approval & check-in state</p>
          </div>

          <PassStatusDonutChart
            statusBreakdown={reportData?.statusBreakdown}
            totalVisitors={reportData?.totalVisitors ?? 0}
            isLoading={isLoading}
          />
        </div>

        {/* Top Host Departments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Department Visitor Traffic</h3>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                {reportData?.topDepartments?.length ?? 0} Departments
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Breakdown of host employee departments receiving visitors</p>
          </div>

          <DepartmentBarChart
            departments={reportData?.topDepartments || []}
            totalVisitors={reportData?.totalVisitors ?? 0}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Daily Summary Breakdown</h3>
        <p className="text-xs text-slate-500 mb-4">Day-by-day aggregate statistics and duration trends</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total Passes</th>
                <th className="px-4 py-3">Approved</th>
                <th className="px-4 py-3">Checked In</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Rejected</th>
                <th className="px-4 py-3">Approval Rate</th>
                <th className="px-4 py-3">Avg Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!reportData?.dailyBreakdown?.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No visitor records found for this date period.
                  </td>
                </tr>
              ) : (
                reportData.dailyBreakdown.map((row) => (
                  <tr key={row.date} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.date}</td>
                    <td className="px-4 py-3 font-bold text-indigo-700">{row.total}</td>
                    <td className="px-4 py-3 text-emerald-700 font-medium">{row.approved}</td>
                    <td className="px-4 py-3 text-indigo-600 font-medium">{row.checkedIn}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{row.checkedOut}</td>
                    <td className="px-4 py-3 text-rose-700 font-medium">{row.rejected}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {row.approvalRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {row.avgDurationMinutes > 0 ? `${row.avgDurationMinutes} mins` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pass Slip Modal */}
      <PassSlipModal isOpen={!!selectedPass} onClose={() => setSelectedPass(null)} pass={selectedPass} />
    </div>
  );
};

export default AdminReportsPage;
