"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL || "samotorosyan7@gmail.com";

export async function submitIntakeForm(data: {
    category: string;
    name: string;
    email: string;
    phone?: string;
}): Promise<{ success: boolean }> {
    const { category, name, email, phone } = data;

    if (!name || !email) return { success: false };

    const categoryLabels: Record<string, string> = {
        tax: "Tax & Business Advisory",
        corporate: "Corporate & Business Law",
        ip: "IP & Legal Services",
    };
    const serviceName = categoryLabels[category] ?? category;

    const text = `
New Consultation Request Received
Retrieve — Legal & Tax

Client Details:
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Service Area: ${serviceName}

---
Sent from retrieve.am Quick Intake Widget
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Consultation Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; line-height: 1.6;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #004791; padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">New Consultation Request</h1>
                            <p style="color: #93c5fd; font-size: 14px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Retrieve &mdash; Legal &amp; Tax</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Client Details</h2>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 15px;">
                                            <tr>
                                                <td width="35%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Name</td>
                                                <td width="65%" style="color: #111827; padding: 8px 0; font-weight: 600;">${name}</td>
                                            </tr>
                                            <tr>
                                                <td width="35%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Email</td>
                                                <td width="65%" style="padding: 8px 0;">
                                                    <a href="mailto:${email}" style="color: #005CB9; text-decoration: none; font-weight: 600;">${email}</a>
                                                </td>
                                            </tr>
                                            ${phone ? `
                                            <tr>
                                                <td width="35%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Phone</td>
                                                <td width="65%" style="color: #111827; padding: 8px 0; font-weight: 600;">
                                                    <a href="tel:${phone}" style="color: #111827; text-decoration: none;">${phone}</a>
                                                </td>
                                            </tr>` : ''}
                                            <tr>
                                                <td width="35%" style="color: #6b7280; padding: 8px 0; font-weight: 500;">Service Area</td>
                                                <td width="65%" style="padding: 8px 0; font-weight: 600;">
                                                    <span style="background-color: #eff6ff; color: #1d4ed8; padding: 6px 12px; border-radius: 99px; font-size: 13px;">${serviceName}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 13px; margin: 0;">This request was generated via the Quick Intake Widget on <a href="https://retrieve.am" style="color: #005CB9; text-decoration: none;">retrieve.am</a></p>
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
            from: "Retrieve.am <onboarding@resend.dev>",
            to: TO_EMAIL,
            replyTo: email,
            subject: `[Consultation Request] ${serviceName} — ${name}`,
            text,
            html,
        });
        return { success: true };
    } catch (err) {
        console.error("Intake form email error:", err);
        return { success: false };
    }
}
