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

export const uploadSingle = upload.single('file');

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
