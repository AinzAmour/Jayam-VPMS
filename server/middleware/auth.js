import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'jayam_vpms_jwt_super_secret_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      employeeRef: user.employeeRef,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
};

/**
 * Authenticates incoming HTTP requests by verifying the JWT in the Authorization header.
 * Attaches the authenticated user document (without password hash) to `req.user`.
 */
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

    // Verify token cryptographic signature and expiry
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    // Block deactivated accounts from accessing protected API endpoints
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

/**
 * Role-Based Access Control (RBAC) middleware factory.
 * Enforces route authorization based on assigned user role(s).
 *
 * @param {...string} allowedRoles - Allowed roles (e.g. 'ADMINISTRATOR', 'RECEPTIONIST', 'EMPLOYEE')
 */
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
