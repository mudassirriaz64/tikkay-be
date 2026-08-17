import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import {
  FounderDetails,
  StatItem,
  MilestoneStat,
  JourneyPostModel,
  AboutPageConfig,
} from './about.model';
import { AuthRequest } from '../../middleware/auth.middleware';

const FOUNDER_ID = 'founder-details';
const PAGE_CONFIG_ID = 'about-page-config';

const getOrCreateFounder = async (): Promise<any> => {
  let founder = await FounderDetails.findById(FOUNDER_ID);
  if (!founder) {
    founder = new FounderDetails({
      _id: FOUNDER_ID,
      portraitUrl: '/images/our_legacy.png',
      quote: "The grill doesn't lie. It reveals the soul of the spice. Once the charcoal catches, there are no shortcuts.",
      quoteAuthor: 'Ahmed Raza',
      quoteRole: 'Founder & Pitmaster',
      eyebrow: 'The Visionary',
      title: 'Meet Ahmed',
      bio: "Ahmed Raza started Tikkay Shikkay with a simple obsession: to preserve the authentic, raw heat of ancestral Pakistani street BBQ.",
      caption: 'Ahmed Raza, 2024',
      mission: 'Serve honest, fire-grilled food that feels handcrafted from the first bite to the last, without compromise.',
      vision: "To be Pakistan's benchmark for fire-grilled flavor, where ancestral methods meet modern consistency.",
    });
    await founder.save();
  }
  return founder;
};

const getOrCreatePageConfig = async (): Promise<any> => {
  let config = await AboutPageConfig.findById(PAGE_CONFIG_ID);
  if (!config) {
    config = new AboutPageConfig({ _id: PAGE_CONFIG_ID });
    await config.save();
  }
  return config;
};

export const getAboutPageData = asyncHandler(async function (_req: Request, res: Response) {
  const [pageConfig, founder, stats, journeyPosts, milestones] = await Promise.all([
    getOrCreatePageConfig(),
    getOrCreateFounder(),
    StatItem.find().sort({ display_order: 1 }),
    JourneyPostModel.find().sort({ display_order: 1, day_number: 1 }),
    MilestoneStat.find().sort({ display_order: 1 }),
  ]);

  const pageData = {
    hero: pageConfig.hero,
    founder,
    stats,
    journeyPosts,
    milestones,
  };

  res.status(200).json(new ApiResponse(200, pageData, 'About page data fetched successfully'));
});

export const getFounder = asyncHandler(async function (_req: AuthRequest, res: Response) {
  const founder = await getOrCreateFounder();
  res.status(200).json(new ApiResponse(200, founder, 'Founder details fetched'));
});

export const updateFounder = asyncHandler(async function (req: AuthRequest, res: Response) {
  const founder = await FounderDetails.findByIdAndUpdate(FOUNDER_ID, req.body, {
    new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true,
  });
  res.status(200).json(new ApiResponse(200, founder, 'Founder details updated'));
});

export const getPageConfig = asyncHandler(async function (_req: AuthRequest, res: Response) {
  const config = await getOrCreatePageConfig();
  res.status(200).json(new ApiResponse(200, config, 'About page config fetched'));
});

export const updatePageConfig = asyncHandler(async function (req: AuthRequest, res: Response) {
  const config = await AboutPageConfig.findByIdAndUpdate(PAGE_CONFIG_ID, req.body, {
    new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true,
  });
  res.status(200).json(new ApiResponse(200, config, 'About page config updated'));
});

export const stats = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await StatItem.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Stat Item fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await StatItem.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Stat Item created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await StatItem.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Stat Item not found');
    res.status(200).json(new ApiResponse(200, item, 'Stat Item fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await StatItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Stat Item not found');
    res.status(200).json(new ApiResponse(200, item, 'Stat Item updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await StatItem.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Stat Item not found');
    res.status(200).json(new ApiResponse(200, {}, 'Stat Item deleted successfully'));
  }),
};

export const milestones = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await MilestoneStat.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Milestone fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await MilestoneStat.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Milestone created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await MilestoneStat.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Milestone not found');
    res.status(200).json(new ApiResponse(200, item, 'Milestone fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await MilestoneStat.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Milestone not found');
    res.status(200).json(new ApiResponse(200, item, 'Milestone updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await MilestoneStat.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Milestone not found');
    res.status(200).json(new ApiResponse(200, {}, 'Milestone deleted successfully'));
  }),
};

export const journeyPosts = {
  getAll: asyncHandler(async function (_req: Request, res: Response) {
    const items = await JourneyPostModel.find().sort({ display_order: 1 });
    res.status(200).json(new ApiResponse(200, items, 'Journey Post fetched successfully'));
  }),
  create: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await JourneyPostModel.create(req.body);
    res.status(201).json(new ApiResponse(201, item, 'Journey Post created successfully'));
  }),
  getById: asyncHandler(async function (req: Request, res: Response) {
    const item = await JourneyPostModel.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Journey Post not found');
    res.status(200).json(new ApiResponse(200, item, 'Journey Post fetched successfully'));
  }),
  update: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await JourneyPostModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Journey Post not found');
    res.status(200).json(new ApiResponse(200, item, 'Journey Post updated successfully'));
  }),
  delete: asyncHandler(async function (req: AuthRequest, res: Response) {
    const item = await JourneyPostModel.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Journey Post not found');
    res.status(200).json(new ApiResponse(200, {}, 'Journey Post deleted successfully'));
  }),
};
