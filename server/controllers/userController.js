import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'ALL') {
      query.role = role;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('employeeRef')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, fullName, role, employeeRef } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, full name, and role.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `A user with email ${email} already exists.`,
      });
    }

    if (role === 'EMPLOYEE' && !employeeRef) {
      return res.status(400).json({
        success: false,
        message: 'Employee user accounts must be linked to an employee profile.',
      });
    }

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password,
      fullName: fullName.trim(),
      role,
      employeeRef: role === 'EMPLOYEE' ? employeeRef : null,
      isActive: true,
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: 'User account created successfully.',
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { fullName, email, role, employeeRef, isActive, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const existing = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: user._id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email already exists.',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    if (fullName) user.fullName = fullName.trim();
    if (role) user.role = role;
    if (role === 'EMPLOYEE') {
      user.employeeRef = employeeRef || user.employeeRef;
    } else {
      user.employeeRef = null;
    }

    if (typeof isActive === 'boolean') {
      // Prevent admin from deactivating their own account
      if (String(user._id) === String(req.user._id) && !isActive) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own administrative account.',
        });
      }
      user.isActive = isActive;
    }

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('employeeRef');

    return res.status(200).json({
      success: true,
      message: 'User account updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
