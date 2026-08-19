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

export const addToFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { itemId, toggle } = req.body as { itemId?: string; toggle?: boolean };

  if (!itemId || !Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, 'Valid itemId is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const objectId = new Types.ObjectId(itemId);
  const exists = user.favorites.some((id) => id.toString() === itemId);

  if (toggle) {
    user.favorites = exists
      ? user.favorites.filter((id) => id.toString() !== itemId)
      : [...user.favorites, objectId];
  } else if (!exists) {
    user.favorites.push(objectId);
  }

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user.favorites.map((id) => id.toString()), 'Favorites updated successfully'));
});

export const getFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, user.favorites.map((id) => id.toString()), 'Favorites fetched successfully'));
});

const toAccountReview = (review: any) => ({
  id: review._id.toString(),
  dish: review.favorite_meal || '',
  rating: review.rating,
  review_text: review.review_text,
  created_at: review.createdAt,
  is_approved: review.is_approved,
});

export const getMyReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { CustomerReview } = await import('../reviews/reviews.model');
  const reviews = await CustomerReview.find({ user_id: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, reviews.map(toAccountReview), 'My reviews fetched successfully'));
});

export const joinLoyalty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { birthday, whatsapp_opt_in } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.is_loyalty_member = true;
  if (!user.loyalty_joined_at) {
    user.loyalty_joined_at = new Date().toISOString();
  }
  if (birthday) {
    user.birthday = birthday;
  }
  if (whatsapp_opt_in !== undefined) {
    user.whatsapp_opt_in = Boolean(whatsapp_opt_in);
  }

  await user.save();

  // WhatsApp VIP community invite link
  const whatsappCommunityUrl = 'https://chat.whatsapp.com/TikkayShikkayGrillFamVIP';

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        whatsapp_community_url: whatsappCommunityUrl,
      },
      'Successfully joined the Tikkay Shikkay Loyalty Club'
    )
  );
});

export const getLoyaltyStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        is_loyalty_member: Boolean(user.is_loyalty_member),
        loyalty_points: user.loyalty_points || 0,
        loyalty_joined_at: user.loyalty_joined_at,
        birthday: user.birthday || '',
        whatsapp_opt_in: Boolean(user.whatsapp_opt_in),
        whatsapp_community_url: 'https://chat.whatsapp.com/TikkayShikkayGrillFamVIP',
      },
      'Loyalty status fetched successfully'
    )
  );
});

export const getLoyaltyCount = asyncHandler(async (_req: Request, res: Response) => {
  const memberCount = await User.countDocuments({ is_loyalty_member: true });
  // Base offset of real loyal community members + live database members
  const totalDisplayCount = 12470 + memberCount;

  res.status(200).json(
    new ApiResponse(
      200,
      { count: totalDisplayCount, rawCount: memberCount },
      'Loyalty member count fetched successfully'
    )
  );
});

export const getAccountsPageData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const [user, orders, reviews, menuItems] = await Promise.all([
    User.findById(userId),
    import('../orders/orders.model').then(({ Order }) =>
      Order.find({ user_id: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(10)
    ),
    import('../reviews/reviews.model').then(({ CustomerReview }) =>
      CustomerReview.find({ user_id: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(20)
    ),
    import('../menu/models/item.model').then(({ MenuItem }) => MenuItem.find()),
  ]);

  const pageData = {
    demoProfile: user,
    orders,
    reviews: reviews.map(toAccountReview),
    menuItems,
  };

  res
    .status(200)
    .json(new ApiResponse(200, pageData, 'Accounts page data fetched successfully'));
});

