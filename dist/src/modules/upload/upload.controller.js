"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.uploadVideoVPS = exports.generateVideoSignature = exports.getVideoUploadConfig = exports.uploadVideoDisk = exports.uploadSingle = exports.uploadResume = exports.upload = void 0;
exports.destroyCloudinaryAsset = destroyCloudinaryAsset;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const ApiResponse_1 = require("../../utils/ApiResponse");
const config_1 = require("../../config");
cloudinary_1.v2.config({
    cloud_name: config_1.config.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.config.CLOUDINARY_API_KEY,
    api_secret: config_1.config.CLOUDINARY_API_SECRET,
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
function sanitizeAndValidateFolder(rawFolder) {
    if (!rawFolder)
        return 'tikkayshikkay/uploads';
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
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        const folderParam = req.query?.folder || req.body?.folder;
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
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
        const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new ApiError_1.ApiError(400, `Unsupported file type: ${file.mimetype}`));
        }
    },
});
// Resume storage supporting PDF, DOCX, DOC, JPG, JPEG, PNG up to 25MB
const resumeStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (_req, file) => {
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png'].includes(ext || '');
        return {
            folder: 'tikkayshikkay/careers/resumes',
            resource_type: isImage ? 'image' : 'raw',
            allowed_formats: ['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png'],
            public_id: `resume-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        };
    },
});
exports.uploadResume = (0, multer_1.default)({
    storage: resumeStorage,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'image/jpeg',
            'image/jpg',
            'image/png',
        ];
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        const allowedExts = ['pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png'];
        if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext || '')) {
            cb(null, true);
        }
        else {
            cb(new ApiError_1.ApiError(400, 'Invalid file format. Only PDF, DOCX, and JPG/PNG documents up to 25MB are allowed.'));
        }
    },
}).single('resume');
/**
 * Hard delete file from Cloudinary storage
 */
async function destroyCloudinaryAsset(publicId) {
    try {
        // Try raw first (PDF / DOCX), then image
        await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: 'raw' });
        await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: 'image' });
    }
    catch (err) {
        console.error('Failed to destroy Cloudinary asset:', publicId, err);
    }
}
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const gallery_model_1 = require("../gallery/gallery.model");
const videoWorker_service_1 = require("./videoWorker.service");
exports.uploadSingle = exports.upload.single('file');
// Local disk storage for VPS FFmpeg pipeline (up to 100MB)
const diskStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path_1.default.join(os_1.default.tmpdir(), 'tikkay-raw-uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname) || '.mp4';
        cb(null, `raw-${uniqueSuffix}${ext}`);
    },
});
exports.uploadVideoDisk = (0, multer_1.default)({
    storage: diskStorage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB for raw video files on VPS
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(new ApiError_1.ApiError(400, 'Only video files are allowed'));
        }
    },
}).single('video');
/**
 * Returns current server video capability (VPS vs Vercel Direct)
 */
exports.getVideoUploadConfig = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const isVpsFfmpegEnabled = process.env.ENABLE_LOCAL_FFMPEG === 'true' && process.env.VERCEL !== '1';
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        mode: isVpsFfmpegEnabled ? 'vps' : 'vercel_direct',
        cloudName: config_1.config.CLOUDINARY_CLOUD_NAME,
        maxSizeBytes: 100 * 1024 * 1024,
        allowedFormats: ['mp4', 'webm', 'mov', 'mkv'],
    }, 'Video upload config fetched'));
});
/**
 * Generates Cloudinary signed upload parameters for Vercel/direct browser uploads
 */
exports.generateVideoSignature = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'tikkayshikkay/gallery/videos';
    // Cloudinary signature signs key-value pairs alphabetically (folder, timestamp)
    const paramsToSign = {
        folder,
        timestamp,
    };
    const signature = cloudinary_1.v2.utils.api_sign_request(paramsToSign, config_1.config.CLOUDINARY_API_SECRET);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        signature,
        timestamp,
        apiKey: config_1.config.CLOUDINARY_API_KEY,
        cloudName: config_1.config.CLOUDINARY_CLOUD_NAME,
        folder,
        resourceType: 'video',
    }, 'Video upload signature generated'));
});
/**
 * VPS Mode: Async transcode pipeline with 202 Accepted response
 */
exports.uploadVideoVPS = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const isVpsFfmpegEnabled = process.env.ENABLE_LOCAL_FFMPEG === 'true' && process.env.VERCEL !== '1';
    if (!isVpsFfmpegEnabled) {
        throw new ApiError_1.ApiError(400, 'Local FFmpeg processing is disabled on this environment. Use direct signed upload.');
    }
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'No video file provided');
    }
    const { title = 'Behind the Scenes', customer_name = 'Tikkay Shikkay', description = '' } = req.body;
    // 1. Create initial processing document in MongoDB
    const videoDoc = await gallery_model_1.VideoTestimonial.create({
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
    videoWorker_service_1.videoQueue.add(() => (0, videoWorker_service_1.processVideoJob)({
        videoId: videoDoc._id.toString(),
        rawFilePath: req.file.path,
        originalFileName: req.file.originalname,
    }));
    // 3. Immediate 202 Accepted response
    res.status(202).json(new ApiResponse_1.ApiResponse(202, {
        id: videoDoc._id,
        title: videoDoc.title,
        status: videoDoc.status,
        message: 'Video upload received and queued for compression.',
    }, 'Video queued for processing'));
});
exports.uploadFile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'No file uploaded');
    }
    const file = req.file;
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        url: file.path,
        publicId: file.filename,
        format: file.format || file.mimetype.split('/')[1],
        resourceType: file.resource_type,
        bytes: file.size,
        width: file.width || null,
        height: file.height || null,
    }, 'File uploaded successfully'));
});
//# sourceMappingURL=upload.controller.js.map