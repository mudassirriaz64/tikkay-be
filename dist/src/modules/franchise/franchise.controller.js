"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFranchiseInquiry = exports.updateFranchiseStatus = exports.getAllFranchiseInquiries = exports.createFranchiseInquiry = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const franchise_model_1 = require("./franchise.model");
exports.createFranchiseInquiry = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { full_name, email, phone, target_city, proposed_location = '', investment_budget, experience_summary = '', timeline = '1-3 months', } = req.body;
    if (!full_name || !email || !phone || !target_city || !investment_budget) {
        throw new ApiError_1.ApiError(400, 'Missing required applicant details or investment budget');
    }
    const inquiry = await franchise_model_1.FranchiseInquiry.create({
        full_name,
        email,
        phone,
        target_city,
        proposed_location,
        investment_budget,
        experience_summary,
        timeline,
        status: 'pending',
    });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, inquiry, 'Franchise inquiry submitted successfully'));
});
exports.getAllFranchiseInquiries = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, target_city } = req.query;
    const filter = {};
    if (status && typeof status === 'string' && status !== 'all') {
        filter.status = status;
    }
    if (target_city && typeof target_city === 'string' && target_city !== 'all') {
        filter.target_city = new RegExp(target_city, 'i');
    }
    const inquiries = await franchise_model_1.FranchiseInquiry.find(filter).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, inquiries, 'Franchise inquiries fetched successfully'));
});
exports.updateFranchiseStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'reviewed', 'contacted', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.ApiError(400, 'Invalid franchise inquiry status');
    }
    const inquiry = await franchise_model_1.FranchiseInquiry.findById(id);
    if (!inquiry) {
        throw new ApiError_1.ApiError(404, 'Franchise inquiry not found');
    }
    inquiry.status = status;
    if (notes !== undefined)
        inquiry.notes = notes;
    await inquiry.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, inquiry, 'Franchise inquiry status updated successfully'));
});
exports.deleteFranchiseInquiry = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const inquiry = await franchise_model_1.FranchiseInquiry.findByIdAndDelete(id);
    if (!inquiry) {
        throw new ApiError_1.ApiError(404, 'Franchise inquiry not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, 'Franchise inquiry permanently deleted'));
});
//# sourceMappingURL=franchise.controller.js.map