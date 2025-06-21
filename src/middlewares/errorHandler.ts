import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
  status?: number;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
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
