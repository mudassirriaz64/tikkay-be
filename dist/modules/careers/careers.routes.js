"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const upload_controller_1 = require("../upload/upload.controller");
const careers_controller_1 = require("./careers.controller");
const router = (0, express_1.Router)();
router.route('/jobs')
    .get(careers_controller_1.getOpenJobs)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, careers_controller_1.createJob);
router.route('/jobs/admin')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, careers_controller_1.getAllJobsAdmin);
router.route('/jobs/:id')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, careers_controller_1.updateJob)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, careers_controller_1.deleteJob);
router.route('/apply')
    .post(upload_controller_1.uploadResume, careers_controller_1.applyForJob);
router.route('/applications')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, careers_controller_1.getAllApplications);
router.route('/applications/:id')
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, careers_controller_1.deleteApplication);
router.route('/applications/:id/status')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, careers_controller_1.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=careers.routes.js.map