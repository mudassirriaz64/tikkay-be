/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect, protectOptional } from '../../middleware/auth.middleware';
import { createCateringRequest, checkAvailability, getMyCateringRequests, getAllCateringRequests, updateCateringStatus, } from './catering.controller';
const router = Router();
router.route('/requests').post(protectOptional, createCateringRequest);
router.route('/availability').get(checkAvailability);
router.route('/my').get(protect, getMyCateringRequests);
router.route('/')
    .get(protect, verifyAdmin, getAllCateringRequests);
router.route('/:id/status')
    .patch(protect, verifyAdmin, updateCateringStatus);
export default router;
//# sourceMappingURL=catering.routes.js.map