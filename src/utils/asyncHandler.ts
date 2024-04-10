import { NextFunction, Response, Request } from "express";

const asyncHandler2 = (requestHandler: any) => {
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(res, req, next)).catch((err) => next(err));
  };
};

const asyncHandler =
  (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(res, req, next);
    } catch (err: any) {
      res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    }
  };

export { asyncHandler };
