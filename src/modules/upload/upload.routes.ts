import { Router } from 'express';
import { protect, verifyAdmin } from '../../middleware/auth.middleware';
import {
  uploadFile,
  uploadSingle,
  uploadVideoVPS,
  uploadVideoDisk,
  generateVideoSignature,
  getVideoUploadConfig,
} from './upload.controller';

const router = Router();

router.get('/video-config', getVideoUploadConfig);

router.post(
  '/video-signature',
  protect,
  verifyAdmin,
  generateVideoSignature
);

router.post(
  '/video',
  protect,
  verifyAdmin,
  uploadVideoDisk,
  uploadVideoVPS
);

router.post(
  '/',
  protect,
  verifyAdmin,
  uploadSingle,
  uploadFile
);

export default router;
