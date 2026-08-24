import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
} from '../controllers/userController.js';
import { verifyToken, requireRoles } from '../middleware/auth.js';

const router = express.Router();

// Administrator only
router.use(verifyToken);
router.use(requireRoles('ADMINISTRATOR'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);

export default router;
