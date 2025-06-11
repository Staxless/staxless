
 
import express, { Router, Request, Response } from "express";
import mailgun, { Mailgun } from "mailgun-js";

const router: Router = express.Router();

interface EmailRequest {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
}

const mg: Mailgun = mailgun({
  apiKey: process.env.MAILGUN_API_KEY!,
  domain: process.env.MAILGUN_DOMAIN!,
});

router.post("/send", async (req: Request<{}, {}, EmailRequest>, res: Response) => {
  const { to, from, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: "Recipient, subject, and either text or HTML content are required" });
  }

  const data = {
    from: from || `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
    to,
    subject,
    text: text || "",
    html: html || "",
  };

  try {
    await mg.messages().send(data);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;