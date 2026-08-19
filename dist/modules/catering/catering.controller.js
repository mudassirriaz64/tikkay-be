"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCateringStatus = exports.getAllCateringRequests = exports.getMyCateringRequests = exports.checkAvailability = exports.createCateringRequest = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catering_model_1 = require("./catering.model");
const mongoose_1 = require("mongoose");
exports.createCateringRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user_id, event_type, guest_count, event_date, event_time = '19:00', package_tier = 'royal-bbq-feast', selected_items = [], contact_name, contact_email, contact_phone, event_location, special_instructions = '', estimated_total = 0, is_live_tandoor_requested = false, } = req.body;
    if (!event_type || !guest_count || !event_date || !contact_name || !contact_phone || !event_location) {
        throw new ApiError_1.ApiError(400, 'Missing required event or contact details');
    }
    if (Number(guest_count) < 10) {
        throw new ApiError_1.ApiError(400, 'Minimum guest count for catering is 10 persons');
    }
    // Resolve user_id from session token, body, or matching user record
    let resolvedUserId;
    if (req.user?._id && mongoose_1.Types.ObjectId.isValid(req.user._id)) {
        resolvedUserId = new mongoose_1.Types.ObjectId(req.user._id);
    }
    else if (user_id && mongoose_1.Types.ObjectId.isValid(user_id)) {
        resolvedUserId = new mongoose_1.Types.ObjectId(user_id);
    }
    const catering = await catering_model_1.CateringRequest.create({
        user_id: resolvedUserId,
        event_type,
        guest_count: Number(guest_count),
        event_date,
        event_time,
        package_tier,
        selected_items,
        contact_name,
        contact_email: contact_email || req.user?.email || 'guest@tikkay.com',
        contact_phone,
        event_location,
        special_instructions,
        estimated_total: Number(estimated_total),
        is_live_tandoor_requested: Boolean(is_live_tandoor_requested),
        status: 'inquiry',
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, catering, 'Catering request submitted successfully'));
});
exports.checkAvailability = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
        throw new ApiError_1.ApiError(400, 'Event date query parameter is required');
    }
    // Count active catering bookings on this date
    const activeBookings = await catering_model_1.CateringRequest.countDocuments({
        event_date: date,
        status: { $in: ['inquiry', 'under-review', 'confirmed'] },
    });
    const maxSlotsPerDay = 4;
    const isAvailable = activeBookings < maxSlotsPerDay;
    const remainingSlots = Math.max(0, maxSlotsPerDay - activeBookings);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        date,
        is_available: isAvailable,
        remaining_slots: remainingSlots,
        booking_load: activeBookings >= 3 ? 'heavy' : activeBookings >= 1 ? 'moderate' : 'open',
    }, 'Availability checked successfully'));
});
exports.getMyCateringRequests = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const userEmail = req.user?.email?.toLowerCase();
    // Find bookings either explicitly linked to user_id OR matching the user's registered email
    const query = [{ user_id: new mongoose_1.Types.ObjectId(userId) }];
    if (userEmail) {
        query.push({ contact_email: userEmail });
    }
    const requests = await catering_model_1.CateringRequest.find({ $or: query }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, requests, 'Your catering bookings fetched successfully'));
});
exports.getAllCateringRequests = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, event_type, limit = 50 } = req.query;
    const filter = {};
    if (status && typeof status === 'string' && status !== 'all') {
        filter.status = status;
    }
    if (event_type && typeof event_type === 'string' && event_type !== 'all') {
        filter.event_type = event_type;
    }
    const requests = await catering_model_1.CateringRequest.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit));
    res.status(200).json(new ApiResponse_1.ApiResponse(200, requests, 'All catering requests fetched successfully'));
});
exports.updateCateringStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status, coordinator_notes } = req.body;
    const validStatuses = ['inquiry', 'under-review', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.ApiError(400, 'Invalid catering status');
    }
    const catering = await catering_model_1.CateringRequest.findById(id);
    if (!catering) {
        throw new ApiError_1.ApiError(404, 'Catering request not found');
    }
    catering.status = status;
    if (coordinator_notes !== undefined) {
        catering.coordinator_notes = coordinator_notes;
    }
    await catering.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, catering, 'Catering status updated successfully'));
});
//# sourceMappingURL=catering.controller.js.map