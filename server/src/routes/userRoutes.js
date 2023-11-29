import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  authUser,
  getUserProfile,
  logoutUser,
  registerUser,
} from '../controller/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/auth', authUser);
router.route('/logout').get(protect, logoutUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
