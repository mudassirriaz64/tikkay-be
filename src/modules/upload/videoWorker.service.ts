import path from 'path';
import fs from 'fs';
import os from 'os';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { v2 as cloudinary } from 'cloudinary';
import { VideoTestimonial } from '../gallery/gallery.model';

// Configure ffmpeg static binary path if available
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

// Lightweight in-memory queue with concurrency: 1 (CommonJS safe)
class SimpleQueue {
  private queue: (() => Promise<unknown>)[] = [];
  private isProcessing = false;

  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const res = await task();
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
      void this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;
    const task = this.queue.shift();
    if (task) {
      try {
        await task();
      } catch (err) {
        console.error('Queue task error:', err);
      }
    }
    this.isProcessing = false;
    if (this.queue.length > 0) {
      void this.process();
    }
  }
}

export const videoQueue = new SimpleQueue();

export interface VideoTranscodeJob {
  videoId: string;
  rawFilePath: string;
  originalFileName: string;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export async function processVideoJob(job: VideoTranscodeJob): Promise<void> {
  const { videoId, rawFilePath } = job;
  const tempDir = path.join(os.tmpdir(), 'tikkay-transcode');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const compressedFilePath = path.join(tempDir, `compressed-${videoId}.mp4`);
  const thumbnailFilePath = path.join(tempDir, `thumb-${videoId}.jpg`);

  try {
    // 1. Run FFmpeg compression & generate poster thumbnail
    await new Promise<void>((resolve, reject) => {
      ffmpeg(rawFilePath)
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
      await new Promise<void>((resolve) => {
        ffmpeg.ffprobe(compressedFilePath, (err, metadata) => {
          if (!err && metadata?.format?.duration) {
            durationStr = formatDuration(metadata.format.duration);
          }
          resolve();
        });
      });
    } catch {
      /* fallback duration */
    }

    // 3. Upload Compressed Video & Thumbnail to Cloudinary
    const [videoResult, thumbResult] = await Promise.all([
      cloudinary.uploader.upload_large(compressedFilePath, {
        resource_type: 'video',
        folder: 'tikkayshikkay/gallery/videos',
      }),
      cloudinary.uploader.upload(thumbnailFilePath, {
        resource_type: 'image',
        folder: 'tikkayshikkay/gallery/videos/thumbnails',
      }),
    ]);

    // 4. Update MongoDB record to status: 'ready'
    await VideoTestimonial.findByIdAndUpdate(videoId, {
      video_url: videoResult.secure_url,
      video_public_id: videoResult.public_id,
      thumbnail: thumbResult.secure_url,
      duration: durationStr,
      status: 'ready',
    });
  } catch (err: any) {
    console.error(`[VideoWorker] Transcode error for ${videoId}:`, err);
    await VideoTestimonial.findByIdAndUpdate(videoId, {
      status: 'failed',
    });
  } finally {
    // 5. Cleanup all temporary local files
    try {
      if (fs.existsSync(rawFilePath)) fs.unlinkSync(rawFilePath);
      if (fs.existsSync(compressedFilePath)) fs.unlinkSync(compressedFilePath);
      if (fs.existsSync(thumbnailFilePath)) fs.unlinkSync(thumbnailFilePath);
    } catch {
      /* ignore cleanup errors */
    }
  }
}
