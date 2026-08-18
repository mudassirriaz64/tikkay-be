import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import {
  GalleryImage,
  VideoTestimonial,
  InstagramPost,
  GoogleReview,
  CustomerStory,
  KitchenProcess,
  JourneyMilestone,
  GalleryPageConfig,
} from './gallery.model';
import { AuthRequest } from '../../middleware/auth.middleware';

const PAGE_CONFIG_ID = 'gallery-page-config';

const getOrCreatePageConfig = async (): Promise<any> => {
  let config = await GalleryPageConfig.findById(PAGE_CONFIG_ID);
  if (!config) {
    config = new GalleryPageConfig({ _id: PAGE_CONFIG_ID });
    await config.save();
  }
  return config;
};

export const getGalleryPageData = asyncHandler(async function (_req: Request, res: Response) {
  const [pageConfig, videos, instagram, googleReviews, stories, kitchen, journey, gallery] = await Promise.all([
    getOrCreatePageConfig(),
    VideoTestimonial.find().sort({ display_order: 1 }),
    InstagramPost.find().sort({ display_order: 1 }),
    GoogleReview.find().sort({ display_order: 1, createdAt: -1 }),
    CustomerStory.find().sort({ display_order: 1 }),
    KitchenProcess.find().sort({ step: 1, display_order: 1 }),
    JourneyMilestone.find().sort({ year: 1, display_order: 1 }),
    GalleryImage.find().sort({ display_order: 1, createdAt: -1 }),
  ]);

  const pageData = {
    hero: pageConfig.hero,
    tabs: pageConfig.tabs,
    videos,
    instagram,
    googleReviews,
    stories,
    kitchen,
    journey,
    gallery,
    galleryCategories: pageConfig.galleryCategories,
    cta: pageConfig.cta,
  };

  res.status(200).json(new ApiResponse(200, pageData, 'Gallery page data fetched successfully'));
});

export const getPageConfig = asyncHandler(async function (_req: AuthRequest, res: Response) {
  const config = await getOrCreatePageConfig();
  res.status(200).json(new ApiResponse(200, config, 'Gallery page config fetched'));
});

export const updatePageConfig = asyncHandler(async function (req: AuthRequest, res: Response) {
  const config = await GalleryPageConfig.findByIdAndUpdate(PAGE_CONFIG_ID, req.body, {
    new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true,
  });
  res.status(200).json(new ApiResponse(200, config, 'Gallery page config updated'));
});

export const galleryImages = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await GalleryImage.find().sort({ display_order: 1, createdAt: -1 });
    res.status(200).json(new ApiResponse(200, items, 'Gallery Image fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await GalleryImage.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Gallery Image created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await GalleryImage.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Gallery Image not found');
    res.status(200).json(new ApiResponse(200, item, 'Gallery Image fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Gallery Image not found');
    res.status(200).json(new ApiResponse(200, item, 'Gallery Image updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Gallery Image not found');

    // Clean up Cloudinary assets if present
    if (item.image_public_id) {
      try {
        await cloudinary.uploader.destroy(item.image_public_id, { resource_type: 'image' });
      } catch {
        /* ignore image cleanup error */
      }
    }
    if (item.video_public_id) {
      try {
        await cloudinary.uploader.destroy(item.video_public_id, { resource_type: 'video' });
      } catch {
        /* ignore video cleanup error */
      }
    }

    res.status(200).json(new ApiResponse(200, {}, 'Gallery Image deleted successfully'));
  }),
};

export const videos = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await VideoTestimonial.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Video Testimonial fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await VideoTestimonial.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Video Testimonial created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await VideoTestimonial.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Video Testimonial not found');
    res.status(200).json(new ApiResponse(200, item, 'Video Testimonial fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await VideoTestimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Video Testimonial not found');
    res.status(200).json(new ApiResponse(200, item, 'Video Testimonial updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await VideoTestimonial.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Video Testimonial not found');

    // Clean up Cloudinary assets if present
    if (item.video_public_id) {
      try {
        await cloudinary.uploader.destroy(item.video_public_id, { resource_type: 'video' });
      } catch {
        /* ignore cloudinary cleanup error */
      }
    }

    res.status(200).json(new ApiResponse(200, {}, 'Video Testimonial deleted successfully'));
  }),
};

export const instagram = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await InstagramPost.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Instagram Post fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await InstagramPost.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Instagram Post created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await InstagramPost.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Instagram Post not found');
    res.status(200).json(new ApiResponse(200, item, 'Instagram Post fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await InstagramPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Instagram Post not found');
    res.status(200).json(new ApiResponse(200, item, 'Instagram Post updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await InstagramPost.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Instagram Post not found');
    res.status(200).json(new ApiResponse(200, {}, 'Instagram Post deleted successfully'));
  }),
};

export const googleReviews = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await GoogleReview.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Google Review fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await GoogleReview.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Google Review created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await GoogleReview.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Google Review not found');
    res.status(200).json(new ApiResponse(200, item, 'Google Review fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await GoogleReview.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Google Review not found');
    res.status(200).json(new ApiResponse(200, item, 'Google Review updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await GoogleReview.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Google Review not found');
    res.status(200).json(new ApiResponse(200, {}, 'Google Review deleted successfully'));
  }),
};

export const customerStories = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await CustomerStory.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Customer Story fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await CustomerStory.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Customer Story created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await CustomerStory.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Customer Story not found');
    res.status(200).json(new ApiResponse(200, item, 'Customer Story fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await CustomerStory.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Customer Story not found');
    res.status(200).json(new ApiResponse(200, item, 'Customer Story updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await CustomerStory.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Customer Story not found');
    res.status(200).json(new ApiResponse(200, {}, 'Customer Story deleted successfully'));
  }),
};

export const kitchenProcesses = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await KitchenProcess.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Kitchen Process fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await KitchenProcess.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Kitchen Process created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await KitchenProcess.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Kitchen Process not found');
    res.status(200).json(new ApiResponse(200, item, 'Kitchen Process fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await KitchenProcess.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Kitchen Process not found');
    res.status(200).json(new ApiResponse(200, item, 'Kitchen Process updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await KitchenProcess.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Kitchen Process not found');

    if (item.image_public_id) {
      try {
        await cloudinary.uploader.destroy(item.image_public_id);
      } catch {
        /* ignore */
      }
    }
    if (item.video_public_id) {
      try {
        await cloudinary.uploader.destroy(item.video_public_id, { resource_type: 'video' });
      } catch {
        /* ignore */
      }
    }

    res.status(200).json(new ApiResponse(200, {}, 'Kitchen Process deleted successfully'));
  }),
};

export const journeyMilestones = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await JourneyMilestone.find().sort({ year: 1, display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Journey Milestone fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await JourneyMilestone.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Journey Milestone created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await JourneyMilestone.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Journey Milestone not found');
    res.status(200).json(new ApiResponse(200, item, 'Journey Milestone fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await JourneyMilestone.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Journey Milestone not found');
    res.status(200).json(new ApiResponse(200, item, 'Journey Milestone updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await JourneyMilestone.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Journey Milestone not found');
    res.status(200).json(new ApiResponse(200, {}, 'Journey Milestone deleted successfully'));
  }),
};
