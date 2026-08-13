import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { User } from '../auth/auth.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Types } from 'mongoose';

type KnownBodyKeys = 'name' | 'phone' | 'address';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const updateData: Record<string, any> = {};

  const allowedFields: KnownBodyKeys[] = ['name', 'phone', 'address'];
  for (const field of allowedFields) {
    if ((req.body as Record<string, any>)[field] !== undefined) {
      updateData[field] = (req.body as Record<string, any>)[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, users, 'Users fetched successfully'));
});

export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, 'User role updated successfully'));
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (id === req.user!._id) {
    throw new ApiError(400, 'Cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'User deleted successfully'));
});

export const addToFavorites = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.status(200).json(new ApiResponse(200, { message: 'Added to favorites' }, 'Favorites feature placeholder'));
});

export const getFavorites = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.status(200).json(new ApiResponse(200, [], 'Favorites feature placeholder'));
});

export const getMyReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { CustomerReview } = await import('../reviews/reviews.model');
  const reviews = await CustomerReview.find({ user_id: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, reviews, 'My reviews fetched successfully'));
});

export const getAccountsPageData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const [user, orders] = await Promise.all([
    User.findById(userId),
    import('../orders/orders.model').then(({ Order }) =>
      Order.find({ user_id: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(10)
    ),
  ]);

  const pageData = {
    demoProfile: user,
    orders,
    reviews: [],
    menuItems: [],
  };

  res
    .status(200)
    .json(new ApiResponse(200, pageData, 'Accounts page data fetched successfully'));
});
