"use server";

import { Resend } from "resend";

export type ContactFormState = {
    success: boolean;
    message: string;
} | null;

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL || "samvel.torosyan@tirsoft.co";

export async function submitContactForm(
    _prev: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const subject = formData.get("subject")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";

    if (!name || !email || !message) {
        return { success: false, message: "Please fill in all required fields." };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return { success: false, message: "Please enter a valid email address." };
    }

    const text = `
New Inquiry Received
Retrieve — Legal & Tax

Contact Details:
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Subject: ${subject || "N/A"}

Message:
${message}

---
Sent from retrieve.am contact form
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; line-height: 1.6;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #004791; padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">New Inquiry Received</h1>
                            <p style="color: #93c5fd; font-size: 14px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Retrieve &mdash; Legal &amp; Tax</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Contact Details</h2>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 15px;">
                                            <tr>
                                                <td width="30%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Name</td>
                                                <td width="70%" style="color: #111827; padding: 8px 0; font-weight: 600;">${name}</td>
                                            </tr>
                                            <tr>
                                                <td width="30%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Email</td>
                                                <td width="70%" style="padding: 8px 0;">
                                                    <a href="mailto:${email}" style="color: #005CB9; text-decoration: none; font-weight: 600;">${email}</a>
                                                </td>
                                            </tr>
                                            ${phone ? `
                                            <tr>
                                                <td width="30%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Phone</td>
                                                <td width="70%" style="color: #111827; padding: 8px 0; font-weight: 600;">
                                                    <a href="tel:${phone}" style="color: #111827; text-decoration: none;">${phone}</a>
                                                </td>
                                            </tr>` : ''}
                                            ${subject ? `
                                            <tr>
                                                <td width="30%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Subject</td>
                                                <td width="70%" style="color: #111827; padding: 8px 0; font-weight: 600;">${subject}</td>
                                            </tr>` : ''}
                                        </table>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td>
                                        <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Message</h2>
                                        <div style="color: #374151; font-size: 15px; line-height: 1.6; background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 13px; margin: 0;">This email was sent from the contact form on <a href="https://retrieve.am" style="color: #005CB9; text-decoration: none;">retrieve.am</a></p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} Retrieve LLC. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    try {
        await resend.emails.send({
            from: "Retrieve.am",
            to: TO_EMAIL,
            replyTo: email,
            subject: subject ? `[Contact] ${subject}` : `[Contact] New message from ${name}`,
            text,
            html,
        });

        return { success: true, message: "Your message has been sent! We'll get back to you shortly." };
    } catch (err) {
        console.error("Contact form email error:", err);
        return { success: false, message: "Something went wrong. Please try again or email us directly at info@retrieve.am." };
    }
}
