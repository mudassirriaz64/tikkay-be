import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { BlogPost } from './blog.model';
import { AuthRequest } from '../../middleware/auth.middleware';

const INITIAL_STORIES = [
  {
    slug: 'how-we-make-our-masala',
    title: 'How We Make Our Masala: The 14-Spice Ancestral Roast',
    excerpt:
      'We never use store-bought powders. Discover how whole cumin, star anise, black cardamom, and Kashmiri chilies are slow-toasted over iron tawas each dawn.',
    content: `At Tikkay Shikkay, our flavor starts long before the charcoal is lit. Every morning at 6:00 AM, our master spice mixer measures whole coriander seeds, wild cumin, green cardamom, black peppercorns, cloves, mace, cinnamon bark, and dried red chilies onto heavy cast-iron tawas.\n\n### The Science of the Dry Roast\nDry roasting isn't just about heat; it's about waking up the volatile essential oils locked inside each spice seed. When the cumin starts to smoke lightly and turn amber, it releases an earthy, nutty compound that gives our Seekh Kababs and Malai Tikka their signature depth.\n\n### Stone Ground, Never High-Speed Pulverized\nHigh-speed commercial blade grinders generate excess heat that burns away delicate aromatics. We slowly stone-grind our toasted spices in micro-batches, preserving the fragrant bouquet that hits your nose the moment a sizzling platter arrives at your table.\n\n### The Secret Ingredient: Time\nOnce ground, our masala blend rests with Himalayan pink salt and roasted dried fenugreek leaves (Kasuri Methi) for 24 hours to marry the aromatics before it touches a single skewer of meat.`,
    author: 'Head Pitmaster Tariq',
    publishedAt: '2026-08-18',
    imageUrl: '/images/hero_image.png',
    category: 'Spices & Masala',
    readTime: '4 min',
    tags: ['Masala', 'Spices', 'Ancestral Craft', 'Technique'],
    is_published: true,
  },
  {
    slug: 'difference-between-tikka-and-boti',
    title: 'Difference Between Tikka and Boti: The Anatomy of Cut & Flame',
    excerpt:
      'Tikka vs Boti: Is it just the bone, or something deeper? An in-depth culinary comparison of meat cuts, yogurt marination times, and skewering physics.',
    content: `While both are crowned kings of South Asian charcoal grilling, **Tikka** and **Boti** are fundamentally distinct culinary experiences crafted with different cuts, marinades, and fire techniques.\n\n### 1. The Cut & Bone Structure\n- **Tikka:** Traditionally uses bone-in poultry or larger bone-cut meat (such as chicken breast quarters or leg thigh joints). The bone conducts heat inward, keeping the interior tender while developing an intense exterior crust.\n- **Boti:** Features bite-sized, boneless cubes precisely trimmed from select cuts (boneless chicken breast, tender beef fillet, or mutton leg). Every edge is uniformly exposed to charcoal radiation.\n\n### 2. Marinade Chemistry\n- **Tikka Marinade:** Relies on a heavier, hung-curd yogurt base enriched with mustard oil, roasted gram flour (besan), and crushed ginger-garlic paste. This thick paste clings to the meat, creating the iconic blistered tikka char.\n- **Boti Marinade:** Uses raw papaya pulp (kachri powder) or lemon juice for deep enzymatic tenderization, allowing spices to soak deep into the center of each cube without masking the natural sweetness of the meat.\n\n### 3. Skewer & Grilling Style\nBoti requires thin square iron skewers turned rapidly over glowing embers to prevent drying out, whereas Tikka sits over wide flat skewers cooked slowly at higher charcoal distance for an even, juicy interior.`,
    author: 'Chef Adeel',
    publishedAt: '2026-08-16',
    imageUrl: '/images/hero_image.png',
    category: 'Culinary Differences',
    readTime: '5 min',
    tags: ['Tikka', 'Boti', 'Food Guide', 'BBQ Basics'],
    is_published: true,
  },
  {
    slug: 'bbq-tips-charcoal-heat-mastery',
    title: 'Master Pitmaster BBQ Tips: Charcoal Heat Zones & Smoke Control',
    excerpt:
      'Turn your backyard barbecue into restaurant-grade grilling with these 5 essential rules of charcoal management, basting timing, and meat resting.',
    content: `Grilling exceptional BBQ isn't about blasting raw heat — it's about mastering heat zones and understanding how fat interacts with wood embers.\n\n### Rule 1: Always Build a Two-Zone Fire\nNever spread charcoal evenly across your entire pit. Bank 70% of your glowing coals on one side (the Sear Zone) and leave 30% on the other (the Gentle Roast Zone). This allows you to sear skewers for color, then slide them to the gentle side to finish cooking through without charring.\n\n### Rule 2: Wait for White Ash Embers\nNever put meat over black charcoal or active flames. Black coals produce bitter creosote soot. Wait until all coals are covered in a fine layer of white-grey ash and glowing deep red beneath.\n\n### Rule 3: The 80% Basting Rule\nDo not baste your skewers with ghee or butter at the start of cooking. Butter will drip, ignite flare-ups, and coat the raw marinade in soot. Baste only when meat reaches 80% doneness to glaze and lock in moisture.\n\n### Rule 4: Rest Your Skewers\nPulling meat straight from the skewer onto a plate causes natural juices to flood out. Let skewers rest on warm bread or a wooden board for 3 minutes so muscle fibers relax and reabsorb flavor.`,
    author: 'Tikkay Shikkay Pitmasters',
    publishedAt: '2026-08-14',
    imageUrl: '/images/hero_image.png',
    category: 'BBQ Tips',
    readTime: '6 min',
    tags: ['BBQ Tips', 'Grilling', 'Pitmaster', 'Pro Secrets'],
    is_published: true,
  },
  {
    slug: 'healthy-grilling-high-protein-clean-bbq',
    title: 'Healthy Grilling: High-Protein, Lean Cuts & Clean Fire Feasting',
    excerpt:
      'Why authentic charcoal BBQ is one of the healthiest culinary traditions in the world. High-protein macros, zero trans fats, and clean marinades.',
    content: `Charcoal grilling is often associated with indulgence, but when done with ancestral techniques, it is one of the cleanest, nutrient-dense cooking methods available.\n\n### High Protein, Minimal Added Fats\nUnlike deep-fried curries and oil-laden gravies, our Chicken Boti, Beef Seekh, and Fish Tikka allow excess animal fats to drip away during the grilling process, leaving pure, high-protein lean meat.\n\n### Natural Anti-Inflammatory Marinades\nOur marinades are packed with raw garlic (allicin), fresh ginger (gingerol), turmeric (curcumin), and crushed black pepper. These superfood ingredients tenderize naturally without sodium-heavy artificial flavor enhancers or preservatives.\n\n### Maximizing Nutrition from the Grill\nPairing grilled meats with our fresh mint raita (probiotics) and crisp kachumber salad (vitamin C and fiber) creates a perfectly balanced, low-carb meal designed for fitness enthusiasts and healthy lifestyle seekers.`,
    author: 'Nutrition & Culinary Team',
    publishedAt: '2026-08-12',
    imageUrl: '/images/hero_image.png',
    category: 'Healthy Grilling',
    readTime: '4 min',
    tags: ['Healthy Grilling', 'High Protein', 'Diet & Nutrition', 'Clean Eating'],
    is_published: true,
  },
];

