"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const upload_controller_1 = require("./upload.controller");
const router = (0, express_1.Router)();
router.get('/video-config', upload_controller_1.getVideoUploadConfig);
router.post('/video-signature', auth_middleware_1.protect, auth_middleware_1.verifyAdmin, upload_controller_1.generateVideoSignature);
router.post('/video', auth_middleware_1.protect, auth_middleware_1.verifyAdmin, upload_controller_1.uploadVideoDisk, upload_controller_1.uploadVideoVPS);
router.post('/', auth_middleware_1.protect, auth_middleware_1.verifyAdmin, upload_controller_1.uploadSingle, upload_controller_1.uploadFile);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map