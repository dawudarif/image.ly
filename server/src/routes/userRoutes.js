import express from 'express';
import multer from 'multer';
import {
  authUser,
  getProfilePic,
  getUserProfile,
  logoutUser,
  registerUser,
  updateProfilePic,
} from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/register', registerUser);
router.post('/auth', authUser);
router.route('/logout').get(protect, logoutUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile-pic').get(protect, getProfilePic);
router
  .route('/update-user')
  .put(protect, upload.single('image'), updateProfilePic);

export default router;
