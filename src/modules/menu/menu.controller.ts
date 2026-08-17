import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { MenuCategory } from './models/category.model';
import { MenuItem, IMenuItem } from './models/item.model';
import { MenuPageConfig } from './models/pageConfig.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Types } from 'mongoose';
import { generateSlug } from '../../utils/slug';

const PAGE_CONFIG_ID = 'menu-page-config';

const getOrCreatePageConfig = async (): Promise<any> => {
  let config = await MenuPageConfig.findById(PAGE_CONFIG_ID);
  if (!config) {
    config = new MenuPageConfig({ _id: PAGE_CONFIG_ID });
    await config.save();
  }
  return config;
};

export const getMenuPageData = asyncHandler(async (_req: Request, res: Response) => {
  const [categories, items, pageConfig] = await Promise.all([
    MenuCategory.find().sort({ display_order: 1, name: 1 }),
    MenuItem.find().sort({ display_order: 1, price: 1 }),
    getOrCreatePageConfig(),
  ]);

  const tikkaCategory = categories.find(
    (c) => c.slug === 'tikka' || c.name.toLowerCase().includes('tikka')
  );

  const featuredItems = items.filter(
    (item) => item.display_section === 'featured' || item.is_bestseller
  );

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
        .map((id: string) => items.find((item: IMenuItem) => item._id.toString() === id))
        .filter((item: IMenuItem | undefined) => !!item) as IMenuItem[]
    : botiItems.slice(1);

  // Generate tabs dynamically directly from MongoDB categories
  const dynamicCategoryTabs = categories.map((cat) => ({
    id: `tab-${cat.slug || cat._id.toString()}`,
    label: cat.name,
    sectionId: cat.slug || cat._id.toString(),
  }));

  // Build full dynamic tab list: Featured Picks + Dynamic Categories from MongoDB + Platters
  const dynamicTabs = [
    { id: 'tab-featured', label: 'Featured Picks', sectionId: 'featured-picks' },
    ...dynamicCategoryTabs,
    { id: 'tab-platters', label: 'Build Platter', sectionId: 'platters' },
  ];

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
    .json(new ApiResponse(200, pageData, 'Menu data fetched successfully'));
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await MenuCategory.find().sort({ display_order: 1, name: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = { ...req.body };
  if (!data.slug && data.name) {
    let baseSlug = generateSlug(data.name);
    let candidate = baseSlug;
    let count = 1;
    while (await MenuCategory.findOne({ slug: candidate })) {
      candidate = `${baseSlug}-${count++}`;
    }
    data.slug = candidate;
  }
  const category = await MenuCategory.create(data);

  res
    .status(201)
    .json(new ApiResponse(201, category, 'Category created successfully'));
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (!data.slug && data.name) {
    let baseSlug = generateSlug(data.name);
    let candidate = baseSlug;
    let count = 1;
    while (await MenuCategory.findOne({ slug: candidate, _id: { $ne: id } })) {
      candidate = `${baseSlug}-${count++}`;
    }
    data.slug = candidate;
  }
  const category = await MenuCategory.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const itemsInCategory = await MenuItem.countDocuments({ category_id: new Types.ObjectId(id) });
  if (itemsInCategory > 0) {
    throw new ApiError(400, 'Cannot delete category with menu items. Reassign items first.');
  }

  const category = await MenuCategory.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'Category deleted successfully'));
});

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const { category_id, available, bestseller, section } = req.query;

  const filter: Record<string, any> = {};
  if (category_id) filter.category_id = new Types.ObjectId(category_id as string);
  if (available === 'true') filter.is_available = true;
  if (available === 'false') filter.is_available = false;
  if (bestseller === 'true') filter.is_bestseller = true;
  if (section) filter.display_section = section;

  const items = await MenuItem.find(filter)
    .sort({ display_order: 1, price: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, items, 'Menu items fetched successfully'));
});

export const getMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await MenuItem.findById(id);

  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, item, 'Menu item fetched successfully'));
});

export const createMenuItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = { ...req.body };
  if (!data.slug && data.title) {
    let baseSlug = generateSlug(data.title);
    let candidate = baseSlug;
    let count = 1;
    while (await MenuItem.findOne({ slug: candidate })) {
      candidate = `${baseSlug}-${count++}`;
    }
    data.slug = candidate;
  }
  const item = await MenuItem.create(data);

  res
    .status(201)
    .json(new ApiResponse(201, item, 'Menu item created successfully'));
});

export const updateMenuItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (!data.slug && data.title) {
    let baseSlug = generateSlug(data.title);
    let candidate = baseSlug;
    let count = 1;
    while (await MenuItem.findOne({ slug: candidate, _id: { $ne: id } })) {
      candidate = `${baseSlug}-${count++}`;
    }
    data.slug = candidate;
  }
  const item = await MenuItem.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, item, 'Menu item updated successfully'));
});

export const deleteMenuItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const item = await MenuItem.findByIdAndDelete(id);

  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'Menu item deleted successfully'));
});

export const getPageConfig = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const config = await getOrCreatePageConfig();

  res
    .status(200)
    .json(new ApiResponse(200, config, 'Menu page config fetched successfully'));
});

export const updatePageConfig = asyncHandler(async (req: AuthRequest, res: Response) => {
  const config = await MenuPageConfig.findByIdAndUpdate(
    PAGE_CONFIG_ID,
    req.body,
    { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, config, 'Menu page config updated successfully'));
});
