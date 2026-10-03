import type { Request, Response } from 'express';
import app from '../server';

/**
 * Vercel Serverless Function entry point.
 * Exposes the Express application handler for Vercel deployment.
 */
export default function handler(req: Request, res: Response) {
  return app(req, res);
}

export { app };
