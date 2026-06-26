import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Initialize the Firebase Admin SDK
admin.initializeApp();

/**
 * Triggered automatically when a new inquiry is written to Firestore:
 * collection: "inquiries", document: "{inquiryId}"
 */
export const onInquiryCreated = functions.firestore
  .document("inquiries/{inquiryId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    if (!data) {
      functions.logger.error("[Email Trigger] Snapshot has no data. Skipping execution.");
      return;
    }

    const type = data.type;
    functions.logger.info(`[Email Trigger] Processing new inquiry: ${context.params.inquiryId} of type: ${type}`);

    // Fetch SMTP Credentials securely
    // Support modern environment variables (process.env) as well as Firebase Functions config fallback
    const smtpUser = process.env.SMTP_USER || functions.config().smtp?.user || "";
    const smtpPass = process.env.SMTP_PASS || functions.config().smtp?.pass || "";
    const smtpHost = process.env.SMTP_HOST || functions.config().smtp?.host || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || functions.config().smtp?.port || "587", 10);

    if (!smtpUser || !smtpPass) {
      functions.logger.error(
        "[Email Trigger] SMTP configurations are not provided. Please define SMTP_USER and SMTP_PASS secrets or run functions:config:set smtp.user=\"...\" smtp.pass=\"...\""
      );
      return;
    }

    // Nodemailer configuration using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for port 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const emailTo = "hello@balanzabikes.com";
    let emailSubject = "";
    let emailBody = "";
    let replyToEmail = "";

    // Parse values and clean inputs
    const sanitizeValue = (val: any): string => {
      if (val === null || val === undefined) return "Not specified";
      return String(val).trim();
    };

    // Determine inquiry type and structure exact requested template body
    if (type === "contact") {
      const fullName = sanitizeValue(data.fullName || data.name);
      const email = sanitizeValue(data.email);
      const phone = sanitizeValue(data.phone);
      const subject = sanitizeValue(data.subject);
      const message = sanitizeValue(data.message);
      const timestamp = sanitizeValue(data.submittedAt || data.createdAt?.toDate?.()?.toLocaleString() || new Date().toLocaleString());

      replyToEmail = email;
      emailSubject = "New Contact Form Submission";
      emailBody = `Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message: ${message}
Submitted At: ${timestamp}`;

    } else if (type === "dealer") {
      const businessName = sanitizeValue(data.businessName);
      const contactPerson = sanitizeValue(data.contactPerson);
      const email = sanitizeValue(data.email);
      const phone = sanitizeValue(data.phone);
      const city = sanitizeValue(data.city);
      const state = sanitizeValue(data.state);
      const website = sanitizeValue(data.website || data.socialLink);
      const businessType = sanitizeValue(data.businessType);
      const yearsInBusiness = sanitizeValue(data.yearsInBusiness || data.years);
      const storeLocations = sanitizeValue(data.storeLocations || data.storesCount);
      const businessDescription = sanitizeValue(data.businessDescription || data.about);
      const timestamp = sanitizeValue(data.submittedAt || data.createdAt?.toDate?.()?.toLocaleString() || new Date().toLocaleString());

      replyToEmail = email;
      emailSubject = "New Dealer Inquiry Received";
      emailBody = `Business Name: ${businessName}
Contact Person: ${contactPerson}
Email: ${email}
Phone: ${phone}
City: ${city}
State: ${state}
Website/Social Link: ${website}
Business Type: ${businessType}
Years In Business: ${yearsInBusiness}
Store Locations: ${storeLocations}
Business Description: ${businessDescription}
Submitted At: ${timestamp}`;

    } else {
      functions.logger.warn(`[Email Trigger] Unrecognized inquiry type: ${type}. Sending raw data payload.`);
      replyToEmail = sanitizeValue(data.email || "");
      emailSubject = `New Inquiry Submission (${type || "Unknown"})`;
      emailBody = JSON.stringify(data, null, 2);
    }

    try {
      const mailOptions = {
        from: `"${type === "dealer" ? "Dealer Desk" : "Contact System"}" <${smtpUser}>`,
        to: emailTo,
        replyTo: replyToEmail,
        subject: emailSubject,
        text: emailBody,
      };

      functions.logger.info(`[Email Trigger] Attempting outbound email delivery regarding: ${emailSubject} to: ${emailTo}`);
      const info = await transporter.sendMail(mailOptions);
      functions.logger.info(`[Email Trigger] Notification delivery succeeded! MessageId: ${info.messageId}`);
    } catch (error: any) {
      functions.logger.error(
        `[Email Trigger] Outbound email delivery aborted with error: ${error.message}`,
        error
      );
    }
  });
