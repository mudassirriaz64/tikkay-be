/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import {
  getContactPageData,
  submitContactForm,
  getSubmissions,
  markSubmissionRead,
  deleteSubmission,
  contactMethods,
  openingDays,
  getPageConfig,
  updatePageConfig,
} from './contact.controller';

const router = Router();

router.route('/page-data').get(getContactPageData);
router.route('/page-config')
  .get(protect, verifyAdmin, getPageConfig)
  .patch(protect, verifyAdmin, updatePageConfig);

router.route('/methods')
  .get(contactMethods.getAll)
  .post(protect, verifyAdmin, contactMethods.create);
router.route('/methods/:id')
  .get(contactMethods.getById)
  .patch(protect, verifyAdmin, contactMethods.update)
  .delete(protect, verifyAdmin, contactMethods.delete);

router.route('/opening-hours')
  .get(openingDays.getAll)
  .post(protect, verifyAdmin, openingDays.create);
router.route('/opening-hours/:id')
  .get(openingDays.getById)
  .patch(protect, verifyAdmin, openingDays.update)
  .delete(protect, verifyAdmin, openingDays.delete);

router.route('/submit').post(submitContactForm);
router.route('/submissions').get(protect, verifyAdmin, getSubmissions);
router.route('/submissions/:id/read').patch(protect, verifyAdmin, markSubmissionRead);
router.route('/submissions/:id').delete(protect, verifyAdmin, deleteSubmission);

export default router;
