/// <reference types="node" />
/// <reference types="express" />
/// <reference types="cors" />
/// <reference types="morgan" />
/// <reference types="cookie-parser" />
/// <reference types="jsonwebtoken" />
/// <reference types="bcryptjs" />
/// <reference types="zod" />

declare module 'mongoose' {
  const mongoose: any;
  export default mongoose;
  export const Schema: any;
  export const model: any;
  export const Document: any;
  export const Types: any;
  export const Model: any;
  export const CallbackError: any;
  export function connect(uri: string, options?: any): Promise<any>;
  export const connection: any;
}

declare module 'dotenv' {
  const dotenv: { config: () => void };
  export default dotenv;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      MONGODB_URI?: string;
      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;
      JWT_COOKIE_EXPIRES_IN?: string;
      CLIENT_URL?: string;
    }
  }
}

export {};
