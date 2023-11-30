import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPost,
  deletePost,
  getPosts,
  getUploadUrl,
  myPosts,
} from '../controller/postController.js';
const router = express.Router();

router.route('/get-upload-url').get(protect, getUploadUrl);
router.route('/create-post').post(protect, createPost);
router.route('/get-posts').get(protect, getPosts);
router.route('/my-posts').get(protect, myPosts);
router.route('/delete-post/:id').delete(protect, deletePost);

export default router;
