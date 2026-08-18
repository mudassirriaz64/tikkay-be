import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { config } from '../../config';
import { AuthRequest } from '../../middleware/auth.middleware';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const ALLOWED_FOLDERS = [
  'menu',
  'gallery/customers',
  'gallery/kitchen',
  'gallery/journey',
  'gallery/photos',
  'about/founder',
  'settings/hero',
  'contact/catering',
];

function sanitizeAndValidateFolder(rawFolder?: string): string {
  if (!rawFolder) return 'tikkayshikkay/uploads';

  let cleaned = rawFolder.replace(/^\/+|\/+$/g, '').trim().toLowerCase();

  // Special match for menu category folders e.g. "menu/tikka", "menu/boti", "menu/platters", "menu/sides", etc.
  if (cleaned.startsWith('menu/') || cleaned === 'menu') {
    const sub = cleaned.replace(/^menu\/?/, '');
    const cleanSub = sub.replace(/[^a-z0-9-_]/g, '');
    return cleanSub ? `tikkayshikkay/menu/${cleanSub}` : 'tikkayshikkay/menu';
  }

  // Exact match with allowlist
  if (ALLOWED_FOLDERS.includes(cleaned)) {
    return `tikkayshikkay/${cleaned}`;
  }

  return 'tikkayshikkay/uploads';
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    const folderParam = (req.query?.folder as string) || (req.body?.folder as string);
    const targetFolder = sanitizeAndValidateFolder(folderParam);

    return {
      folder: targetFolder,
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo
        ? ['mp4', 'webm', 'mov']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
      transformation: isVideo
        ? undefined
        : [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
    }
  },
});

import os from 'os';
import path from 'path';
import fs from 'fs';
import { VideoTestimonial } from '../gallery/gallery.model';
import { videoQueue, processVideoJob } from './videoWorker.service';

export const uploadSingle = upload.single('file');

// Local disk storage for VPS FFmpeg pipeline (up to 100MB)
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(os.tmpdir(), 'tikkay-raw-uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `raw-${uniqueSuffix}${ext}`);
  },
});

export const uploadVideoDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB for raw video files on VPS
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only video files are allowed'));
    }
  },
}).single('video');

/**
 * Returns current server video capability (VPS vs Vercel Direct)
 */
export const getVideoUploadConfig = asyncHandler(async (_req: Request, res: Response) => {
  const isVpsFfmpegEnabled = process.env.ENABLE_LOCAL_FFMPEG === 'true' && process.env.VERCEL !== '1';

  res.status(200).json(
    new ApiResponse(200, {
      mode: isVpsFfmpegEnabled ? 'vps' : 'vercel_direct',
      cloudName: config.CLOUDINARY_CLOUD_NAME,
      maxSizeBytes: 100 * 1024 * 1024,
      allowedFormats: ['mp4', 'webm', 'mov', 'mkv'],
    }, 'Video upload config fetched')
  );
});

/**
 * Generates Cloudinary signed upload parameters for Vercel/direct browser uploads
 */
export const generateVideoSignature = asyncHandler(async (req: AuthRequest, res: Response) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'tikkayshikkay/gallery/videos';

  // Cloudinary signature signs key-value pairs alphabetically (folder, timestamp)
  const paramsToSign = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    config.CLOUDINARY_API_SECRET
  );

  res.status(200).json(
    new ApiResponse(200, {
      signature,
      timestamp,
      apiKey: config.CLOUDINARY_API_KEY,
      cloudName: config.CLOUDINARY_CLOUD_NAME,
      folder,
      resourceType: 'video',
    }, 'Video upload signature generated')
  );
});

/**
 * VPS Mode: Async transcode pipeline with 202 Accepted response
 */
export const uploadVideoVPS = asyncHandler(async (req: AuthRequest, res: Response) => {
  const isVpsFfmpegEnabled = process.env.ENABLE_LOCAL_FFMPEG === 'true' && process.env.VERCEL !== '1';
  if (!isVpsFfmpegEnabled) {
    throw new ApiError(400, 'Local FFmpeg processing is disabled on this environment. Use direct signed upload.');
  }

  if (!req.file) {
    throw new ApiError(400, 'No video file provided');
  }

  const { title = 'Behind the Scenes', customer_name = 'Tikkay Shikkay', description = '' } = req.body;

  // 1. Create initial processing document in MongoDB
  const videoDoc = await VideoTestimonial.create({
    title,
    customer_name,
    description,
    duration: 'Processing...',
    thumbnail: '/images/gallery/default-video.jpg',
    source: 'Internal',
    source_type: 'upload',
    status: 'processing',
    display_order: 0,
  });

  // 2. Queue in-process FFmpeg transcode
  videoQueue.add(() =>
    processVideoJob({
      videoId: (videoDoc._id as any).toString(),
      rawFilePath: req.file!.path,
      originalFileName: req.file!.originalname,
    })
  );

  // 3. Immediate 202 Accepted response
  res.status(202).json(
    new ApiResponse(202, {
      id: videoDoc._id,
      title: videoDoc.title,
      status: videoDoc.status,
      message: 'Video upload received and queued for compression.',
    }, 'Video queued for processing')
  );
});

export const uploadFile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const file = req.file as any;

  res.status(200).json(
    new ApiResponse(200, {
      url: file.path,
      publicId: file.filename,
      format: file.format || file.mimetype.split('/')[1],
      resourceType: file.resource_type,
      bytes: file.size,
      width: file.width || null,
      height: file.height || null,
    }, 'File uploaded successfully')
  );
});
