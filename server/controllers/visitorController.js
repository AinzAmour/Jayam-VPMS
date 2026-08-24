import VisitPass from '../models/VisitPass.js';
import ActivityLog from '../models/ActivityLog.js';
import Employee from '../models/Employee.js';
import {
  validateVisitRegistration,
  validateCheckIn,
  validateCheckOut,
  getTodayDateString,
  normalizeDateString,
} from '../services/businessRules.js';

// Generates readable pass ID like VP-20260824-001
const generatePassId = async (visitDate) => {
  const dateCompact = visitDate.replace(/-/g, '');
  const countToday = await VisitPass.countDocuments({ visitDate });
  const serial = String(countToday + 1).padStart(3, '0');
  return `VP-${dateCompact}-${serial}`;
};

export const registerVisitor = async (req, res, next) => {
  try {
    const {
      visitorName,
      visitorPhone,
      visitorEmail,
      visitorCompany,
      hostEmployeeId,
      visitDate,
      expectedArrivalTime,
      purpose,
    } = req.body;

    if (
      !visitorName ||
      !visitorPhone ||
      !visitorCompany ||
      !hostEmployeeId ||
      !visitDate ||
      !expectedArrivalTime ||
      !purpose
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required visitor registration fields must be provided.',
      });
    }

    // make sure host exists and is active
    const hostEmployee = await Employee.findById(hostEmployeeId);
    if (!hostEmployee || !hostEmployee.isActive) {
      return res.status(400).json({
        success: false,
        message: 'The selected host employee does not exist or is inactive.',
      });
    }

    // check business rules before saving
    const { normalizedVisitDate } = await validateVisitRegistration({
      visitorPhone,
      hostEmployeeId,
      visitDate,
      expectedArrivalTime,
    });

    const passId = await generatePassId(normalizedVisitDate);

    const newPass = await VisitPass.create({
      passId,
      visitorName: visitorName.trim(),
      visitorPhone: visitorPhone.trim(),
      visitorEmail: visitorEmail ? visitorEmail.trim() : '',
      visitorCompany: visitorCompany.trim(),
      hostEmployeeId,
      visitDate: normalizedVisitDate,
      expectedArrivalTime,
      purpose: purpose.trim(),
      status: 'PENDING_APPROVAL',
      createdByUserId: req.user._id,
    });

    // Record Immutable Audit History
    await ActivityLog.create({
      visitPassId: newPass._id,
      passId: newPass.passId,
      action: 'CREATED',
      performedByUserId: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      remarks: `Visitor pass created for host ${hostEmployee.fullName} (${hostEmployee.department}).`,
    });

    const populatedPass = await VisitPass.findById(newPass._id)
      .populate('hostEmployeeId', 'fullName department designation email phone employeeCode')
      .populate('createdByUserId', 'fullName email role');

    return res.status(201).json({
      success: true,
      message: 'Visitor pass registered successfully and awaiting host approval.',
      data: populatedPass,
    });
  } catch (error) {
    next(error);
  }
};

