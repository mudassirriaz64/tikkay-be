/// <reference types="express" />
import { Router } from 'express';
import { verifyAdmin, protect } from '../../middleware/auth.middleware';
import { getSettings, updateSettings } from './settings.controller';

const router = Router();

router.route('/')
  .get(getSettings)
  .patch(protect, verifyAdmin, updateSettings);

export default router;
