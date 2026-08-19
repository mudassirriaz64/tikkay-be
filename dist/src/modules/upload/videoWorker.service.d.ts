import PQueue from 'p-queue';
export declare const videoQueue: PQueue<import("p-queue").PriorityQueue, import("p-queue").QueueAddOptions>;
export interface VideoTranscodeJob {
    videoId: string;
    rawFilePath: string;
    originalFileName: string;
}
export declare function formatDuration(seconds: number): string;
export declare function processVideoJob(job: VideoTranscodeJob): Promise<void>;
//# sourceMappingURL=videoWorker.service.d.ts.map