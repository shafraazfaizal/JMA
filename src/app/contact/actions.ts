// src/app/contact/actions.ts
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  message: string;
}

export async function sendContactAction(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Email to secretary
    await resend.emails.send({
      from: "JMA Website <noreply@jaffnamuslimuk.org>",
      to: "jmauk.sec@gmail.com",
      replyTo: data.email,
      subject: `[${data.enquiryType}] New Enquiry from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <div style="background: #073D47; padding: 28px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #ffffff; margin: 0 0 4px; font-size: 18px;">New Contact Enquiry</h2>
            <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 13px;">Jaffna Muslim Association UK — Website</p>
          </div>
          <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF; width: 120px; vertical-align: top;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${data.name}</td>
              </tr>
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF; vertical-align: top;">Email</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;"><a href="mailto:${data.email}" style="color: #0D5C6B;">${data.email}</a></td>
              </tr>
              ${data.phone ? `
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF; vertical-align: top;">Phone</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">${data.phone}</td>
              </tr>` : ""}
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF; vertical-align: top;">Enquiry Type</td>
                <td style="padding: 8px 0;">
                  <span style="display: inline-block; background: #E8F4F6; color: #0D5C6B; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 9999px;">${data.enquiryType}</span>
                </td>
              </tr>
            </table>
            <div style="background: #F9FAFB; border-radius: 8px; border-left: 3px solid #C9A84C; padding: 16px;">
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
              <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="margin: 24px 0 0; font-size: 12px; color: #9CA3AF;">
              Reply directly to this email to respond to ${data.name}.
            </p>
          </div>
        </div>
      `,
    });

    // Auto-reply to sender
    await resend.emails.send({
      from: "JMA <noreply@jaffnamuslimuk.org>",
      to: data.email,
      subject: "We've received your message — Jaffna Muslim Association UK",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <div style="background: #073D47; padding: 32px 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; font-size: 20px; margin: 0 0 4px;">Message Received</h1>
            <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">Jaffna Muslim Association UK</p>
          </div>
          <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">Assalamu Alaikum ${data.name},</p>
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
              Jazakallahu Khairan for reaching out to us. We have received your message regarding <strong>${data.enquiryType}</strong> and will get back to you as soon as possible Insha Allah.
            </p>
            <div style="background: #F9FAFB; border-radius: 8px; border-left: 3px solid #C9A84C; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.7;">
                <strong style="color: #374151;">Response time:</strong> We aim to respond within 1–2 working days. For urgent Khardal Hasana matters, please contact us directly at <a href="mailto:kh@jaffnamuslimuk.org" style="color: #0D5C6B;">kh@jaffnamuslimuk.org</a>.
              </p>
            </div>
            <p style="margin: 0 0 4px; color: #374151; line-height: 1.6;">Wassalamu Alaikum Warahmatullahi Wabarakatuh,</p>
            <p style="margin: 0; font-weight: 600; color: #111827;">JMA UK Team</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
            <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.6;">
              UK Registered Charity No. 1143032 · <a href="https://jaffnamuslimuk.org" style="color: #0D5C6B;">jaffnamuslimuk.org</a>
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("[contact]", err);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}