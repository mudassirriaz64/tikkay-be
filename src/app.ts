import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { CORS_OPTIONS, config } from './config';
import { notFound, errorHandler } from './middleware/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import settingsRoutes from './modules/settings/settings.routes';
import menuRoutes from './modules/menu/menu.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import galleryRoutes from './modules/gallery/gallery.routes';
import contactRoutes from './modules/contact/contact.routes';
import aboutRoutes from './modules/about/about.routes';
import ordersRoutes from './modules/orders/orders.routes';
import usersRoutes from './modules/users/users.routes';
import uploadRoutes from './modules/upload/upload.routes';
import cateringRoutes from './modules/catering/catering.routes';
import blogRoutes from './modules/blog/blog.routes';
import careersRoutes from './modules/careers/careers.routes';

const app = express();

app.use(cors(CORS_OPTIONS));
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', (_req: Request, res: Response) => {
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
    },
  });
});

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/about', aboutRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/catering', cateringRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/careers', careersRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
