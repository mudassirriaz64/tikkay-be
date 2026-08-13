import { Router, Request, Response } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import {
  getReviewsPageData,
  getPendingReviews,
  createReview,
  approveReview,
  updateReview,
  deleteReview,
  getStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  getVideoReviews,
  createVideoReview,
  updateVideoReview,
  deleteVideoReview,
  getPageConfig,
  updatePageConfig,
} from './reviews.controller';
import { CustomerReview } from './reviews.model';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.route('/page-data').get(getReviewsPageData);
router.route('/page-config')
  .get(protect, verifyAdmin, getPageConfig)
  .patch(protect, verifyAdmin, updatePageConfig);

router.route('/')
  .get(asyncHandler(async (_req: Request, res: Response) => {
    const reviews = await CustomerReview.find({ is_approved: true }).sort({ display_order: 1, createdAt: -1 });
    res.json({ success: true, data: reviews, message: 'Reviews fetched' });
  }))
  .post(createReview);

router.route('/pending').get(protect, verifyAdmin, getPendingReviews);
router.route('/:id/approve').patch(protect, verifyAdmin, approveReview);
router.route('/:id')
  .patch(protect, verifyAdmin, updateReview)
  .delete(protect, verifyAdmin, deleteReview);

router.route('/statistics')
  .get(getStatistics)
  .post(protect, verifyAdmin, createStatistic);

router.route('/statistics/:id')
  .patch(protect, verifyAdmin, updateStatistic)
  .delete(protect, verifyAdmin, deleteStatistic);

router.route('/videos')
  .get(getVideoReviews)
  .post(protect, verifyAdmin, createVideoReview);

router.route('/videos/:id')
  .patch(protect, verifyAdmin, updateVideoReview)
  .delete(protect, verifyAdmin, deleteVideoReview);

export default router;
