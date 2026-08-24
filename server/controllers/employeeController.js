import Employee from '../models/Employee.js';
import VisitPass from '../models/VisitPass.js';

export const getEmployees = async (req, res, next) => {
  try {
    const { activeOnly, search, department } = req.query;
    const query = {};

    if (activeOnly === 'true' || req.user.role !== 'ADMINISTRATOR') {
      query.isActive = true;
    }

    if (department && department !== 'ALL') {
      query.department = department;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: regex },
        { email: regex },
        { employeeCode: regex },
        { department: regex },
        { designation: regex },
      ];
    }

    const employees = await Employee.find(query).sort({ fullName: 1 });

    // Aggregate pending visitor requests for each employee to assist Rule 5 in UI
    const pendingCounts = await VisitPass.aggregate([
      { $match: { status: 'PENDING_APPROVAL' } },
      { $group: { _id: '$hostEmployeeId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    pendingCounts.forEach((item) => {
      countMap[String(item._id)] = item.count;
    });

    const employeesWithCounts = employees.map((emp) => {
      const empObj = emp.toObject();
      empObj.pendingRequestsCount = countMap[String(emp._id)] || 0;
      empObj.isPendingLimitReached = empObj.pendingRequestsCount >= 3;
      return empObj;
    });

    return res.status(200).json({
      success: true,
      data: employeesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const { employeeCode, fullName, email, phone, department, designation } = req.body;

    if (!employeeCode || !fullName || !email || !phone || !department || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required employee fields.',
      });
    }

    const existingCode = await Employee.findOne({ employeeCode: employeeCode.toUpperCase().trim() });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: `Employee with code ${employeeCode} already exists.`,
      });
    }

    const existingEmail = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `Employee with email ${email} already exists.`,
      });
    }

    const newEmployee = await Employee.create({
      employeeCode: employeeCode.toUpperCase().trim(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      department: department.trim(),
      designation: designation.trim(),
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: newEmployee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { fullName, email, phone, department, designation, isActive } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found.',
      });
    }

    if (email && email.toLowerCase().trim() !== employee.email) {
      const emailExists = await Employee.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: employee._id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'An employee with this email already exists.',
        });
      }
      employee.email = email.toLowerCase().trim();
    }

    if (fullName) employee.fullName = fullName.trim();
    if (phone) employee.phone = phone.trim();
    if (department) employee.department = department.trim();
    if (designation) employee.designation = designation.trim();
    if (typeof isActive === 'boolean') employee.isActive = isActive;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};
