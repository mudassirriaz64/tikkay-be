"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoQueue = void 0;
exports.formatDuration = formatDuration;
exports.processVideoJob = processVideoJob;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const cloudinary_1 = require("cloudinary");
const gallery_model_1 = require("../gallery/gallery.model");
// Configure ffmpeg static binary path if available
if (ffmpeg_static_1.default) {
    fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
}
// Lightweight in-memory queue with concurrency: 1 (CommonJS safe)
class SimpleQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }
    add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const res = await task();
                    resolve(res);
                }
                catch (err) {
                    reject(err);
                }
            });
            void this.process();
        });
    }
    async process() {
        if (this.isProcessing || this.queue.length === 0)
            return;
        this.isProcessing = true;
        const task = this.queue.shift();
        if (task) {
            try {
                await task();
            }
            catch (err) {
                console.error('Queue task error:', err);
            }
        }
        this.isProcessing = false;
        if (this.queue.length > 0) {
            void this.process();
        }
    }
}
exports.videoQueue = new SimpleQueue();
function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
async function processVideoJob(job) {
    const { videoId, rawFilePath } = job;
    const tempDir = path_1.default.join(os_1.default.tmpdir(), 'tikkay-transcode');
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    const compressedFilePath = path_1.default.join(tempDir, `compressed-${videoId}.mp4`);
    const thumbnailFilePath = path_1.default.join(tempDir, `thumb-${videoId}.jpg`);
    try {
        // 1. Run FFmpeg compression & generate poster thumbnail
        await new Promise((resolve, reject) => {
            (0, fluent_ffmpeg_1.default)(rawFilePath)
                .outputOptions([
                '-c:v libx264',
                '-preset fast',
                '-crf 26',
                "-vf scale='min(1280,iw)':-2",
                '-c:a aac',
                '-b:a 128k',
                '-movflags +faststart',
            ])
                .output(compressedFilePath)
                .screenshots({
                timestamps: ['00:00:01'],
                filename: `thumb-${videoId}.jpg`,
                folder: tempDir,
                size: '1280x720',
            })
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .run();
        });
        // 2. Extract Duration via ffprobe if possible
        let durationStr = '0:30';
        try {
            await new Promise((resolve) => {
                fluent_ffmpeg_1.default.ffprobe(compressedFilePath, (err, metadata) => {
                    if (!err && metadata?.format?.duration) {
                        durationStr = formatDuration(metadata.format.duration);
                    }
                    resolve();
                });
            });
        }
        catch {
            /* fallback duration */
        }
        // 3. Upload Compressed Video & Thumbnail to Cloudinary
        const [videoResult, thumbResult] = await Promise.all([
            cloudinary_1.v2.uploader.upload_large(compressedFilePath, {
                resource_type: 'video',
                folder: 'tikkayshikkay/gallery/videos',
            }),
            cloudinary_1.v2.uploader.upload(thumbnailFilePath, {
                resource_type: 'image',
                folder: 'tikkayshikkay/gallery/videos/thumbnails',
            }),
        ]);
        // 4. Update MongoDB record to status: 'ready'
        await gallery_model_1.VideoTestimonial.findByIdAndUpdate(videoId, {
            video_url: videoResult.secure_url,
            video_public_id: videoResult.public_id,
            thumbnail: thumbResult.secure_url,
            duration: durationStr,
            status: 'ready',
        });
    }
    catch (err) {
        console.error(`[VideoWorker] Transcode error for ${videoId}:`, err);
        await gallery_model_1.VideoTestimonial.findByIdAndUpdate(videoId, {
            status: 'failed',
        });
    }
    finally {
        // 5. Cleanup all temporary local files
        try {
            if (fs_1.default.existsSync(rawFilePath))
                fs_1.default.unlinkSync(rawFilePath);
            if (fs_1.default.existsSync(compressedFilePath))
                fs_1.default.unlinkSync(compressedFilePath);
            if (fs_1.default.existsSync(thumbnailFilePath))
                fs_1.default.unlinkSync(thumbnailFilePath);
        }
        catch {
            /* ignore cleanup errors */
        }
    }
}
//# sourceMappingURL=videoWorker.service.js.map