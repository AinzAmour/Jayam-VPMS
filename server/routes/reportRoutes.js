import express from 'express';
import {
  getSummaryReport,
  getAdminDashboardStats,
} from '../controllers/reportController.js';
import { verifyToken, requireRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRoles('ADMINISTRATOR'));

router.get('/summary', getSummaryReport);
router.get('/dashboard-stats', getAdminDashboardStats);

export default router;
