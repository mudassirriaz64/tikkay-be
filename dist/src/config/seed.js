"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./db");
const auth_model_1 = require("../modules/auth/auth.model");
const settings_model_1 = require("../modules/settings/settings.model");
const category_model_1 = require("../modules/menu/models/category.model");
const item_model_1 = require("../modules/menu/models/item.model");
const pageConfig_model_1 = require("../modules/menu/models/pageConfig.model");
const reviews_model_1 = require("../modules/reviews/reviews.model");
const gallery_model_1 = require("../modules/gallery/gallery.model");
const contact_model_1 = require("../modules/contact/contact.model");
const about_model_1 = require("../modules/about/about.model");
const mongoose_2 = require("mongoose");
const DEFAULT_SETTINGS_ID = 'default-settings';
const MENU_PAGE_CONFIG_ID = 'menu-page-config';
const REVIEWS_PAGE_CONFIG_ID = 'reviews-page-config';
const GALLERY_PAGE_CONFIG_ID = 'gallery-page-config';
const CONTACT_PAGE_CONFIG_ID = 'contact-page-config';
const FOUNDER_ID = 'founder-details';
const ABOUT_PAGE_CONFIG_ID = 'about-page-config';
const log = (msg) => console.log(`\x1b[36m  → ${msg}\x1b[0m`);
const success = (msg) => console.log(`\x1b[32m  ✓ ${msg}\x1b[0m`);
const error = (msg) => console.log(`\x1b[31m  ✗ ${msg}\x1b[0m`);
const seed = async () => {
    console.log('\n\x1b[35m═══════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[35m   🌱 TIKKAY SHIKKAY - DATABASE SEED 🌱\x1b[0m');
    console.log('\x1b[35m═══════════════════════════════════════════════\x1b[0m\n');
    try {
        await (0, db_1.connectDB)();
        log('Clearing existing collections...');
        const collections = mongoose_1.default.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        success('Collections cleared');
        console.log('');
        log('Seeding Users...');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@tikkay.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const userEmail = process.env.USER_EMAIL || 'user@tikkay.com';
        const userPassword = process.env.USER_PASSWORD || 'User@123';
        await auth_model_1.User.create([
            {
                _id: new mongoose_2.Types.ObjectId('000000000000000000000001'),
                name: 'Ahmed Raza',
                email: adminEmail,
                phone: '+92 300 1234567',
                address: 'Tikkay Shikkay HQ, Lahore',
                password: adminPassword,
                role: 'admin',
                memberSince: '2024-01-01',
            },
            {
                _id: new mongoose_2.Types.ObjectId('000000000000000000000002'),
                name: 'Demo User',
                email: userEmail,
                phone: '+92 300 9876543',
                address: '123 Main Street, Gulberg, Lahore',
                password: userPassword,
                role: 'user',
                memberSince: '2024-06-15',
            },
        ]);
        success(`Users seeded (${adminEmail} / ${userEmail})`);
        console.log('');
        log('Seeding Site Settings...');
        await settings_model_1.SiteSettings.create([
            {
                _id: DEFAULT_SETTINGS_ID,
                hero_title: 'Fire-Grilled. Fresh Daily. Made With Pride.',
                hero_subtitle: 'Experience the raw, untamed flavor of Pakistani street BBQ. No shortcuts, no gas grills - just pure charcoal heat and ancestral spice blends.',
                hero_media_url: '/images/hero_image.png',
                live_cam_active: false,
                fresh_batch_count: 124,
                updated_at: new Date().toISOString(),
            },
        ]);
        success('Site Settings seeded');
        console.log('');
        log('Seeding Menu Categories...');
        const categories = await category_model_1.MenuCategory.create([
            { _id: new mongoose_2.Types.ObjectId('100000000000000000000001'), name: 'Tikka', slug: 'tikka', display_order: 1 },
            { _id: new mongoose_2.Types.ObjectId('100000000000000000000002'), name: 'Boti', slug: 'boti', display_order: 2 },
            { _id: new mongoose_2.Types.ObjectId('100000000000000000000003'), name: 'Platters', slug: 'platters', display_order: 3 },
            { _id: new mongoose_2.Types.ObjectId('100000000000000000000004'), name: 'Sides', slug: 'sides', display_order: 4 },
            { _id: new mongoose_2.Types.ObjectId('100000000000000000000005'), name: 'Drinks', slug: 'drinks', display_order: 5 },
        ]);
        success(`Menu Categories seeded (${categories.length})`);
        log('Seeding Menu Items...');
        const menuItems = await item_model_1.MenuItem.create([
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000001'),
                category_id: categories[0]._id, title: 'Reshmi Tikka', slug: 'reshmi-tikka',
                description: 'Velvety smooth chicken morsels in a rich, cream-kissed marinade.',
                price: 850, spice_level: 'Mild', is_bestseller: true, is_available: true,
                image_url: '/images/menu/reshmi-tikka.jpg', display_section: 'featured',
                ribbon: "Chef's Choice", tags: ['Signature', 'Creamy'], display_order: 1,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000002'),
                category_id: categories[0]._id, title: 'Malai Tikka', slug: 'malai-tikka',
                description: 'Tender chicken chunks marinated in creamy yogurt and mild spices.',
                price: 890, spice_level: 'Mild', is_bestseller: true, is_available: true,
                image_url: '/images/menu/malai-tikka.jpg', display_section: 'featured',
                tags: ['Creamy', 'Popular'], display_order: 2,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000003'),
                category_id: categories[0]._id, title: 'Green Chili Tikka', slug: 'green-chili-tikka',
                description: 'Fiery chicken tikka infused with fresh green chilies and herbs.',
                price: 920, spice_level: 'Hot', is_bestseller: false, is_available: true,
                image_url: '/images/menu/green-chili-tikka.jpg', display_section: 'regular', display_order: 3,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000004'),
                category_id: categories[1]._id, title: 'Bharli Boti', slug: 'bharli-boti',
                description: 'Smoky, charred, and lacquered with our signature spice blend.',
                price: 1320, spice_level: 'Hot', is_bestseller: true, is_available: true,
                image_url: '/images/menu/bharli-boti.jpg', display_section: 'boti',
                ribbon: 'Legendary', tags: ['Signature', 'Smoky'], display_order: 1,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000005'),
                category_id: categories[1]._id, title: 'Kaleji Boti', slug: 'kaleji-boti',
                description: 'Tender liver bites in a bold, aromatic spice coating.',
                price: 1150, spice_level: 'Medium', is_bestseller: false, is_available: true,
                image_url: '/images/menu/kaleji-boti.jpg', display_section: 'boti', display_order: 2,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000006'),
                category_id: categories[1]._id, title: 'Beef Behari Boti', slug: 'beef-behari-boti',
                description: 'Slow-marinated beef boti with authentic Bihari spice infusion.',
                price: 1450, spice_level: 'Extra Spicy', is_bestseller: false, is_available: true,
                image_url: '/images/menu/grill-mix.jpg', display_section: 'boti', display_order: 3,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000007'),
                category_id: categories[2]._id, title: 'The Grand Feast', slug: 'the-grand-feast',
                description: 'A crowd-pleasing spread built for generous tables and hungry nights.',
                price: 4500, spice_level: 'Medium', is_bestseller: false, is_available: true,
                image_url: '/images/menu/platter-biryani.jpg', display_section: 'featured',
                tags: ['Family Pack', 'Value'], display_order: 1,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000008'),
                category_id: categories[3]._id, title: 'Garlic Naan', slug: 'garlic-naan',
                description: 'Freshly baked naan brushed with garlic butter and herbs.',
                price: 120, spice_level: 'Mild', is_bestseller: true, is_available: true,
                image_url: '/images/menu/garlic-naan.jpg', display_section: 'sides', is_signature: true, display_order: 1,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000009'),
                category_id: categories[3]._id, title: 'Kachumber Salad', slug: 'kachumber-salad',
                description: 'Fresh onions, tomatoes, cucumbers with zesty lemon dressing.',
                price: 180, spice_level: 'Mild', is_bestseller: false, is_available: true,
                image_url: '/images/menu/kachumber-salad.jpg', display_section: 'sides', display_order: 2,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000010'),
                category_id: categories[3]._id, title: 'Dip Trilogy', slug: 'dip-trilogy',
                description: 'Three signature dips: Mint Raita, Chutney, and Spicy Mayo.',
                price: 260, spice_level: 'Medium', is_bestseller: false, is_available: true,
                image_url: '/images/menu/dip-trilogy.jpg', display_section: 'sides', is_signature: true, display_order: 3,
            },
            {
                _id: new mongoose_2.Types.ObjectId('200000000000000000000011'),
                category_id: categories[3]._id, title: 'Masala Fries', slug: 'masala-fries',
                description: 'Crispy golden fries tossed in desi masala mix.',
                price: 320, spice_level: 'Medium', is_bestseller: false, is_available: true,
                image_url: '/images/menu/masala-fries.jpg', display_section: 'sides', display_order: 4,
            },
        ]);
        success(`Menu Items seeded (${menuItems.length})`);
        log('Seeding Menu Page Config...');
        await pageConfig_model_1.MenuPageConfig.create([
            {
                _id: MENU_PAGE_CONFIG_ID,
                tabs: [
                    { id: 'tab-tikka', label: 'Tikka', sectionId: 'tikka' },
                    { id: 'tab-boti', label: 'Boti', sectionId: 'boti' },
                    { id: 'tab-platters', label: 'Platters', sectionId: 'platters' },
                    { id: 'tab-sides', label: 'Sides & Sauces', sectionId: 'sides' },
                ],
                platter: {
                    baseLabel: 'Build Your Platter',
                    basePrice: 2500,
                    imageUrl: '/images/menu/platter-biryani.jpg',
                    meats: [
                        { id: 'meat-1', name: 'Chicken Tikka', price: 800 },
                        { id: 'meat-2', name: 'Reshmi Boti', price: 900 },
                        { id: 'meat-3', name: 'Beef Boti', price: 1100 },
                    ],
                    sides: [
                        { id: 'side-1', name: 'Garlic Naan', price: 120 },
                        { id: 'side-2', name: 'Raita', price: 150 },
                        { id: 'side-3', name: 'Kachumber Salad', price: 180 },
                    ],
                },
                boti_featured_item_id: '200000000000000000000004',
                boti_compact_ids: ['200000000000000000000005', '200000000000000000000006'],
            },
        ]);
        success('Menu Page Config seeded');
        console.log('');
        log('Seeding Statistics...');
        await reviews_model_1.Statistic.create([
            { value: 4.9, decimals: 1, suffix: '', label: 'Average Rating', icon: 'star', display_order: 1 },
            { value: 850000, suffix: '+', label: 'Tikkas Served', icon: 'users', display_order: 2 },
            { value: 72, suffix: '%', label: 'Repeat Customers', icon: 'repeat', display_order: 3 },
            { value: 25000, suffix: '+', label: '5-Star Reviews', icon: 'thumbs-up', display_order: 4 },
        ]);
        success('Statistics seeded');
        log('Seeding Customer Reviews...');
        await reviews_model_1.CustomerReview.create([
            {
                customer_name: 'Sara Khan', location: 'Lahore', rating: 5,
                title: 'Best BBQ in Town!', review_text: 'The malai tikka literally melts in your mouth. Every visit feels like the first time. Highly recommended!',
                source: 'Google', category: 'Families', visit_date: '2025-07-15', favorite_meal: 'Malai Tikka',
                verified: true, helpful_count: 124, image_url: '/images/reviews/featured-customer.jpg',
                is_approved: true, display_section: 'featured', display_order: 1,
            },
            {
                customer_name: 'Ali Raza', location: 'Karachi', rating: 5,
                title: 'Authentic Pakistani Flavor', review_text: 'Being from Karachi, I was skeptical. But Bharli Boti blew my mind - smoky, spicy, perfect!',
                source: 'Instagram', category: 'Friends', visit_date: '2025-08-01', favorite_meal: 'Bharli Boti',
                verified: true, helpful_count: 89, image_url: '/images/gallery/customer-1.jpg',
                is_approved: true, display_section: 'highlights', display_order: 1,
            },
            {
                customer_name: 'Fatima Ahmed', location: 'Islamabad', rating: 4,
                title: 'Great for Corporate Events', review_text: 'We catered Tikkay Shikkay for our team event. Everyone loved the platter!',
                source: 'Direct', category: 'Corporate', visit_date: '2025-07-28', favorite_meal: 'The Grand Feast',
                verified: true, helpful_count: 56, image_url: '/images/gallery/customer-2.jpg',
                is_approved: true, display_section: 'highlights', display_order: 2,
            },
            {
                customer_name: 'Hamza Sheikh', location: 'Lahore', rating: 5,
                title: 'Birthday Celebration Win!', review_text: 'Had my birthday dinner here. The staff was amazing and the food? Out of this world.',
                source: 'Google', category: 'Birthday', visit_date: '2025-08-05', favorite_meal: 'Reshmi Tikka',
                verified: true, helpful_count: 45, image_url: '/images/gallery/customer-3.jpg',
                is_approved: true, display_section: 'highlights', display_order: 3,
            },
            {
                customer_name: 'Ayesha Malik', location: 'Gujranwala', rating: 5,
                title: 'Perfect Date Night Spot', review_text: 'Ambience, food, service - everything was perfect for our anniversary.',
                source: 'Instagram', category: 'Couples', visit_date: '2025-08-10', favorite_meal: 'Beef Boti',
                verified: true, helpful_count: 67, image_url: '/images/reviews/gallery-1.jpg',
                is_approved: true, display_section: 'reviews', display_order: 4,
            },
            {
                customer_name: 'Usman Bashir', location: 'Multan', rating: 4,
                title: 'Worth the Drive', review_text: 'Drove all the way from Multan just to try it. Totally worth every kilometer!',
                source: 'Direct', category: 'Friends', visit_date: '2025-07-20', favorite_meal: 'Green Chili Tikka',
                verified: true, helpful_count: 33, image_url: '/images/reviews/gallery-2.jpg',
                is_approved: true, display_section: 'reviews', display_order: 5,
            },
            {
                customer_name: 'Zainab Hussain', location: 'Faisalabad', rating: 5,
                title: 'Family Tradition Now', review_text: 'Every weekend, my family makes it a point to dine here. The kids love it!',
                source: 'Google', category: 'Families', visit_date: '2025-08-08', favorite_meal: 'Garlic Naan',
                verified: true, helpful_count: 78, image_url: '/images/reviews/gallery-3.jpg',
                is_approved: true, display_section: 'reviews', display_order: 6,
            },
        ]);
        success('Customer Reviews seeded');
        log('Seeding Video Reviews...');
        await reviews_model_1.VideoReview.create([
            { customer_name: 'Foodie PK', title: 'ULTIMATE BBQ Experience in Lahore', duration: '4:32', thumbnail: '/images/reviews/video-1.jpg', category: 'Friends', display_order: 1 },
            { customer_name: 'Eats & Treats', title: 'We Tried the Legendary Bharli Boti', duration: '6:15', thumbnail: '/images/reviews/video-2.jpg', category: 'Families', display_order: 2 },
            { customer_name: 'Lahore Diaries', title: 'Top 5 BBQ Places - #1 Tikkay Shikkay', duration: '8:47', thumbnail: '/images/reviews/video-3.jpg', category: 'Couples', display_order: 3 },
            { customer_name: 'PK Food Review', title: 'Is It REALLY Worth the Hype?', duration: '5:22', thumbnail: '/images/reviews/video-4.jpg', category: 'Birthday', display_order: 4 },
        ]);
        success('Video Reviews seeded');
        log('Seeding Reviews Page Config...');
        await reviews_model_1.ReviewsPageConfig.create([{ _id: REVIEWS_PAGE_CONFIG_ID }]);
        success('Reviews Page Config seeded');
        console.log('');
        log('Seeding Gallery Images...');
        await gallery_model_1.GalleryImage.create([
            { imageUrl: '/images/gallery/gallery-food-1.jpg', caption: 'Signature Tikka Platter', location: 'Main Outlet', category: 'food', alt: 'Signature Tikka Platter', tag: 'Popular', display_order: 1 },
            { imageUrl: '/images/gallery/gallery-food-2.jpg', caption: 'Fresh off the Grill', location: 'Kitchen', category: 'food', alt: 'Fresh off the Grill', display_order: 2 },
            { imageUrl: '/images/gallery/gallery-food-3.jpg', caption: 'Chef Special Boti', location: 'Main Outlet', category: 'food', alt: 'Chef Special Boti', tag: 'Chef Choice', display_order: 3 },
            { imageUrl: '/images/gallery/gallery-grill-1.jpg', caption: 'Charcoal Heat in Action', location: 'Grill Station', category: 'grill', alt: 'Charcoal Grill', display_order: 1 },
            { imageUrl: '/images/gallery/kitchen-charcoal.jpg', caption: 'Ancestral Charcoal Setup', location: 'Kitchen', category: 'grill', alt: 'Charcoal Setup', tag: 'Behind the Scenes', display_order: 2 },
            { imageUrl: '/images/gallery/kitchen-grilling.jpg', caption: 'Grill Master at Work', location: 'Kitchen', category: 'grill', alt: 'Grill Master', display_order: 3 },
            { imageUrl: '/images/gallery/gallery-customer-1.jpg', caption: 'Happy Family at Tikkay', location: 'Main Hall', category: 'customers', alt: 'Happy Customers', display_order: 1 },
            { imageUrl: '/images/gallery/customer-2.jpg', caption: 'Group Dinner Celebration', location: 'Private Dining', category: 'customers', alt: 'Group Dinner', display_order: 2 },
            { imageUrl: '/images/gallery/customer-3.jpg', caption: 'Birthday Night Fun', location: 'Main Hall', category: 'customers', alt: 'Birthday Celebration', display_order: 3 },
            { imageUrl: '/images/gallery/gallery-atmosphere-1.jpg', caption: 'Warm Ambience', location: 'Main Entrance', category: 'atmosphere', alt: 'Restaurant Ambience', tag: 'Ambience', display_order: 1 },
        ]);
        success('Gallery Images seeded');
        log('Seeding Video Testimonials...');
        await gallery_model_1.VideoTestimonial.create([
            { customer_name: 'PK Food Blogger', title: 'The Best BBQ I Have Tasted!', duration: '3:45', thumbnail: '/images/gallery/video-1.jpg', source: 'YouTube', display_order: 1 },
            { customer_name: 'Lahore Foodie', title: 'You Have to Try This Place', duration: '5:12', thumbnail: '/images/gallery/video-2.jpg', source: 'TikTok', display_order: 2 },
        ]);
        success('Video Testimonials seeded');
        log('Seeding Instagram Posts...');
        await gallery_model_1.InstagramPost.create([
            { imageUrl: '/images/gallery/customer-1.jpg', caption: 'Weekend vibes at Tikkay Shikkay 🔥', tag: '#tikkayshikkay', likes: 1243, comments: 87, display_order: 1 },
            { imageUrl: '/images/reviews/gallery-2.jpg', caption: 'Boti love!', tag: '#bbqlife', likes: 987, comments: 56, display_order: 2 },
            { imageUrl: '/images/reviews/gallery-3.jpg', caption: 'Charcoal perfection', tag: '#firegrilled', likes: 1532, comments: 102, display_order: 3 },
            { imageUrl: '/images/reviews/gallery-4.jpg', caption: 'Family gathering goals', tag: '#familydinner', likes: 756, comments: 43, display_order: 4 },
            { imageUrl: '/images/reviews/gallery-5.jpg', caption: 'Platter goals 🍗', tag: '#foodie', likes: 2104, comments: 156, display_order: 5 },
            { imageUrl: '/images/reviews/gallery-6.jpg', caption: 'Weekend = BBQ time', tag: '#weekendvibes', likes: 845, comments: 61, display_order: 6 },
        ]);
        success('Instagram Posts seeded');
        log('Seeding Google Reviews...');
        await gallery_model_1.GoogleReview.create([
            { customer_name: 'Saad Ahmed', rating: 5, visit_date: '2025-08-01', review_text: 'Absolutely amazing food! Will definitely visit again.', verified: true, source: 'Google', display_order: 1 },
            { customer_name: 'Hira Naseer', rating: 4, visit_date: '2025-07-28', review_text: 'Great taste and ambience. Service was quick too.', verified: true, source: 'Google', display_order: 2 },
            { customer_name: 'Bilal Qureshi', rating: 5, visit_date: '2025-07-25', review_text: 'Hands down the best BBQ in Lahore. Bharli Boti is a MUST try!', verified: true, source: 'Google', display_order: 3 },
        ]);
        success('Google Reviews seeded');
        log('Seeding Customer Stories...');
        await gallery_model_1.CustomerStory.create([
            {
                customer_name: 'Khan Family', imageUrl: '/images/gallery/customer-1.jpg', favorite_meal: 'Grand Feast Platter',
                years_visiting: 4, visits: 52, quote: 'Tikkay Shikkay has become our go-to spot for every family celebration. From birthdays to Eid, the fire and flavor never disappoint.',
                timeline: [
                    { year: '2021', label: 'First Visit', note: 'Tried Malai Tikka - instant love!' },
                    { year: '2022', label: 'Birthday at Tikkay', note: 'Celebrated son\'s 10th birthday' },
                    { year: '2024', label: 'Eid Dinner', note: 'Entire extended family joined us' },
                    { year: '2025', label: '4-Year Mark', note: 'Still our #1 restaurant' },
                ],
                display_order: 1,
            },
        ]);
        success('Customer Stories seeded');
        log('Seeding Kitchen Processes...');
        await gallery_model_1.KitchenProcess.create([
            { step: 1, title: 'Marination', imageUrl: '/images/gallery/kitchen-spices.jpg', story: 'Every cut is hand-marinated for minimum 8 hours in our secret ancestral spice blend.', fact: '42 secret spices go into each batch', time: '8+ hours', display_order: 1 },
            { step: 2, title: 'Charcoal Heat', imageUrl: '/images/gallery/kitchen-charcoal.jpg', story: 'Pure hardwood charcoal is lit and allowed to reach the perfect searing temperature.', fact: 'No gas grills. Only authentic charcoal', time: '30 min to heat', display_order: 2 },
            { step: 3, title: 'The Grill', imageUrl: '/images/gallery/kitchen-grilling.jpg', story: 'Master grillmen turn each piece by hand, ensuring perfect char and juiciness.', fact: 'Average grill time per batch: 15 min', time: '15 minutes', display_order: 3 },
            { step: 4, title: 'The Finish', imageUrl: '/images/gallery/gallery-food-1.jpg', story: 'Finished with a fresh lemon squeeze and hand-chopped coriander, served sizzling.', fact: 'Served within 60 seconds of grill-off', time: '< 1 min', display_order: 4 },
        ]);
        success('Kitchen Processes seeded');
        log('Seeding Journey Milestones...');
        await gallery_model_1.JourneyMilestone.create([
            { year: '2013', title: 'The First Grill', imageUrl: '/images/gallery/journey-opening.jpg', story: 'Ahmed Raza lights the first charcoal grill in his backyard for friends and family.', badge: 'Origin Story', type: 'milestone', display_order: 1 },
            { year: '2015', title: 'First Small Outlet', imageUrl: '/images/gallery/journey-branch.jpg', story: 'A tiny 8-seat setup in a corner of Gulberg becomes the talk of the town.', badge: 'First Branch', type: 'achievement', stat: { value: 8, suffix: '', label: 'Seats' }, display_order: 2 },
            { year: '2018', title: 'Best BBQ Award', imageUrl: '/images/gallery/journey-award.jpg', story: 'Wins Pakistan Restaurant Award for Best BBQ 2018.', badge: 'Award Winner', type: 'achievement', stat: { value: 1, suffix: 'st', label: 'Place' }, display_order: 3 },
            { year: '2021', title: '3 New Locations', imageUrl: '/images/gallery/journey-crowd.jpg', story: 'Expands to 3 new cities with 5 more outlets.', badge: 'Expansion', type: 'milestone', stat: { value: 3, suffix: '', label: 'New Cities' }, display_order: 4 },
            { year: '2024', title: 'The Crowd Keeps Coming', imageUrl: '/images/gallery/journey-media.jpg', story: 'Featured in top 10 Pakistani food vlogs and media.', badge: 'Nationwide Fame', type: 'achievement', display_order: 5 },
            { year: '2026', title: 'The Future is Flame', imageUrl: '/images/gallery/journey-future.jpg', story: 'Expanding internationally and introducing Tikkay Shikkay frozen range.', badge: 'Coming Soon', type: 'future', display_order: 6 },
        ]);
        success('Journey Milestones seeded');
        log('Seeding Gallery Page Config...');
        await gallery_model_1.GalleryPageConfig.create([{ _id: GALLERY_PAGE_CONFIG_ID }]);
        success('Gallery Page Config seeded');
        console.log('');
        log('Seeding Contact Methods...');
        await contact_model_1.ContactMethod.create([
            { icon: 'whatsapp', accent: 'whatsapp', title: 'WhatsApp', value: '+92 300 123 4567', helper: 'Mon-Sun, 11am - 12am', href: 'https://wa.me/923001234567', display_order: 1 },
            { icon: 'phone', accent: 'orange', title: 'Call Us', value: '+92 42 111 845 529', helper: 'Bookings & Takeaway', href: 'tel:+9242111845529', display_order: 2 },
            { icon: 'map-pin', accent: 'peach', title: 'Visit Us', value: 'Main Blvd, Gulberg III, Lahore', helper: 'Open Daily 11am - 1am', href: 'https://maps.google.com', display_order: 3 },
        ]);
        success('Contact Methods seeded');
        log('Seeding Opening Hours...');
        await contact_model_1.OpeningDay.create([
            { day: 'Monday', hours: '11:00 AM - 12:30 AM', display_order: 1 },
            { day: 'Tuesday', hours: '11:00 AM - 12:30 AM', display_order: 2 },
            { day: 'Wednesday', hours: '11:00 AM - 12:30 AM', display_order: 3 },
            { day: 'Thursday', hours: '11:00 AM - 12:30 AM', display_order: 4 },
            { day: 'Friday', hours: '2:00 PM - 1:00 AM', display_order: 5 },
            { day: 'Saturday', hours: '11:00 AM - 1:00 AM', display_order: 6 },
            { day: 'Sunday', hours: '11:00 AM - 12:30 AM', display_order: 7 },
        ]);
        success('Opening Hours seeded');
        log('Seeding Contact Page Config...');
        await contact_model_1.ContactPageConfig.create([{ _id: CONTACT_PAGE_CONFIG_ID }]);
        success('Contact Page Config seeded');
        console.log('');
        log('Seeding Founder Details...');
        await about_model_1.FounderDetails.create([
            {
                _id: FOUNDER_ID,
                portraitUrl: '/images/our_legacy.png',
                quote: "The grill doesn't lie. It reveals the soul of the spice. Once the charcoal catches, there are no shortcuts.",
                quoteAuthor: 'Ahmed Raza',
                quoteRole: 'Founder & Pitmaster',
                eyebrow: 'The Visionary',
                title: 'Meet Ahmed',
                bio: "Ahmed Raza started Tikkay Shikkay with a simple obsession: to preserve the authentic, raw heat of ancestral Pakistani street BBQ. What began as a single backyard grill in Ahmed's home has become a brand built on fire, family, and a refusal to cut corners.",
                caption: 'Ahmed Raza, 2024',
                mission: 'Serve honest, fire-grilled food that feels handcrafted from the first bite to the last, without compromise.',
                vision: "To be Pakistan's benchmark for fire-grilled flavor, where ancestral methods meet modern consistency.",
            },
        ]);
        success('Founder Details seeded');
        log('Seeding About Stats...');
        await about_model_1.StatItem.create([
            { value: '12', label: 'Active Hubs', display_order: 1 },
            { value: '850k+', label: 'Tikkas Served', display_order: 2 },
            { value: '42', label: 'Secret Blends', display_order: 3 },
            { value: '12', label: 'Years of Fire', display_order: 4 },
        ]);
        success('About Stats seeded');
        log('Seeding Milestones (About)...');
        await about_model_1.MilestoneStat.create([
            { number: '2013', label: 'Founded', display_order: 1 },
            { number: '2015', label: 'First Outlet', display_order: 2 },
            { number: '2018', label: 'Award Winner', display_order: 3 },
            { number: '2021', label: '3 New Cities', display_order: 4 },
            { number: '2024', label: '12 Locations', display_order: 5 },
            { number: '2026', label: 'Going Global', display_order: 6 },
        ]);
        success('About Milestones seeded');
        log('Seeding Journey Posts...');
        await about_model_1.JourneyPostModel.create([
            { day_number: 1, title: 'Day 1: The Dream', content: 'Today I bought the first drum of mustard oil. The journey starts now.', media_type: 'Image', media_url: '/images/gallery/journey-opening.jpg', display_order: 1 },
            { day_number: 7, title: 'Day 7: First Guests', content: '15 friends and family over for the first test cook. Feedback was overwhelming.', media_type: 'Image', media_url: '/images/gallery/customer-1.jpg', display_order: 2 },
            { day_number: 30, title: 'Day 30: The Lines Begin', content: 'People are already asking when we will open publicly. The fire is real.', media_type: 'Video', media_url: '/images/reviews/video-1.jpg', display_order: 3 },
        ]);
        success('Journey Posts seeded');
        log('Seeding About Page Config...');
        await about_model_1.AboutPageConfig.create([{ _id: ABOUT_PAGE_CONFIG_ID }]);
        success('About Page Config seeded');
        console.log('');
        console.log('\x1b[32m══════════════════════════════════════════════════\x1b[0m');
        console.log('\x1b[32m   ✅ DATABASE SEEDED SUCCESSFULLY! ✅\x1b[0m');
        console.log('\x1b[32m══════════════════════════════════════════════════\x1b[0m\n');
        console.log('\x1b[33m  Quick Access:\x1b[0m');
        console.log(`    🔐 Admin Login:  ${adminEmail}  /  ${adminPassword}`);
        console.log(`    👤 User Login:   ${userEmail}   /  ${userPassword}`);
        console.log('    🌐 Server:       http://localhost:5000');
        console.log('');
        await (0, db_1.disconnectDB)();
        process.exit(0);
    }
    catch (err) {
        console.error('\n\x1b[31m═══════════════════════════════════════════════\x1b[0m');
        error('SEED FAILED: ' + err.message);
        console.error(err.stack);
        console.log('\x1b[31m═══════════════════════════════════════════════\x1b[0m\n');
        await (0, db_1.disconnectDB)();
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=seed.js.map