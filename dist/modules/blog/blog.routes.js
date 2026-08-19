"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="express" />
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const blog_controller_1 = require("./blog.controller");
const router = (0, express_1.Router)();
router.route('/')
    .get(blog_controller_1.getAllPosts)
    .post(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, blog_controller_1.createPost);
router.route('/:slug').get(blog_controller_1.getPostBySlug);
router.route('/id/:id')
    .patch(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, blog_controller_1.updatePost)
    .delete(auth_middleware_1.protect, auth_middleware_1.verifyAdmin, blog_controller_1.deletePost);
exports.default = router;
//# sourceMappingURL=blog.routes.js.map