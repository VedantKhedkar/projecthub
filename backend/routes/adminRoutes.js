import express from 'express';
const router = express.Router();
import { 
  getPendingUsers, 
  approveUser, 
  rejectUser 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Detailed Logic: Protect these routes so only admins can access them
router.route('/pending-users').get(protect, admin, getPendingUsers);
router.route('/users/approve').post(protect, admin, approveUser);
router.route('/users/reject').post(protect, admin, rejectUser);

export default router;