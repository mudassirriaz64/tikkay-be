"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const settings_controller_1 = require("./settings.controller");
const router = (0, express_1.Router)();
router.route('/')
    .get(settings_controller_1.getSettings)
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, settings_controller_1.updateSettings);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map