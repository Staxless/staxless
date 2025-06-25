import express, { Router, Request, Response, NextFunction } from 'express';
import createEmailService from '../config/emailService';
import { mailgunClient } from '../config/mailgunClient';

const router: Router = express.Router();
const { sendEmail } = createEmailService(mailgunClient);

interface EmailRequest extends Request {
  body: { email: string; variables: Record<string, any> };
}

// Middleware for input validation
const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  const { email, variables } = req.body as { email: string; variables: Record<string, any> };
  if (!email || !variables || typeof variables !== 'object') {
    res.status(400).send('Invalid email or variables');
    return;
  }
  next();
};

router.post('/magic-link', validateInput, async (req: EmailRequest, res: Response) => {
  const { email, variables } = req.body;
   
  try {
    await sendEmail({ templateKey: 'magic-link', email, variables });
    res.send('Magic link sent');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

router.post('/welcome', validateInput, async (req: EmailRequest, res: Response) => {
  const { email, variables } = req.body;
  try {
    await sendEmail({ templateKey: 'welcome', email, variables });
    res.send('Welcome email sent');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

router.post('/purchase-confirmation', validateInput, async (req: EmailRequest, res: Response) => {
  const { email, variables } = req.body;
  try {
    await sendEmail({ templateKey: 'purchase-confirmation', email, variables });
    res.send('Purchase confirmation sent');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

export default router;