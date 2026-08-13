/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import {
  getMenuPageData,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPageConfig,
  updatePageConfig,
} from './menu.controller';

const router = Router();

router.route('/page-data').get(getMenuPageData);
router.route('/page-config')
  .get(protect, verifyAdmin, getPageConfig)
  .patch(protect, verifyAdmin, updatePageConfig);

router.route('/categories')
  .get(getCategories)
  .post(protect, verifyAdmin, createCategory);

router.route('/categories/:id')
  .patch(protect, verifyAdmin, updateCategory)
  .delete(protect, verifyAdmin, deleteCategory);

router.route('/items')
  .get(getMenuItems)
  .post(protect, verifyAdmin, createMenuItem);

router.route('/items/:id')
  .get(getMenuItem)
  .patch(protect, verifyAdmin, updateMenuItem)
  .delete(protect, verifyAdmin, deleteMenuItem);

export default router;
