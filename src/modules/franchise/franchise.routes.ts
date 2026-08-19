/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import {
  createFranchiseInquiry,
  getAllFranchiseInquiries,
  updateFranchiseStatus,
  deleteFranchiseInquiry,
} from './franchise.controller';

const router = Router();

router.route('/')
  .post(createFranchiseInquiry)
  .get(protect, verifyAdmin, getAllFranchiseInquiries);

router.route('/:id/status')
  .patch(protect, verifyAdmin, updateFranchiseStatus);

router.route('/:id')
  .delete(protect, verifyAdmin, deleteFranchiseInquiry);

export default router;
