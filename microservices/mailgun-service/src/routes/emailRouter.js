/**
 * @file emailRoutes.js
 * @description Handles email sending using Mailgun and MongoDB templates.
 * @module emailRouter
 */

import express from "express";
import mailgun from "mailgun-js";
import { EmailTemplate } from "../models/emailTemplatesModel.js";

const router = express.Router();

// Initialize Mailgun
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

/**
 * Send an email using a template.
 * @route POST /send-email
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
router.post("/send-email", async (req, res) => {
  const { templateId, to, from, variables } = req.body;

  try {
    // Fetch template from MongoDB
    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Replace variables in HTML
    let html = template.html;
    for (const [key, value] of Object.entries(variables || {})) {
      html = html.replace(`{{${key}}}`, value);
    }

    const data = {
      from: from || "Your App <no-reply@yourdomain.com>",
      to,
      subject: template.subject,
      html,
    };

    // Send email
    await mg.messages().send(data);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;