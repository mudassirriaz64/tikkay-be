/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import {
  getGalleryPageData,
  getPageConfig,
  updatePageConfig,
  galleryImages,
  videos,
  instagram,
  googleReviews,
  customerStories,
  kitchenProcesses,
  journeyMilestones,
} from './gallery.controller';

const router = Router();

router.route('/page-data').get(getGalleryPageData);
router.route('/page-config')
  .get(protect, verifyAdmin, getPageConfig)
  .patch(protect, verifyAdmin, updatePageConfig);

router.route('/images')
  .get(galleryImages.getAll)
  .post(protect, verifyAdmin, galleryImages.create);
router.route('/images/:id')
  .get(galleryImages.getById)
  .patch(protect, verifyAdmin, galleryImages.update)
  .delete(protect, verifyAdmin, galleryImages.delete);

router.route('/videos')
  .get(videos.getAll)
  .post(protect, verifyAdmin, videos.create);
router.route('/videos/:id')
  .get(videos.getById)
  .patch(protect, verifyAdmin, videos.update)
  .delete(protect, verifyAdmin, videos.delete);

router.route('/instagram')
  .get(instagram.getAll)
  .post(protect, verifyAdmin, instagram.create);
router.route('/instagram/:id')
  .get(instagram.getById)
  .patch(protect, verifyAdmin, instagram.update)
  .delete(protect, verifyAdmin, instagram.delete);

router.route('/google-reviews')
  .get(googleReviews.getAll)
  .post(protect, verifyAdmin, googleReviews.create);
router.route('/google-reviews/:id')
  .get(googleReviews.getById)
  .patch(protect, verifyAdmin, googleReviews.update)
  .delete(protect, verifyAdmin, googleReviews.delete);

router.route('/customer-stories')
  .get(customerStories.getAll)
  .post(protect, verifyAdmin, customerStories.create);
router.route('/customer-stories/:id')
  .get(customerStories.getById)
  .patch(protect, verifyAdmin, customerStories.update)
  .delete(protect, verifyAdmin, customerStories.delete);

router.route('/kitchen-processes')
  .get(kitchenProcesses.getAll)
  .post(protect, verifyAdmin, kitchenProcesses.create);
router.route('/kitchen-processes/:id')
  .get(kitchenProcesses.getById)
  .patch(protect, verifyAdmin, kitchenProcesses.update)
  .delete(protect, verifyAdmin, kitchenProcesses.delete);

router.route('/journey-milestones')
  .get(journeyMilestones.getAll)
  .post(protect, verifyAdmin, journeyMilestones.create);
router.route('/journey-milestones/:id')
  .get(journeyMilestones.getById)
  .patch(protect, verifyAdmin, journeyMilestones.update)
  .delete(protect, verifyAdmin, journeyMilestones.delete);

export default router;
