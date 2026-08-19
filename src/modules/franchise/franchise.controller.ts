import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { FranchiseInquiry, FranchiseStatus } from './franchise.model';
import { AuthRequest } from '../../middleware/auth.middleware';

export const createFranchiseInquiry = asyncHandler(async (req: Request, res: Response) => {
  const {
    full_name,
    email,
    phone,
    target_city,
    proposed_location = '',
    investment_budget,
    experience_summary = '',
    timeline = '1-3 months',
  } = req.body;

  if (!full_name || !email || !phone || !target_city || !investment_budget) {
    throw new ApiError(400, 'Missing required applicant details or investment budget');
  }

  const inquiry = await FranchiseInquiry.create({
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

  res.status(201).json(new ApiResponse(201, inquiry, 'Franchise inquiry submitted successfully'));
});

export const getAllFranchiseInquiries = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, target_city } = req.query;
  const filter: Record<string, any> = {};

  if (status && typeof status === 'string' && status !== 'all') {
    filter.status = status;
  }
  if (target_city && typeof target_city === 'string' && target_city !== 'all') {
    filter.target_city = new RegExp(target_city, 'i');
  }

  const inquiries = await FranchiseInquiry.find(filter).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, inquiries, 'Franchise inquiries fetched successfully'));
});

export const updateFranchiseStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body as { status: FranchiseStatus; notes?: string };

  const validStatuses: FranchiseStatus[] = ['pending', 'reviewed', 'contacted', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid franchise inquiry status');
  }

  const inquiry = await FranchiseInquiry.findById(id);
  if (!inquiry) {
    throw new ApiError(404, 'Franchise inquiry not found');
  }

  inquiry.status = status;
  if (notes !== undefined) inquiry.notes = notes;
  await inquiry.save();

  res.status(200).json(new ApiResponse(200, inquiry, 'Franchise inquiry status updated successfully'));
});

export const deleteFranchiseInquiry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const inquiry = await FranchiseInquiry.findByIdAndDelete(id);

  if (!inquiry) {
    throw new ApiError(404, 'Franchise inquiry not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Franchise inquiry permanently deleted'));
});
