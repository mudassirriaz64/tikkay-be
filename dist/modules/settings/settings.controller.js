import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { SiteSettings } from './settings.model';
const getOrCreateSettings = async () => {
    let settings = await SiteSettings.findOne({});
    if (!settings) {
        settings = new SiteSettings({});
        await settings.save();
    }
    return settings;
};
export const getSettings = asyncHandler(async (_req, res) => {
    const settings = await getOrCreateSettings();
    res
        .status(200)
        .json(new ApiResponse(200, settings, 'Site settings fetched successfully'));
});
export const updateSettings = asyncHandler(async (req, res) => {
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
//# sourceMappingURL=settings.controller.js.map