/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from './blog.controller';

const router = Router();

router.route('/')
  .get(getAllPosts)
  .post(protect, verifyAdmin, createPost);

router.route('/:slug').get(getPostBySlug);

router.route('/id/:id')
  .patch(protect, verifyAdmin, updatePost)
  .delete(protect, verifyAdmin, deletePost);

export default router;
