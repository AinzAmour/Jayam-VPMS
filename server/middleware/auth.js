import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

dotenv.config();

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || !secret.trim()) {
    throw new Error(
      '[FATAL SECURITY ERROR] JWT_SECRET environment variable is missing or empty. A secure secret must be configured.'
    );
  }
  return secret.trim();
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      employeeRef: user.employeeRef,
    },
    getJwtSecret(),
    { expiresIn: '8h' }
  );
};

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing. Please sign in.',
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This user account has been deactivated. Please contact an administrator.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please sign in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.',
    });
  }
};

// Route guard for specific roles
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: You do not have permission to perform this action. Required role: ${allowedRoles.join(' or ')}`,
      });
    }

    next();
  };
};
