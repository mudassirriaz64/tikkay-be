export declare const config: {
    PORT: number;
    NODE_ENV: "test" | "development" | "production";
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: number;
    CLIENT_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
};
export declare const CORS_OPTIONS: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
};
export declare const ROLES: {
    readonly ADMIN: "admin";
    readonly USER: "user";
};
export type UserRole = typeof ROLES[keyof typeof ROLES];
//# sourceMappingURL=index.d.ts.map