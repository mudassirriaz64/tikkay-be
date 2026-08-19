declare class SimpleQueue {
    private queue;
    private isProcessing;
    add<T>(task: () => Promise<T>): Promise<T>;
    private process;
}
export declare const videoQueue: SimpleQueue;
export interface VideoTranscodeJob {
    videoId: string;
    rawFilePath: string;
    originalFileName: string;
}
export declare function formatDuration(seconds: number): string;
export declare function processVideoJob(job: VideoTranscodeJob): Promise<void>;
export {};
//# sourceMappingURL=videoWorker.service.d.ts.map