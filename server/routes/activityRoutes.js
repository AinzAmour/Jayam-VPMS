import express from 'express';
import { getActivities } from '../controllers/activityController.js';
import { verifyToken, requireRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRoles('ADMINISTRATOR'));

router.get('/', getActivities);

export default router;
