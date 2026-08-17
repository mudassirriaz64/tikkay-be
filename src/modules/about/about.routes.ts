/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import {
  getAboutPageData,
  getFounder,
  updateFounder,
  getPageConfig,
  updatePageConfig,
  stats,
  milestones,
  journeyPosts,
} from './about.controller';

const router = Router();

router.route('/page-data').get(getAboutPageData);
router.route('/page-config')
  .get(protect, verifyAdmin, getPageConfig)
  .patch(protect, verifyAdmin, updatePageConfig);

router.route('/founder')
  .get(protect, verifyAdmin, getFounder)
  .patch(protect, verifyAdmin, updateFounder);

router.route('/stats')
  .get(stats.getAll)
  .post(protect, verifyAdmin, stats.create);
router.route('/stats/:id')
  .get(stats.getById)
  .patch(protect, verifyAdmin, stats.update)
  .delete(protect, verifyAdmin, stats.delete);

router.route('/milestones')
  .get(milestones.getAll)
  .post(protect, verifyAdmin, milestones.create);
router.route('/milestones/:id')
  .get(milestones.getById)
  .patch(protect, verifyAdmin, milestones.update)
  .delete(protect, verifyAdmin, milestones.delete);

router.route('/journey-posts')
  .get(journeyPosts.getAll)
  .post(protect, verifyAdmin, journeyPosts.create);
router.route('/journey-posts/:id')
  .get(journeyPosts.getById)
  .patch(protect, verifyAdmin, journeyPosts.update)
  .delete(protect, verifyAdmin, journeyPosts.delete);

export default router;
