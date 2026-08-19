"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const about_controller_1 = require("./about.controller");
const router = (0, express_1.Router)();
router.route('/page-data').get(about_controller_1.getAboutPageData);
router.route('/page-config')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.getPageConfig)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.updatePageConfig);
router.route('/founder')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.getFounder)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.updateFounder);
router.route('/stats')
    .get(about_controller_1.stats.getAll)
    .put(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.stats.saveAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.stats.create);
router.route('/stats/:id')
    .get(about_controller_1.stats.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.stats.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.stats.delete);
router.route('/milestones')
    .get(about_controller_1.milestones.getAll)
    .put(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.milestones.saveAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.milestones.create);
router.route('/milestones/:id')
    .get(about_controller_1.milestones.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.milestones.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.milestones.delete);
router.route('/journey-posts')
    .get(about_controller_1.journeyPosts.getAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.journeyPosts.create);
router.route('/journey-posts/:id')
    .get(about_controller_1.journeyPosts.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.journeyPosts.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, about_controller_1.journeyPosts.delete);
exports.default = router;
//# sourceMappingURL=about.routes.js.map