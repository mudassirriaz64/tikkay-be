/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import { uploadResume } from '../upload/upload.controller';
import {
  getOpenJobs,
  getAllJobsAdmin,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from './careers.controller';

const router = Router();

router.route('/jobs')
  .get(getOpenJobs)
  .post(protect, verifyAdmin, createJob);

router.route('/jobs/admin')
  .get(protect, verifyAdmin, getAllJobsAdmin);

router.route('/jobs/:id')
  .patch(protect, verifyAdmin, updateJob)
  .delete(protect, verifyAdmin, deleteJob);

router.route('/apply')
  .post(uploadResume, applyForJob);

router.route('/applications')
  .get(protect, verifyAdmin, getAllApplications);

router.route('/applications/:id')
  .delete(protect, verifyAdmin, deleteApplication);

router.route('/applications/:id/status')
  .patch(protect, verifyAdmin, updateApplicationStatus);

export default router;
