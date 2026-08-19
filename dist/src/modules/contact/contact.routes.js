"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const contact_controller_1 = require("./contact.controller");
const router = (0, express_1.Router)();
router.route('/page-data').get(contact_controller_1.getContactPageData);
router.route('/page-config')
    .get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.getPageConfig)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.updatePageConfig);
router.route('/methods')
    .get(contact_controller_1.contactMethods.getAll)
    .put(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.contactMethods.saveAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.contactMethods.create);
router.route('/methods/:id')
    .get(contact_controller_1.contactMethods.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.contactMethods.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.contactMethods.delete);
router.route('/opening-hours')
    .get(contact_controller_1.openingDays.getAll)
    .put(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.openingDays.saveAll)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.openingDays.create);
router.route('/opening-hours/:id')
    .get(contact_controller_1.openingDays.getById)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.openingDays.update)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.openingDays.delete);
router.route('/submit').post(contact_controller_1.submitContactForm);
router.route('/submissions').get(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.getSubmissions);
router.route('/submissions/:id/read').patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.markSubmissionRead);
router.route('/submissions/:id').delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, contact_controller_1.deleteSubmission);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map