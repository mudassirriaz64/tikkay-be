"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const settings_routes_1 = __importDefault(require("./modules/settings/settings.routes"));
const menu_routes_1 = __importDefault(require("./modules/menu/menu.routes"));
const reviews_routes_1 = __importDefault(require("./modules/reviews/reviews.routes"));
const gallery_routes_1 = __importDefault(require("./modules/gallery/gallery.routes"));
const contact_routes_1 = __importDefault(require("./modules/contact/contact.routes"));
const about_routes_1 = __importDefault(require("./modules/about/about.routes"));
const orders_routes_1 = __importDefault(require("./modules/orders/orders.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const catering_routes_1 = __importDefault(require("./modules/catering/catering.routes"));
const blog_routes_1 = __importDefault(require("./modules/blog/blog.routes"));
const careers_routes_1 = __importDefault(require("./modules/careers/careers.routes"));
const franchise_routes_1 = __importDefault(require("./modules/franchise/franchise.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(config_1.CORS_OPTIONS));
app.use((0, morgan_1.default)(config_1.config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
app.use((0, cookie_parser_1.default)());
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.get('/', (_req, res) => {
    res.json({
        status: 'success',
        message: 'Welcome to Tikkay Shikkay API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            settings: '/api/v1/settings',
            menu: '/api/v1/menu',
            reviews: '/api/v1/reviews',
            gallery: '/api/v1/gallery',
            contact: '/api/v1/contact',
            about: '/api/v1/about',
            orders: '/api/v1/orders',
            users: '/api/v1/users',
            upload: '/api/v1/upload',
            catering: '/api/v1/catering',
            blog: '/api/v1/blog',
            careers: '/api/v1/careers',
            franchise: '/api/v1/franchise',
        },
    });
});
app.get('/api/v1/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.config.NODE_ENV,
    });
});
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/settings', settings_routes_1.default);
app.use('/api/v1/menu', menu_routes_1.default);
app.use('/api/v1/reviews', reviews_routes_1.default);
app.use('/api/v1/gallery', gallery_routes_1.default);
app.use('/api/v1/contact', contact_routes_1.default);
app.use('/api/v1/about', about_routes_1.default);
app.use('/api/v1/orders', orders_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.use('/api/v1/upload', upload_routes_1.default);
app.use('/api/v1/catering', catering_routes_1.default);
app.use('/api/v1/blog', blog_routes_1.default);
app.use('/api/v1/careers', careers_routes_1.default);
app.use('/api/v1/franchise', franchise_routes_1.default);
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map