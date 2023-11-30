import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addLike,
  createPost,
  deletePost,
  getPosts,
  getUploadUrl,
  myPosts,
  removeLike,
} from '../controller/postController.js';
const router = express.Router();

router.route('/get-upload-url').get(protect, getUploadUrl);
router.route('/create-post').post(protect, createPost);
router.route('/get-posts').get(protect, getPosts);
router.route('/my-posts').get(protect, myPosts);
router.route('/delete-post/:id').delete(protect, deletePost);
router.route('/add-like/:id').put(protect, addLike);
router.route('/remove-like').put(protect, removeLike);

export default router;
