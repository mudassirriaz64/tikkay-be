import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { SiteSettings, ISiteSettings } from './settings.model';
import { AuthRequest } from '../../middleware/auth.middleware';

const getOrCreateSettings = async (): Promise<any> => {
  let settings = await SiteSettings.findOne({});
  if (!settings) {
    settings = new SiteSettings({});
    await settings.save();
  }
  return settings;
};

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getOrCreateSettings();

  res
    .status(200)
    .json(new ApiResponse(200, settings, 'Site settings fetched successfully'));
});

export const updateSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  const settings = await getOrCreateSettings();
  Object.assign(settings, updateData);
  await settings.save();

  if (!settings) {
    throw new ApiError(500, 'Failed to update settings');
  }

  res
    .status(200)
    .json(new ApiResponse(200, settings, 'Site settings updated successfully'));
});
