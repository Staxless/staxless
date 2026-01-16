import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

const router = express.Router();

router.get(
  '/health',
  (_req: Request, res: Response, _next: NextFunction): void => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(healthcheck);
  }
);

export default router;
