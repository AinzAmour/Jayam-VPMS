import express from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
} from '../controllers/employeeController.js';
import { verifyToken, requireRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

// List employees (All authenticated roles can list active employees, Admin can see all)
router.get('/', getEmployees);

// Admin only CRUD
router.post('/', requireRoles('ADMINISTRATOR'), createEmployee);
router.put('/:id', requireRoles('ADMINISTRATOR'), updateEmployee);

export default router;
