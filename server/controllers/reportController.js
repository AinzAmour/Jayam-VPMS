import VisitPass from '../models/VisitPass.js';
import Employee from '../models/Employee.js';
import ActivityLog from '../models/ActivityLog.js';
import { getTodayDateString, normalizeDateString } from '../services/businessRules.js';

export const getSummaryReport = async (req, res, next) => {
  try {
    const { filter = 'today', startDate, endDate } = req.query;
    let queryStartDate;
    let queryEndDate;

    const todayStr = getTodayDateString();

    if (filter === 'today') {
      queryStartDate = todayStr;
      queryEndDate = todayStr;
    } else if (filter === 'this_week') {
      const now = new Date();
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      queryStartDate = normalizeDateString(firstDayOfWeek);
      queryEndDate = todayStr;
    } else if (filter === 'custom') {
      queryStartDate = startDate ? normalizeDateString(startDate) : todayStr;
      queryEndDate = endDate ? normalizeDateString(endDate) : todayStr;
    } else {
      queryStartDate = todayStr;
      queryEndDate = todayStr;
    }

    const dateFilter = {
      visitDate: {
        $gte: queryStartDate,
        $lte: queryEndDate,
      },
    };

    const passes = await VisitPass.find(dateFilter)
      .populate('hostEmployeeId', 'fullName department')
      .sort({ visitDate: -1, createdAt: -1 });

    const totalVisitors = passes.length;
    const statusCounts = {
      PENDING_APPROVAL: 0,
      APPROVED: 0,
      CHECKED_IN: 0,
      CHECKED_OUT: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };

    const deptCounts = {};
    const dateMap = {};
    let totalDurationMinutes = 0;
    let completedVisitCount = 0;

    passes.forEach((pass) => {
      // Status counting
      if (statusCounts[pass.status] !== undefined) {
        statusCounts[pass.status]++;
      }

      // Department aggregation
      const dept = pass.hostEmployeeId?.department || 'Unassigned';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;

      // Date breakdown
      const vDate = pass.visitDate;
      if (!dateMap[vDate]) {
        dateMap[vDate] = {
          date: vDate,
          total: 0,
          approved: 0,
          rejected: 0,
          checkedIn: 0,
          checkedOut: 0,
          cancelled: 0,
          durations: [],
        };
      }
      dateMap[vDate].total++;
      if (pass.status === 'APPROVED') dateMap[vDate].approved++;
      if (pass.status === 'REJECTED') dateMap[vDate].rejected++;
      if (pass.status === 'CHECKED_IN') dateMap[vDate].checkedIn++;
      if (pass.status === 'CHECKED_OUT') dateMap[vDate].checkedOut++;
      if (pass.status === 'CANCELLED') dateMap[vDate].cancelled++;

      // Duration calculation for completed visits
      if (pass.checkInTime && pass.checkOutTime) {
        const duration = Math.round(
          (new Date(pass.checkOutTime).getTime() - new Date(pass.checkInTime).getTime()) / (1000 * 60)
        );
        if (duration > 0) {
          dateMap[vDate].durations.push(duration);
          totalDurationMinutes += duration;
          completedVisitCount++;
        }
      }
    });

    const topDepartments = Object.keys(deptCounts).map((dept) => ({
      department: dept,
      count: deptCounts[dept],
    })).sort((a, b) => b.count - a.count);

    const dailyBreakdown = Object.values(dateMap).map((d) => {
      const avgDur = d.durations.length
        ? Math.round(d.durations.reduce((a, b) => a + b, 0) / d.durations.length)
        : 0;
      return {
        date: d.date,
        total: d.total,
        approved: d.approved,
        rejected: d.rejected,
        checkedIn: d.checkedIn,
        checkedOut: d.checkedOut,
        cancelled: d.cancelled,
        approvalRate: d.total > 0 ? Math.round(((d.approved + d.checkedIn + d.checkedOut) / d.total) * 100) : 0,
        avgDurationMinutes: avgDur,
      };
    }).sort((a, b) => b.date.localeCompare(a.date));

    const currentInside = await VisitPass.countDocuments({ status: 'CHECKED_IN' });

    return res.status(200).json({
      success: true,
      data: {
        filter,
        startDate: queryStartDate,
        endDate: queryEndDate,
        totalVisitors,
        statusBreakdown: statusCounts,
        currentInside,
        avgDurationMinutes: completedVisitCount > 0 ? Math.round(totalDurationMinutes / completedVisitCount) : 0,
        topDepartments,
        dailyBreakdown,
        records: passes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString();

    const todayTotal = await VisitPass.countDocuments({ visitDate: todayStr });
    const currentInside = await VisitPass.countDocuments({ status: 'CHECKED_IN' });
    const totalEmployees = await Employee.countDocuments({ isActive: true });
    const scheduledToday = await VisitPass.countDocuments({
      visitDate: todayStr,
      status: { $in: ['APPROVED', 'PENDING_APPROVAL'] },
    });
    const pendingApprovals = await VisitPass.countDocuments({ status: 'PENDING_APPROVAL' });

    const recentActivities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(6)
      .populate('performedByUserId', 'fullName role');

    const recentPasses = await VisitPass.find({ visitDate: todayStr })
      .sort({ updatedAt: -1 })
      .limit(6)
      .populate('hostEmployeeId', 'fullName department')
      .populate('createdByUserId', 'fullName role');

    return res.status(200).json({
      success: true,
      data: {
        todayTotal,
        currentInside,
        totalEmployees,
        scheduledToday,
        pendingApprovals,
        recentActivities,
        recentPasses,
      },
    });
  } catch (error) {
    next(error);
  }
};
