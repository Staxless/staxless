/**
 * @file emailRoutes.js
 * @description Handles email sending using Mailgun, with support for MongoDB templates and direct email content.
 * @module emailRouter
 */

import express from "express";
import mailgun from "mailgun-js";
// import { EmailTemplate } from "../models/emailTemplatesModel.js";

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
//  */
// router.post("/send-email", async (req, res) => {
//   const { templateId, to, from, variables } = req.body;

//   try {
//     // Fetch template from MongoDB
//     const template = await EmailTemplate.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ error: "Template not found" });
//     }

//     // Replace variables in HTML
//     let html = template.html;
//     for (const [key, value] of Object.entries(variables || {})) {
//       html = html.replace(`{{${key}}}`, value);
//     }

//     const data = {
//       from: from || "Your App <no-reply@yourdomain.com>",
//       to,
//       subject: template.subject,
//       html,
//     };

//     // Send email
//     await mg.messages().send(data);
//     return res.status(200).json({ message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return res.status(500).json({ error: "Failed to send email" });
//   }
// });

/**
 * Send an email with provided content.
 * @route POST /email
 * @param {Object} req.body.to - Recipient email address
 * @param {Object} req.body.from - Sender email address (optional)
 * @param {Object} req.body.subject - Email subject
 * @param {Object} req.body.text - Plain text email body
 * @param {Object} req.body.html - HTML email body
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 * @throws 400 if required fields are missing, 500 on server error
 */
router.post("/send", async (req, res) => {
  const { to, from, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: "Recipient, subject, and either text or HTML content are required" });
  }

  try {
    const data = {
      from: "Mailgun Sandbox <postmaster@sandboxc84e20d8cf4941c0b1fc96e8f3af303f.mailgun.org>" || "Staxless <no-reply@staxless.com>",
      to,
      subject,
      text: text || "",
      html: html || "",
    };

    console.log("Email data:", data); // Debugging log
    // Send email
    await mg.messages().send(data);
    console.log("Email sent successfully"); // Debugging log
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;