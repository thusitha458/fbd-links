import { Request, Response } from 'express';

interface ApiError extends Error {
  status?: number;
}

export const errorHandler = (
  error: ApiError,
  _req: Request,
  res: Response,
): void => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  
  console.error(`[ERROR] ${message}`);
  
  res.status(status).json({
    error: {
      status,
      message
    }
  });
};

export default errorHandler;
