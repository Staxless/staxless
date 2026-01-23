import express, { type Request, type Response, type Router } from 'express';
import { User } from '../models/user-model.js';

const router: Router = express.Router();

/**
 * GET /user/settings
 * Returns user settings including account info and subscription details.
 * Requires authenticated user (x-user-info header from Kong RBAC plugin).
 */
router.get('/user/settings', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user info from Kong RBAC plugin header
    const userInfoHeader = req.headers['x-user-info'];

    if (!userInfoHeader) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let userInfo: { id: string };
    try {
      userInfo = JSON.parse(
        typeof userInfoHeader === 'string' ? userInfoHeader : userInfoHeader[0]
      );
    } catch {
      res.status(400).json({ error: 'Invalid user info' });
      return;
    }

    const user = await User.findOne({ _id: userInfo.id });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Return sanitized user settings
    res.json({
      id: user._id,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email,
      avatar: user.avatar,
      subscription: {
        type: user.subscription?.type || 'free',
        status: user.subscription?.status || 'none',
        startDate: user.subscription?.startDate?.toISOString() || null,
        endDate: user.subscription?.endDate?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
