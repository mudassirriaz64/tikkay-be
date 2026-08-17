import { Router } from 'express';
import { protect, verifyAdmin } from '../../middleware/auth.middleware';
import { uploadFile, uploadSingle } from './upload.controller';

const router = Router();

router.post(
  '/',
  protect,
  verifyAdmin,
  uploadSingle,
  uploadFile,
);

export default router;
