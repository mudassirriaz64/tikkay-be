"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journeyPosts = exports.milestones = exports.stats = exports.updatePageConfig = exports.getPageConfig = exports.updateFounder = exports.getFounder = exports.getAboutPageData = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const about_model_1 = require("./about.model");
const FOUNDER_ID = 'founder-details';
const PAGE_CONFIG_ID = 'about-page-config';
const getOrCreateFounder = async () => {
    let founder = await about_model_1.FounderDetails.findById(FOUNDER_ID);
    if (!founder) {
        founder = new about_model_1.FounderDetails({
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
const getOrCreatePageConfig = async () => {
    let config = await about_model_1.AboutPageConfig.findById(PAGE_CONFIG_ID);
    if (!config) {
        config = new about_model_1.AboutPageConfig({ _id: PAGE_CONFIG_ID });
        await config.save();
    }
    return config;
};
exports.getAboutPageData = (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
    const [pageConfig, founder, stats, journeyPosts, milestones] = await Promise.all([
        getOrCreatePageConfig(),
        getOrCreateFounder(),
        about_model_1.StatItem.find().sort({ display_order: 1 }),
        about_model_1.JourneyPostModel.find().sort({ display_order: 1, day_number: 1 }),
        about_model_1.MilestoneStat.find().sort({ display_order: 1 }),
    ]);
    const pageData = {
        hero: pageConfig.hero,
        founder,
        stats,
        journeyPosts,
        milestones,
    };
    res.status(200).json(new ApiResponse_1.ApiResponse(200, pageData, 'About page data fetched successfully'));
});
exports.getFounder = (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
    const founder = await getOrCreateFounder();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, founder, 'Founder details fetched'));
});
exports.updateFounder = (0, asyncHandler_1.asyncHandler)(async function (req, res) {
    let founder = await about_model_1.FounderDetails.findById(FOUNDER_ID);
    if (!founder) {
        founder = new about_model_1.FounderDetails({ _id: FOUNDER_ID, ...req.body });
        await founder.save();
    }
    else {
        Object.assign(founder, req.body);
        await founder.save();
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, founder, 'Founder details updated successfully'));
});
exports.getPageConfig = (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
    const config = await getOrCreatePageConfig();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, config, 'About page config fetched'));
});
exports.updatePageConfig = (0, asyncHandler_1.asyncHandler)(async function (req, res) {
    const config = await about_model_1.AboutPageConfig.findByIdAndUpdate(PAGE_CONFIG_ID, req.body, {
        new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, config, 'About page config updated'));
});
exports.stats = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await about_model_1.StatItem.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Stat Item fetched successfully'));
    }),
    saveAll: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const rawStats = Array.isArray(req.body) ? req.body : req.body.stats || [];
        await about_model_1.StatItem.deleteMany({});
        const itemsToInsert = rawStats.map((s, idx) => ({
            value: s.value || '0',
            label: s.label || '',
            display_order: idx + 1,
        }));
        const created = await about_model_1.StatItem.insertMany(itemsToInsert);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, created, 'Stats saved successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.StatItem.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Stat Item created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.StatItem.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Stat Item not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Stat Item fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.StatItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Stat Item not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Stat Item updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.StatItem.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Stat Item not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Stat Item deleted successfully'));
    }),
};
exports.milestones = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await about_model_1.MilestoneStat.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Milestone fetched successfully'));
    }),
    saveAll: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const rawMilestones = Array.isArray(req.body) ? req.body : req.body.milestones || [];
        await about_model_1.MilestoneStat.deleteMany({});
        const itemsToInsert = rawMilestones.map((m, idx) => ({
            number: m.number || '0',
            label: m.label || '',
            display_order: idx + 1,
        }));
        const created = await about_model_1.MilestoneStat.insertMany(itemsToInsert);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, created, 'Milestones saved successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.MilestoneStat.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Milestone created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.MilestoneStat.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Milestone not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Milestone fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.MilestoneStat.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Milestone not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Milestone updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.MilestoneStat.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Milestone not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Milestone deleted successfully'));
    }),
};
exports.journeyPosts = {
    getAll: (0, asyncHandler_1.asyncHandler)(async function (_req, res) {
        const items = await about_model_1.JourneyPostModel.find().sort({ display_order: 1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, items, 'Journey Post fetched successfully'));
    }),
    create: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.JourneyPostModel.create(req.body);
        res.status(201).json(new ApiResponse_1.ApiResponse(201, item, 'Journey Post created successfully'));
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.JourneyPostModel.findById(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Journey Post not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Journey Post fetched successfully'));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.JourneyPostModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!item)
            throw new ApiError_1.ApiError(404, 'Journey Post not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, item, 'Journey Post updated successfully'));
    }),
    delete: (0, asyncHandler_1.asyncHandler)(async function (req, res) {
        const item = await about_model_1.JourneyPostModel.findByIdAndDelete(req.params.id);
        if (!item)
            throw new ApiError_1.ApiError(404, 'Journey Post not found');
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Journey Post deleted successfully'));
    }),
};
//# sourceMappingURL=about.controller.js.map