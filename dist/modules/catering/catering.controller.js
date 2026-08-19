import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { CateringRequest } from './catering.model';
import { Types } from 'mongoose';
export const createCateringRequest = asyncHandler(async (req, res) => {
    const { user_id, event_type, guest_count, event_date, event_time = '19:00', package_tier = 'royal-bbq-feast', selected_items = [], contact_name, contact_email, contact_phone, event_location, special_instructions = '', estimated_total = 0, is_live_tandoor_requested = false, } = req.body;
    if (!event_type || !guest_count || !event_date || !contact_name || !contact_phone || !event_location) {
        throw new ApiError(400, 'Missing required event or contact details');
    }
    if (Number(guest_count) < 10) {
        throw new ApiError(400, 'Minimum guest count for catering is 10 persons');
    }
    // Resolve user_id from session token, body, or matching user record
    let resolvedUserId;
    if (req.user?._id && Types.ObjectId.isValid(req.user._id)) {
        resolvedUserId = new Types.ObjectId(req.user._id);
    }
    else if (user_id && Types.ObjectId.isValid(user_id)) {
        resolvedUserId = new Types.ObjectId(user_id);
    }
    const catering = await CateringRequest.create({
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
    res.status(201).json(new ApiResponse(201, catering, 'Catering request submitted successfully'));
});
export const checkAvailability = asyncHandler(async (req, res) => {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
        throw new ApiError(400, 'Event date query parameter is required');
    }
    // Count active catering bookings on this date
    const activeBookings = await CateringRequest.countDocuments({
        event_date: date,
        status: { $in: ['inquiry', 'under-review', 'confirmed'] },
    });
    const maxSlotsPerDay = 4;
    const isAvailable = activeBookings < maxSlotsPerDay;
    const remainingSlots = Math.max(0, maxSlotsPerDay - activeBookings);
    res.status(200).json(new ApiResponse(200, {
        date,
        is_available: isAvailable,
        remaining_slots: remainingSlots,
        booking_load: activeBookings >= 3 ? 'heavy' : activeBookings >= 1 ? 'moderate' : 'open',
    }, 'Availability checked successfully'));
});
export const getMyCateringRequests = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userEmail = req.user?.email?.toLowerCase();
    // Find bookings either explicitly linked to user_id OR matching the user's registered email
    const query = [{ user_id: new Types.ObjectId(userId) }];
    if (userEmail) {
        query.push({ contact_email: userEmail });
    }
    const requests = await CateringRequest.find({ $or: query }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, requests, 'Your catering bookings fetched successfully'));
});
export const getAllCateringRequests = asyncHandler(async (req, res) => {
    const { status, event_type, limit = 50 } = req.query;
    const filter = {};
    if (status && typeof status === 'string' && status !== 'all') {
        filter.status = status;
    }
    if (event_type && typeof event_type === 'string' && event_type !== 'all') {
        filter.event_type = event_type;
    }
    const requests = await CateringRequest.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit));
    res.status(200).json(new ApiResponse(200, requests, 'All catering requests fetched successfully'));
});
export const updateCateringStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, coordinator_notes } = req.body;
    const validStatuses = ['inquiry', 'under-review', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid catering status');
    }
    const catering = await CateringRequest.findById(id);
    if (!catering) {
        throw new ApiError(404, 'Catering request not found');
    }
    catering.status = status;
    if (coordinator_notes !== undefined) {
        catering.coordinator_notes = coordinator_notes;
    }
    await catering.save();
    res.status(200).json(new ApiResponse(200, catering, 'Catering status updated successfully'));
});
//# sourceMappingURL=catering.controller.js.map