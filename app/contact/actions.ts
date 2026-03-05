"use server";

import nodemailer from "nodemailer";

export type ContactFormState = {
    success: boolean;
    message: string;
} | null;

export async function submitContactForm(
    _prev: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const subject = formData.get("subject")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";

    // Basic validation
    if (!name || !email || !message) {
        return { success: false, message: "Please fill in all required fields." };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return { success: false, message: "Please enter a valid email address." };
    }

    const smtpHost = process.env.SMTP_HOST ?? "mail.retrieve.am";
    const smtpUser = process.env.SMTP_USER ?? "info@retrieve.am";
    const smtpPass = process.env.SMTP_PASS ?? "";
    const toEmail = process.env.CONTACT_TO_EMAIL ?? "info@retrieve.am";

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: false, // STARTTLS
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        tls: { rejectUnauthorized: false },
    });

    const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #f8faff; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #003d7a, #005CB9); padding: 32px 40px;">
                <h1 style="color: white; font-size: 24px; margin: 0; font-weight: 800;">New Contact Form Submission</h1>
                <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 14px;">RETRIEVE — Legal &amp; Tax</p>
            </div>
            <div style="padding: 32px 40px; background: white; margin: 0; border-left: 4px solid #005CB9;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 100px; font-weight: 600;">Name</td><td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 15px;">${name}</td></tr>
                    <tr><td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #005CB9;">${email}</a></td></tr>
                    ${phone ? `<tr><td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Phone</td><td style="padding: 10px 0; color: #111827;">${phone}</td></tr>` : ""}
                    ${subject ? `<tr><td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Subject</td><td style="padding: 10px 0; color: #111827;">${subject}</td></tr>` : ""}
                </table>
            </div>
            <div style="padding: 28px 40px; background: white; border-top: 1px solid #f0f0f0;">
                <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Message</p>
                <p style="color: #374151; font-size: 15px; line-height: 1.8; white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
            <div style="padding: 20px 40px; background: #f8faff; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">Sent from retrieve.am contact form</p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"RETRIEVE Website" <${smtpUser}>`,
            to: toEmail,
            replyTo: email,
            subject: subject ? `[Contact] ${subject}` : `[Contact] New message from ${name}`,
            html,
        });

        return { success: true, message: "Your message has been sent! We'll get back to you shortly." };
    } catch (err) {
        console.error("Contact form email error:", err);
        return { success: false, message: "Something went wrong. Please try again or email us directly at info@retrieve.am." };
    }
}
