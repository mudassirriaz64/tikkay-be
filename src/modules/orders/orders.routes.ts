/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect, protectOptional } from '../../middleware/auth.middleware';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} from './orders.controller';

const router = Router();

router.route('/')
  .post(createOrder)
  .get(protect, verifyAdmin, getAllOrders);

router.route('/stats').get(protect, verifyAdmin, getOrderStats);
router.route('/my').get(protect, getMyOrders);
router.route('/:id')
  .get(protectOptional, getOrderById)
  .patch(protect, verifyAdmin, updateOrderStatus);

export default router;
