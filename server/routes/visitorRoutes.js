import express from 'express';
import {
  registerVisitor,
  getVisitors,
  getTodayQueue,
  getPassById,
  updateStatus,
  checkInVisitor,
  checkOutVisitor,
  cancelVisit,
  getPassActivities,
  getEmployeeDashboardStats,
} from '../controllers/visitorController.js';
import { verifyToken, requireRoles } from '../middleware/auth.js';

const router = express.Router();

// Protected for all authenticated roles with appropriate role guards
router.use(verifyToken);

// Employee stats endpoint
router.get('/employee-stats', requireRoles('EMPLOYEE', 'ADMINISTRATOR'), getEmployeeDashboardStats);

// Receptionist & Admin today's queue
router.get('/today-queue', requireRoles('RECEPTIONIST', 'ADMINISTRATOR'), getTodayQueue);

// Register visitor (Receptionist, Admin)
router.post('/', requireRoles('RECEPTIONIST', 'ADMINISTRATOR'), registerVisitor);

// Search & list passes (All roles, scoped for employee)
router.get('/', getVisitors);

// Single pass details & activities
router.get('/:id', getPassById);
router.get('/:id/activities', getPassActivities);

// Host employee approval / rejection
router.put('/:id/status', requireRoles('EMPLOYEE', 'ADMINISTRATOR'), updateStatus);

// Receptionist check-in and check-out
router.put('/:id/checkin', requireRoles('RECEPTIONIST', 'ADMINISTRATOR'), checkInVisitor);
router.put('/:id/checkout', requireRoles('RECEPTIONIST', 'ADMINISTRATOR'), checkOutVisitor);

// Cancel visit (Receptionist, Host Employee, Admin)
router.put('/:id/cancel', requireRoles('RECEPTIONIST', 'EMPLOYEE', 'ADMINISTRATOR'), cancelVisit);

export default router;
