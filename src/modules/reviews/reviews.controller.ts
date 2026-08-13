import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import {
  CustomerReview,
  Statistic,
  VideoReview,
  ReviewsPageConfig,
} from './reviews.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import { GalleryImage } from '../gallery/gallery.model';

const getOrCreatePageConfig = async (): Promise<any> => {
  let config = await ReviewsPageConfig.findOne({});
  if (!config) {
    config = new ReviewsPageConfig({});
    await config.save();
  }
  return config;
};

export const getReviewsPageData = asyncHandler(async (_req: Request, res: Response) => {
  const [pageConfig, statistics, approvedReviews, videoReviews, galleryImages] = await Promise.all([
    getOrCreatePageConfig(),
    Statistic.find().sort({ display_order: 1 }),
    CustomerReview.find({ is_approved: true }).sort({ display_order: 1, createdAt: -1 }),
    VideoReview.find().sort({ display_order: 1 }),
    GalleryImage.find().sort({ createdAt: -1 }).limit(12),
  ]);

  const featured = approvedReviews.find((r) => r.display_section === 'featured') || approvedReviews[0];
  const highlights = approvedReviews.filter((r) => r.display_section === 'highlights').slice(0, 3);
  const reviews = approvedReviews.filter((r) => r !== featured && !highlights.includes(r));

  const pageData = {
    hero: pageConfig.hero,
    statistics,
    categories: pageConfig.categories,
    featured: featured || null,
    highlights,
    reviews,
    videos: videoReviews,
    gallery: galleryImages,
    cta: pageConfig.cta,
  };

  res
    .status(200)
    .json(new ApiResponse(200, pageData, 'Reviews page data fetched successfully'));
});

export const getPendingReviews = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const reviews = await CustomerReview.find({ is_approved: false })
    .sort({ createdAt: -1 })
    .populate('user_id', 'name email');

  res
    .status(200)
    .json(new ApiResponse(200, reviews, 'Pending reviews fetched successfully'));
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await CustomerReview.create({
    ...req.body,
    is_approved: false,
  });

  res
    .status(201)
    .json(new ApiResponse(201, review, 'Review submitted for approval'));
});

export const approveReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const review = await CustomerReview.findByIdAndUpdate(
    id,
    { is_approved: true },
    { new: true }
  );

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, review, 'Review approved successfully'));
});

export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const review = await CustomerReview.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, review, 'Review updated successfully'));
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const review = await CustomerReview.findByIdAndDelete(id);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'Review deleted successfully'));
});

export const getStatistics = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await Statistic.find().sort({ display_order: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, stats, 'Statistics fetched successfully'));
});

export const createStatistic = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stat = await Statistic.create(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, stat, 'Statistic created successfully'));
});

export const updateStatistic = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const stat = await Statistic.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!stat) {
    throw new ApiError(404, 'Statistic not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, stat, 'Statistic updated successfully'));
});

export const deleteStatistic = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const stat = await Statistic.findByIdAndDelete(id);

  if (!stat) {
    throw new ApiError(404, 'Statistic not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'Statistic deleted successfully'));
});

export const getVideoReviews = asyncHandler(async (_req: Request, res: Response) => {
  const videos = await VideoReview.find().sort({ display_order: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, videos, 'Video reviews fetched successfully'));
});

export const createVideoReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const video = await VideoReview.create(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, video, 'Video review created successfully'));
});

export const updateVideoReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const video = await VideoReview.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!video) {
    throw new ApiError(404, 'Video review not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, 'Video review updated successfully'));
});

export const deleteVideoReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const video = await VideoReview.findByIdAndDelete(id);

  if (!video) {
    throw new ApiError(404, 'Video review not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'Video review deleted successfully'));
});

export const getPageConfig = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const config = await getOrCreatePageConfig();

  res
    .status(200)
    .json(new ApiResponse(200, config, 'Reviews page config fetched successfully'));
});

export const updatePageConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
  const config = await getOrCreatePageConfig();
  Object.assign(config, req.body);
  await config.save();

  res
    .status(200)
    .json(new ApiResponse(200, config, 'Reviews page config updated successfully'));
});
