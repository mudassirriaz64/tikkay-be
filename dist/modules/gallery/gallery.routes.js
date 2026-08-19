"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const gallery_controller_1 = require("./gallery.controller");
const router = (0, express_1.Router)();
router.route('/page-data').get(gallery_controller_1.getGalleryPageData);
router.route('/page-config')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.getPageConfig)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.updatePageConfig);
router.route('/images')
    .get(gallery_controller_1.galleryImages.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.galleryImages.create);
router.route('/images/:id')
    .get(gallery_controller_1.galleryImages.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.galleryImages.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.galleryImages.delete);
router.route('/videos')
    .get(gallery_controller_1.videos.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.videos.create);
router.route('/videos/:id')
    .get(gallery_controller_1.videos.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.videos.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.videos.delete);
router.route('/instagram')
    .get(gallery_controller_1.instagram.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.instagram.create);
router.route('/instagram/:id')
    .get(gallery_controller_1.instagram.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.instagram.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.instagram.delete);
router.route('/google-reviews')
    .get(gallery_controller_1.googleReviews.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.googleReviews.create);
router.route('/google-reviews/:id')
    .get(gallery_controller_1.googleReviews.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.googleReviews.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.googleReviews.delete);
router.route('/customer-stories')
    .get(gallery_controller_1.customerStories.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.customerStories.create);
router.route('/customer-stories/:id')
    .get(gallery_controller_1.customerStories.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.customerStories.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.customerStories.delete);
router.route('/kitchen-processes')
    .get(gallery_controller_1.kitchenProcesses.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.kitchenProcesses.create);
router.route('/kitchen-processes/:id')
    .get(gallery_controller_1.kitchenProcesses.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.kitchenProcesses.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.kitchenProcesses.delete);
router.route('/journey-milestones')
    .get(gallery_controller_1.journeyMilestones.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.journeyMilestones.create);
router.route('/journey-milestones/:id')
    .get(gallery_controller_1.journeyMilestones.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.journeyMilestones.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, gallery_controller_1.journeyMilestones.delete);
exports.default = router;
//# sourceMappingURL=gallery.routes.js.map