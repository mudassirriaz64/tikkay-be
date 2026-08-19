"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePageConfig = exports.getPageConfig = exports.deleteMenuItem = exports.updateMenuItem = exports.createMenuItem = exports.getMenuItem = exports.getMenuItems = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = exports.getMenuPageData = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const category_model_1 = require("./models/category.model");
const item_model_1 = require("./models/item.model");
const pageConfig_model_1 = require("./models/pageConfig.model");
const mongoose_1 = require("mongoose");
const slug_1 = require("../../utils/slug");
const PAGE_CONFIG_ID = 'menu-page-config';
const getOrCreatePageConfig = async () => {
    let config = await pageConfig_model_1.MenuPageConfig.findById(PAGE_CONFIG_ID);
    if (!config) {
        config = new pageConfig_model_1.MenuPageConfig({ _id: PAGE_CONFIG_ID });
        await config.save();
    }
    return config;
};
exports.getMenuPageData = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [categories, items, pageConfig] = await Promise.all([
        category_model_1.MenuCategory.find().sort({ display_order: 1, name: 1 }),
        item_model_1.MenuItem.find().sort({ display_order: 1, price: 1 }),
        getOrCreatePageConfig(),
    ]);
    const tikkaCategory = categories.find((c) => c.slug === 'tikka' || c.name.toLowerCase().includes('tikka'));
    const featuredItems = items.filter((item) => item.display_section === 'featured' || item.is_bestseller);
    const tikkaItems = tikkaCategory
        ? items.filter((item) => item.category_id.toString() === tikkaCategory._id.toString())
        : items.filter((item) => item.title.toLowerCase().includes('tikka'));
    const botiItems = items.filter((item) => item.display_section === 'boti');
    const sideItems = items.filter((item) => item.display_section === 'sides' || item.is_signature);
    const boti_featured = pageConfig.boti_featured_item_id
        ? botiItems.find((item) => item._id.toString() === pageConfig.boti_featured_item_id) || botiItems[0]
        : botiItems[0];
    const boti_compact = pageConfig.boti_compact_ids.length > 0
        ? pageConfig.boti_compact_ids
            .map((id) => items.find((item) => item._id.toString() === id))
            .filter((item) => !!item)
        : botiItems.slice(1);
    // Generate tabs dynamically directly from MongoDB categories
    const dynamicCategoryTabs = categories.map((cat) => ({
        id: `tab-${cat.slug || cat._id.toString()}`,
        label: cat.name,
        sectionId: cat.slug || cat._id.toString(),
    }));
    // Build full dynamic tab list: Featured Picks + Dynamic Categories from MongoDB
    const rawTabs = [
        { id: 'tab-featured', label: 'Featured Picks', sectionId: 'featured-picks' },
        ...dynamicCategoryTabs,
        { id: 'tab-platters', label: 'Build Platter', sectionId: 'platters' },
    ];
    // Deduplicate tabs by unique id & sectionId
    const seenIds = new Set();
    const seenSections = new Set();
    const dynamicTabs = rawTabs.filter((tab) => {
        if (seenIds.has(tab.id) || seenSections.has(tab.sectionId)) {
            return false;
        }
        seenIds.add(tab.id);
        seenSections.add(tab.sectionId);
        return true;
    });
    const pageData = {
        categories,
        items,
        tabs: dynamicTabs,
        featured: featuredItems,
        tikka: tikkaItems,
        platter: pageConfig.platter,
        boti: {
            featured: boti_featured || null,
            compact: boti_compact,
        },
        sides: sideItems,
    };
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, pageData, 'Menu data fetched successfully'));
});
exports.getCategories = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const categories = await category_model_1.MenuCategory.find().sort({ display_order: 1, name: 1 });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, categories, 'Categories fetched successfully'));
});
exports.createCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (!data.slug && data.name) {
        let baseSlug = (0, slug_1.generateSlug)(data.name);
        let candidate = baseSlug;
        let count = 1;
        while (await category_model_1.MenuCategory.findOne({ slug: candidate })) {
            candidate = `${baseSlug}-${count++}`;
        }
        data.slug = candidate;
    }
    const category = await category_model_1.MenuCategory.create(data);
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, category, 'Category created successfully'));
});
exports.updateCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    if (!data.slug && data.name) {
        let baseSlug = (0, slug_1.generateSlug)(data.name);
        let candidate = baseSlug;
        let count = 1;
        while (await category_model_1.MenuCategory.findOne({ slug: candidate, _id: { $ne: id } })) {
            candidate = `${baseSlug}-${count++}`;
        }
        data.slug = candidate;
    }
    const category = await category_model_1.MenuCategory.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!category) {
        throw new ApiError_1.ApiError(404, 'Category not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, category, 'Category updated successfully'));
});
exports.deleteCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const itemsInCategory = await item_model_1.MenuItem.countDocuments({ category_id: new mongoose_1.Types.ObjectId(id) });
    if (itemsInCategory > 0) {
        throw new ApiError_1.ApiError(400, 'Cannot delete category with menu items. Reassign items first.');
    }
    const category = await category_model_1.MenuCategory.findByIdAndDelete(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, 'Category not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'Category deleted successfully'));
});
exports.getMenuItems = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { category_id, available, bestseller, section } = req.query;
    const filter = {};
    if (category_id)
        filter.category_id = new mongoose_1.Types.ObjectId(category_id);
    if (available === 'true')
        filter.is_available = true;
    if (available === 'false')
        filter.is_available = false;
    if (bestseller === 'true')
        filter.is_bestseller = true;
    if (section)
        filter.display_section = section;
    const items = await item_model_1.MenuItem.find(filter)
        .sort({ display_order: 1, price: 1 });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, items, 'Menu items fetched successfully'));
});
exports.getMenuItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const item = await item_model_1.MenuItem.findById(id);
    if (!item) {
        throw new ApiError_1.ApiError(404, 'Menu item not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, item, 'Menu item fetched successfully'));
});
exports.createMenuItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    // Resolve category_id if provided as a slug or invalid ObjectId
    if (data.category_id && !mongoose_1.Types.ObjectId.isValid(data.category_id)) {
        const matchedCategory = await category_model_1.MenuCategory.findOne({
            $or: [{ slug: data.category_id }, { name: new RegExp(`^${data.category_id}$`, 'i') }],
        });
        if (matchedCategory) {
            data.category_id = matchedCategory._id;
        }
        else {
            // If no category found, fallback to first available or create
            const firstCat = await category_model_1.MenuCategory.findOne();
            if (firstCat)
                data.category_id = firstCat._id;
        }
    }
    if (!data.slug && data.title) {
        let baseSlug = (0, slug_1.generateSlug)(data.title);
        let candidate = baseSlug;
        let count = 1;
        while (await item_model_1.MenuItem.findOne({ slug: candidate })) {
            candidate = `${baseSlug}-${count++}`;
        }
        data.slug = candidate;
    }
    const item = await item_model_1.MenuItem.create(data);
    res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, item, 'Menu item created successfully'));
});
exports.updateMenuItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    // Resolve category_id if provided as a slug or invalid ObjectId
    if (data.category_id && !mongoose_1.Types.ObjectId.isValid(data.category_id)) {
        const matchedCategory = await category_model_1.MenuCategory.findOne({
            $or: [{ slug: data.category_id }, { name: new RegExp(`^${data.category_id}$`, 'i') }],
        });
        if (matchedCategory) {
            data.category_id = matchedCategory._id;
        }
    }
    if (!data.slug && data.title) {
        let baseSlug = (0, slug_1.generateSlug)(data.title);
        let candidate = baseSlug;
        let count = 1;
        while (await item_model_1.MenuItem.findOne({ slug: candidate, _id: { $ne: id } })) {
            candidate = `${baseSlug}-${count++}`;
        }
        data.slug = candidate;
    }
    const item = await item_model_1.MenuItem.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!item) {
        throw new ApiError_1.ApiError(404, 'Menu item not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, item, 'Menu item updated successfully'));
});
exports.deleteMenuItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const item = await item_model_1.MenuItem.findByIdAndDelete(id);
    if (!item) {
        throw new ApiError_1.ApiError(404, 'Menu item not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'Menu item deleted successfully'));
});
exports.getPageConfig = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const config = await getOrCreatePageConfig();
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, config, 'Menu page config fetched successfully'));
});
exports.updatePageConfig = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const config = await pageConfig_model_1.MenuPageConfig.findByIdAndUpdate(PAGE_CONFIG_ID, req.body, { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true });
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, config, 'Menu page config updated successfully'));
});
//# sourceMappingURL=menu.controller.js.map