export const getVisitors = async (req, res, next) => {
  try {
    const {
      search,
      hostName,
      hostEmployeeId,
      status,
      date,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Role Scoping: If logged-in user is EMPLOYEE, restrict to passes where hostEmployeeId == user's employeeRef
    if (req.user.role === 'EMPLOYEE') {
      if (!req.user.employeeRef) {
        return res.status(403).json({
          success: false,
          message: 'Your user account is not associated with an employee profile.',
        });
      }
      query.hostEmployeeId = req.user.employeeRef;
    } else if (hostEmployeeId) {
      query.hostEmployeeId = hostEmployeeId;
    }

    // Status filter
    if (status && status !== 'ALL') {
      query.status = status;
    }

    // Date filters
    if (date) {
      query.visitDate = normalizeDateString(date);
    } else if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) query.visitDate.$gte = normalizeDateString(startDate);
      if (endDate) query.visitDate.$lte = normalizeDateString(endDate);
    }

    // Text search on visitorName, visitorPhone, visitorCompany, or passId
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { visitorName: regex },
        { visitorPhone: regex },
        { visitorCompany: regex },
        { passId: regex },
      ];
    }

    // Host name filter
    if (hostName && hostName.trim() && req.user.role !== 'EMPLOYEE') {
      const matchingEmployees = await Employee.find({
        fullName: new RegExp(hostName.trim(), 'i'),
      }).select('_id');
      const employeeIds = matchingEmployees.map((e) => e._id);
      query.hostEmployeeId = { $in: employeeIds };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const totalRecords = await VisitPass.countDocuments(query);
    const records = await VisitPass.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('hostEmployeeId', 'fullName department designation email phone employeeCode')
      .populate('createdByUserId', 'fullName email role');

    return res.status(200).json({
      success: true,
      data: {
        records,
        pagination: {
          totalRecords,
          currentPage: pageNum,
          totalPages: Math.ceil(totalRecords / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayQueue = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString();

    const todayPasses = await VisitPass.find({
      visitDate: todayStr,
      status: { $ne: 'CANCELLED' }, // Rule 10: cancelled visits not in active queue
    })
      .sort({ expectedArrivalTime: 1 })
      .populate('hostEmployeeId', 'fullName department designation phone')
      .populate('createdByUserId', 'fullName role');

    const insideCount = await VisitPass.countDocuments({ status: 'CHECKED_IN' });
    const scheduledCount = todayPasses.filter(
      (p) => p.status === 'APPROVED' || p.status === 'PENDING_APPROVAL'
    ).length;
    const pendingApprovalCount = todayPasses.filter(
      (p) => p.status === 'PENDING_APPROVAL'
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        date: todayStr,
        totalToday: todayPasses.length,
        insideCount,
        scheduledCount,
        pendingApprovalCount,
        queue: todayPasses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPassById = async (req, res, next) => {
  try {
    const pass = await VisitPass.findById(req.params.id)
      .populate('hostEmployeeId', 'fullName department designation email phone employeeCode')
      .populate('createdByUserId', 'fullName email role');

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Visit pass not found.',
      });
    }

    // Role check for Employee
    if (
      req.user.role === 'EMPLOYEE' &&
      String(pass.hostEmployeeId._id) !== String(req.user.employeeRef)
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to view this visitor pass.',
      });
    }

    return res.status(200).json({
      success: true,
      data: pass,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { action, remarks } = req.body;
    const passId = req.params.id;

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be either 'APPROVE' or 'REJECT'.",
      });
    }

    const pass = await VisitPass.findById(passId).populate('hostEmployeeId');
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Visit pass not found.',
      });
    }

    // Check ownership if Employee role
    if (req.user.role === 'EMPLOYEE') {
      if (
        !req.user.employeeRef ||
        String(pass.hostEmployeeId._id || pass.hostEmployeeId) !== String(req.user.employeeRef)
      ) {
        return res.status(403).json({
          success: false,
          message: 'You can only review visitor requests assigned to you.',
        });
      }
    }

    if (pass.status !== 'PENDING_APPROVAL') {
      return res.status(400).json({
        success: false,
        message: `Cannot change status of a pass that is currently '${pass.status}'. Only pending requests can be approved or rejected.`,
      });
    }

    if (action === 'REJECT' && (!remarks || !remarks.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide explanatory remarks when rejecting a visitor request.',
      });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    pass.status = newStatus;
    pass.hostRemarks = remarks ? remarks.trim() : (action === 'APPROVE' ? 'Approved by host' : 'Rejected');
    await pass.save();

    // Log Activity
    await ActivityLog.create({
      visitPassId: pass._id,
      passId: pass.passId,
      action: newStatus,
      performedByUserId: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      remarks: pass.hostRemarks,
    });

    const updatedPass = await VisitPass.findById(pass._id)
      .populate('hostEmployeeId', 'fullName department designation email phone employeeCode')
      .populate('createdByUserId', 'fullName email role');

    return res.status(200).json({
      success: true,
      message: `Visitor request ${newStatus.toLowerCase()} successfully.`,
      data: updatedPass,
    });
  } catch (error) {
    next(error);
  }
};

