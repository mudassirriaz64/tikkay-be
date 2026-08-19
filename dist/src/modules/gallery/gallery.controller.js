"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journeyMilestones = exports.kitchenProcesses = exports.customerStories = exports.googleReviews = exports.instagram = exports.videos = exports.galleryImages = exports.updatePageConfig = exports.getPageConfig = exports.getGalleryPageData = void 0;
const cloudinary_1 = require("cloudinary");
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const gallery_model_1 = require("./gallery.model");
const PAGE_CONFIG_ID = 'gallery-page-config';
const getOrCreatePageConfig = async () => {
    let config = await gallery_model_1.GalleryPageConfig.findById(PAGE_CONFIG_ID);
    if (!config) {
        config = new gallery_model_1.GalleryPageConfig({ _id: PAGE_CONFIG_ID });
        await config.save();
    }
    return config;
};
exports.getGalleryPageData = (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
    const [pageConfig, videos, instagram, googleReviews, stories, kitchen, journey, gallery] = await Promise.all([
        getOrCreatePageConfig(),
        gallery_model_1.VideoTestimonial.find().sort({ display_order: 1 }),
        gallery_model_1.InstagramPost.find().sort({ display_order: 1 }),
        gallery_model_1.GoogleReview.find().sort({ display_order: 1, createdAt: -1 }),
        gallery_model_1.CustomerStory.find().sort({ display_order: 1 }),
        gallery_model_1.KitchenProcess.find().sort({ step: 1, display_order: 1 }),
        gallery_model_1.JourneyMilestone.find().sort({ year: 1, display_order: 1 }),
        gallery_model_1.GalleryImage.find().sort({ display_order: 1, createdAt: -1 }),
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, pageData, 'Gallery page data fetched successfully'));
});
exports.getPageConfig = (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
    const config = await getOrCreatePageConfig();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, config, 'Gallery page config fetched'));
});
exports.updatePageConfig = (0, asyncHandler_1.asyncHandler)(async function (req, res) {
    const config = await gallery_model_1.GalleryPageConfig.findByIdAndUpdate(PAGE_CONFIG_ID, req.body, {
        new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, config, 'Gallery page config updated'));
});
exports.galleryImages = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await gallery_model_1.GalleryImage.find().sort({ display_order: 1, createdAt: -1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Gallery Image fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GalleryImage.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Gallery Image created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GalleryImage.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Gallery Image not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Gallery Image fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Gallery Image not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Gallery Image updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GalleryImage.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Gallery Image not found');
        // Clean up Cloudinary assets if present
        if (item.image_public_id) {
            try {
                await cloudinary_1.v2.uploader.destroy(item.image_public_id, { resource_type: 'image' });
            }
            catch {
                /* ignore image cleanup error */
            }
        }
        if (item.video_public_id) {
            try {
                await cloudinary_1.v2.uploader.destroy(item.video_public_id, { resource_type: 'video' });
            }
            catch {
                /* ignore video cleanup error */
            }
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Gallery Image deleted successfully'));
    }),
};
exports.videos = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await gallery_model_1.VideoTestimonial.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Video Testimonial fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.VideoTestimonial.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Video Testimonial created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.VideoTestimonial.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Video Testimonial not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Video Testimonial fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.VideoTestimonial.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Video Testimonial not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Video Testimonial updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.VideoTestimonial.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Video Testimonial not found');
        // Clean up Cloudinary assets if present
        if (item.video_public_id) {
            try {
                await cloudinary_1.v2.uploader.destroy(item.video_public_id, { resource_type: 'video' });
            }
            catch {
                /* ignore cloudinary cleanup error */
            }
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Video Testimonial deleted successfully'));
    }),
};
exports.instagram = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await gallery_model_1.InstagramPost.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Instagram Post fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.InstagramPost.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Instagram Post created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.InstagramPost.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Instagram Post not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Instagram Post fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.InstagramPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Instagram Post not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Instagram Post updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.InstagramPost.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Instagram Post not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Instagram Post deleted successfully'));
    }),
};
exports.googleReviews = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await gallery_model_1.GoogleReview.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Google Review fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GoogleReview.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Google Review created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GoogleReview.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Google Review not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Google Review fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GoogleReview.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Google Review not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Google Review updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.GoogleReview.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Google Review not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Google Review deleted successfully'));
    }),
};
exports.customerStories = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await gallery_model_1.CustomerStory.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Customer Story fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.CustomerStory.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Customer Story created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.CustomerStory.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Customer Story not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Customer Story fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.CustomerStory.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Customer Story not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Customer Story updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.CustomerStory.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Customer Story not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Customer Story deleted successfully'));
    }),
};
exports.kitchenProcesses = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await gallery_model_1.KitchenProcess.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Kitchen Process fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.KitchenProcess.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Kitchen Process created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.KitchenProcess.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Kitchen Process not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Kitchen Process fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.KitchenProcess.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Kitchen Process not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Kitchen Process updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.KitchenProcess.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Kitchen Process not found');
        if (item.image_public_id) {
            try {
                await cloudinary_1.v2.uploader.destroy(item.image_public_id);
            }
            catch {
                /* ignore */
            }
        }
        if (item.video_public_id) {
            try {
                await cloudinary_1.v2.uploader.destroy(item.video_public_id, { resource_type: 'video' });
            }
            catch {
                /* ignore */
            }
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Kitchen Process deleted successfully'));
    }),
};
exports.journeyMilestones = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await gallery_model_1.JourneyMilestone.find().sort({ year: 1, display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Journey Milestone fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.JourneyMilestone.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Journey Milestone created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.JourneyMilestone.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Journey Milestone not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Journey Milestone fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.JourneyMilestone.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Journey Milestone not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Journey Milestone updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await gallery_model_1.JourneyMilestone.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Journey Milestone not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Journey Milestone deleted successfully'));
    }),
};
//# sourceMappingURL=gallery.controller.js.map