async function ensureSeedPosts() {
  const count = await BlogPost.countDocuments();
  if (count === 0) {
    await BlogPost.insertMany(INITIAL_STORIES);
  }
}

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  await ensureSeedPosts();

  const { category, search, tag, include_unpublished } = req.query;
  const filter: Record<string, any> = {};

  if (!include_unpublished) {
    filter.is_published = true;
  }

  if (category && typeof category === 'string' && category !== 'all') {
    filter.category = new RegExp(category, 'i');
  }

  if (tag && typeof tag === 'string') {
    filter.tags = tag;
  }

  if (search && typeof search === 'string') {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const posts = await BlogPost.find(filter).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      { posts, total: posts.length },
      'Blog posts fetched successfully'
    )
  );
});

export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  await ensureSeedPosts();
  const { slug } = req.params;
  const post = await BlogPost.findOne({ slug });

  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }

  res.status(200).json(new ApiResponse(200, post, 'Blog post fetched successfully'));
});

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, excerpt, content, category, author, imageUrl, readTime, tags, is_published } = req.body;

  if (!title || !excerpt || !content || !category) {
    throw new ApiError(400, 'Title, excerpt, content, and category are required');
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existing = await BlogPost.findOne({ slug });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const post = await BlogPost.create({
    slug: finalSlug,
    title,
    excerpt,
    content,
    category,
    author: author || 'Tikkay Shikkay Team',
    imageUrl: imageUrl || '/images/hero_image.png',
    readTime: readTime || '5 min',
    tags: Array.isArray(tags) ? tags : [],
    publishedAt: new Date().toISOString().slice(0, 10),
    is_published: is_published !== undefined ? Boolean(is_published) : true,
  });

  res.status(201).json(new ApiResponse(201, post, 'Blog story created successfully'));
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const post = await BlogPost.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!post) {
    throw new ApiError(404, 'Blog story not found');
  }

  res.status(200).json(new ApiResponse(200, post, 'Blog story updated successfully'));
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const post = await BlogPost.findByIdAndDelete(id);

  if (!post) {
    throw new ApiError(404, 'Blog story not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Blog story deleted successfully'));
});
