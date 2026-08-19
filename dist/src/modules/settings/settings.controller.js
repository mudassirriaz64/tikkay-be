"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const settings_model_1 = require("./settings.model");
const getOrCreateSettings = async () => {
    let settings = await settings_model_1.SiteSettings.findOne({});
    if (!settings) {
        settings = new settings_model_1.SiteSettings({});
        await settings.save();
    }
    return settings;
};
exports.getSettings = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const settings = await getOrCreateSettings();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, settings, 'Site settings fetched successfully'));
});
exports.updateSettings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const updateData = {
        ...req.body,
        updated_at: new Date().toISOString(),
    };
    const settings = await getOrCreateSettings();
    Object.assign(settings, updateData);
    await settings.save();
    if (!settings) {
        throw new ApiError_1.ApiError(500, 'Failed to update settings');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, settings, 'Site settings updated successfully'));
});
//# sourceMappingURL=settings.controller.js.map