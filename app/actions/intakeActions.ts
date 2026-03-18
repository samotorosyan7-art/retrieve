"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "samotorosyan7@gmail.com";

export async function submitIntakeForm(data: {
    category: string;
    name: string;
    email: string;
}): Promise<{ success: boolean }> {
    const { category, name, email } = data;

    if (!name || !email) return { success: false };

    const categoryLabels: Record<string, string> = {
        tax: "Tax & Business Advisory",
        corporate: "Corporate & Business Law",
        ip: "IP & Legal Services",
    };

    const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #f8faff; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #003d7a, #005CB9); padding: 32px 40px;">
                <h1 style="color: white; font-size: 24px; margin: 0; font-weight: 800;">New Consultation Request</h1>
                <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 14px;">RETRIEVE — Legal &amp; Tax (via Quick Intake Form)</p>
            </div>
            <div style="padding: 32px 40px; background: white; border-left: 4px solid #005CB9;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 140px; font-weight: 600;">Name</td><td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 15px;">${name}</td></tr>
                    <tr><td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #005CB9;">${email}</a></td></tr>
                    <tr><td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Service Area</td><td style="padding: 10px 0; color: #111827;">${categoryLabels[category] ?? category}</td></tr>
                </table>
            </div>
            <div style="padding: 20px 40px; background: #f8faff; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">Sent from retrieve.am quick intake widget</p>
            </div>
        </div>
    `;

    try {
        await resend.emails.send({
            from: "RETRIEVE Website <onboarding@resend.dev>",
            to: TO_EMAIL,
            replyTo: email,
            subject: `[Consultation Request] ${categoryLabels[category] ?? category} — ${name}`,
            html,
        });
        return { success: true };
    } catch (err) {
        console.error("Intake form email error:", err);
        return { success: false };
    }
}
