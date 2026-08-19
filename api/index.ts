import { Request, Response } from 'express';
import app from '../src/app';
import { connectDB } from '../src/config/db';

export default async function handler(req: Request, res: Response) {
  const origin = req.headers.origin as string | undefined;

  // Dynamically reflect origin for trusted Vercel and local deployments
  if (
    origin &&
    (origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1'))
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://tikkay-shikkay.vercel.app');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie, Set-Cookie'
  );

  // Intercept and resolve preflight immediately with HTTP OK (204)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    await connectDB();
  } catch (err: any) {
    console.error('MongoDB connection error in serverless handler:', err?.message, err?.stack || err);
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable - database connection failed',
    });
  }

  return app(req, res);
}