export const checkInVisitor = async (req, res, next) => {
  try {
    const pass = await VisitPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Visit pass not found.',
      });
    }

    // Business Rules 6, 7, 9
    await validateCheckIn(pass);

    pass.status = 'CHECKED_IN';
    pass.checkInTime = new Date();
    await pass.save();

    // Log Activity
    await ActivityLog.create({
      visitPassId: pass._id,
      passId: pass.passId,
      action: 'CHECKED_IN',
      performedByUserId: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      remarks: `Visitor admitted at reception. Check-in time: ${pass.checkInTime.toLocaleTimeString()}.`,
    });

    const updatedPass = await VisitPass.findById(pass._id)
      .populate('hostEmployeeId', 'fullName department designation email phone employeeCode')
      .populate('createdByUserId', 'fullName email role');

    return res.status(200).json({
      success: true,
      message: 'Visitor checked in successfully.',
      data: updatedPass,
    });
  } catch (error) {
    next(error);
  }
};

export const checkOutVisitor = async (req, res, next) => {
  try {
    const pass = await VisitPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Visit pass not found.',
      });
    }

    const checkOutTimestamp = new Date();

    // Business Rule 8
    validateCheckOut(pass, checkOutTimestamp);

    pass.status = 'CHECKED_OUT';
    pass.checkOutTime = checkOutTimestamp;
    await pass.save();

    // Log Activity
    await ActivityLog.create({
      visitPassId: pass._id,
      passId: pass.passId,
      action: 'CHECKED_OUT',
      performedByUserId: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      remarks: `Visitor completed visit and checked out at reception.`,
    });

    const updatedPass = await VisitPass.findById(pass._id)
      .populate('hostEmployeeId', 'fullName department designation email phone employeeCode')
      .populate('createdByUserId', 'fullName email role');

    return res.status(200).json({
      success: true,
      message: 'Visitor checked out successfully.',
      data: updatedPass,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelVisit = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const pass = await VisitPass.findById(req.params.id).populate('hostEmployeeId');

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Visit pass not found.',
      });
    }

    // Role checks
    if (req.user.role === 'EMPLOYEE') {
      if (
        !req.user.employeeRef ||
        String(pass.hostEmployeeId._id || pass.hostEmployeeId) !== String(req.user.employeeRef)
      ) {
        return res.status(403).json({
          success: false,
          message: 'You can only cancel visits assigned to you.',
        });
      }
    }

    if (['CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].includes(pass.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a visit pass that is already ${pass.status}.`,
      });
    }

    pass.status = 'CANCELLED';
    pass.cancellationReason = reason ? reason.trim() : 'Cancelled by staff';
    await pass.save();

    // Log Activity
    await ActivityLog.create({
      visitPassId: pass._id,
      passId: pass.passId,
      action: 'CANCELLED',
      performedByUserId: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      remarks: `Visit cancelled. Reason: ${pass.cancellationReason}`,
    });

    const updatedPass = await VisitPass.findById(pass._id)
      .populate('hostEmployeeId', 'fullName department designation email phone employeeCode')
      .populate('createdByUserId', 'fullName email role');

    return res.status(200).json({
      success: true,
      message: 'Visit pass cancelled successfully (Rule 10).',
      data: updatedPass,
    });
  } catch (error) {
    next(error);
  }
};

export const getPassActivities = async (req, res, next) => {
  try {
    const pass = await VisitPass.findById(req.params.id);
    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Visit pass not found.',
      });
    }

    const activities = await ActivityLog.find({ visitPassId: pass._id })
      .sort({ timestamp: 1 })
      .populate('performedByUserId', 'fullName email role');

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeDashboardStats = async (req, res, next) => {
  try {
    if (!req.user.employeeRef) {
      return res.status(400).json({
        success: false,
        message: 'User is not linked to an employee record.',
      });
    }

    const todayStr = getTodayDateString();
    const hostId = req.user.employeeRef;

    const pendingRequests = await VisitPass.find({
      hostEmployeeId: hostId,
      status: 'PENDING_APPROVAL',
    }).sort({ createdAt: -1 });

    const todayApprovedVisits = await VisitPass.find({
      hostEmployeeId: hostId,
      visitDate: todayStr,
      status: { $in: ['APPROVED', 'CHECKED_IN', 'CHECKED_OUT'] },
    }).sort({ expectedArrivalTime: 1 });

    const totalHostedCount = await VisitPass.countDocuments({
      hostEmployeeId: hostId,
      status: 'CHECKED_OUT',
    });

    return res.status(200).json({
      success: true,
      data: {
        pendingCount: pendingRequests.length,
        maxPendingAllowed: 3,
        pendingRequests,
        todayApprovedVisits,
        totalHostedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
