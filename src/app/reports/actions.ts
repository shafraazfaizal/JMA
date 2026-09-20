"use server";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SERVICE ROLE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitReportRequest(formData: {
    name: string;
    email: string;
    organisation: string;
    reason: string;
    reportYear: string;
}) {
    const { name, email, organisation, reason, reportYear } = formData;

    // Store in Supabase
    await supabase.from("report_requests").insert({
        name,
        email,
        organisation: organisation || null,
        reason: reason || null,
        report_year: reportYear,
    });

    // Email to requester
    await resend.emails.send({
        from: "JMA UK <info@jaffnamuslimuk.org>",
        to: email,
        subject: `Your Report Request — JMA Annual Report ${reportYear}`,
        html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
                <div style="background: #0D5C6B; padding: 32px 40px;">
                    <p style="color: #C9A84C; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px;">Jaffna Muslim Association UK</p>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0;">Report Request Received</h1>
                </div>
                <div style="padding: 32px 40px; border: 1px solid #E5E7EB; border-top: none;">
                    <p style="color: #374151; line-height: 1.7;">As-salāmu ʿalaykum ${name},</p>
                    <p style="color: #374151; line-height: 1.7;">Thank you for requesting the <strong>JMA Annual Report ${reportYear}</strong>. We have received your request and our team will be in touch shortly with the report.</p>
                    <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 24px 0;">
                        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Your Request</p>
                        <p style="margin: 0; color: #111827; font-weight: 700;">Annual Report ${reportYear}</p>
                        ${organisation ? `<p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${organisation}</p>` : ""}
                    </div>
                    <p style="color: #374151; line-height: 1.7;">If you have any questions in the meantime, please don't hesitate to contact us at <a href="mailto:info@jaffnamuslimuk.org" style="color: #0D5C6B;">info@jaffnamuslimuk.org</a>.</p>
                    <p style="color: #374151; line-height: 1.7;">Thank You,<br/><strong>JMA UK Team</strong></p>
                </div>
                <div style="padding: 20px 40px; background: #F9FAFB; border: 1px solid #E5E7EB; border-top: none; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #9CA3AF;">Jaffna Muslim Association UK · <a href="https://www.jaffnamuslimuk.org" style="color: #0D5C6B;">jaffnamuslimuk.org</a></p>
                </div>
            </div>
        `,
    });

    // Email to committee
    await resend.emails.send({
        from: "JMA UK Website <info@jaffnamuslimuk.org>",
        to: "info@jaffnamuslimuk.org",
        cc: "jmauk.sec@gmail.com",
        subject: `New Report Request — Annual Report ${reportYear}`,
        html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
                <div style="background: #0D5C6B; padding: 32px 40px;">
                    <p style="color: #C9A84C; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 8px;">Admin Notification</p>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0;">New Report Request</h1>
                </div>
                <div style="padding: 32px 40px; border: 1px solid #E5E7EB; border-top: none;">
                    <p style="color: #374151;">A new annual report has been requested via the website.</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="border-bottom: 1px solid #F3F4F6;">
                            <td style="padding: 10px 0; font-size: 13px; color: #6B7280; width: 140px;">Name</td>
                            <td style="padding: 10px 0; font-weight: 600; color: #111827;">${name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #F3F4F6;">
                            <td style="padding: 10px 0; font-size: 13px; color: #6B7280;">Email</td>
                            <td style="padding: 10px 0; font-weight: 600; color: #111827;"><a href="mailto:${email}" style="color: #0D5C6B;">${email}</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #F3F4F6;">
                            <td style="padding: 10px 0; font-size: 13px; color: #6B7280;">Report Year</td>
                            <td style="padding: 10px 0; font-weight: 600; color: #111827;">${reportYear}</td>
                        </tr>
                        ${organisation ? `<tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; font-size: 13px; color: #6B7280;">Organisation</td><td style="padding: 10px 0; color: #111827;">${organisation}</td></tr>` : ""}
                        ${reason ? `<tr><td style="padding: 10px 0; font-size: 13px; color: #6B7280; vertical-align: top;">Reason</td><td style="padding: 10px 0; color: #111827; line-height: 1.6;">${reason}</td></tr>` : ""}
                    </table>
                    <p style="color: #6B7280; font-size: 13px;">Please send the requested report to the email address above.</p>
                </div>
            </div>
        `,
    });

    return { success: true };
}