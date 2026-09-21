// src/app/community/showcase/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import {
    createShowcaseSubmission,
    updateShowcaseStatus,
    deleteShowcaseSubmission,
    type ShowcaseInput,
} from "@/lib/admin/showcase";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Public: submit a new showcase entry ───────────────────────

export async function submitShowcaseAction(
    data: ShowcaseInput
): Promise<{ success: boolean; error?: string }> {
    try {
        await createShowcaseSubmission(data);

        // Confirmation to parent
        await resend.emails.send({
            from: "JMA <noreply@jaffnamuslimuk.org>",
            to: data.parent_email,
            subject: `We've received ${data.child_name}'s submission — JMA Student Showcase`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <div style="background: #073D47; padding: 32px 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; font-size: 20px; margin: 0 0 4px;">Submission Received!</h1>
            <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">JMA Student Showcase</p>
          </div>
          <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">Assalamu Alaikum ${data.parent_name},</p>
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
              Jazakallahu Khayran for submitting on behalf of <strong>${data.child_name}</strong>! We have received their submission and our team will review it shortly Insha Allah
            </p>
            <div style="background: #F9FAFB; border-radius: 8px; border-left: 3px solid #C9A84C; padding: 16px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0; width: 130px;">Child's Name</td>
                  <td style="font-size: 14px; color: #111827; font-weight: 600; padding: 4px 0;">${data.child_name}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0;">Category</td>
                  <td style="font-size: 14px; color: #111827; padding: 4px 0;">${data.category}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0;">Title</td>
                  <td style="font-size: 14px; color: #111827; padding: 4px 0;">${data.title}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0;">Age Group</td>
                  <td style="font-size: 14px; color: #111827; padding: 4px 0;">${data.age_group}</td>
                </tr>
              </table>
            </div>
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
              Once reviewed, we will notify you when ${data.child_name}'s work is published on the showcase page. May Allah bless your child and reward your efforts.
            </p>
            <p style="margin: 0 0 4px; color: #374151;">Wassalamu Alaikum,</p>
            <p style="margin: 0; font-weight: 600; color: #111827;">JMA UK Team</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
            <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
              UK Registered Charity No. 1143032 · <a href="https://jaffnamuslimuk.org" style="color: #0D5C6B;">jaffnamuslimuk.org</a>
            </p>
          </div>
        </div>
      `,
        });

        // Notify admin
        await resend.emails.send({
            from: "JMA Website <noreply@jaffnamuslimuk.org>",
            to: "jmauk.sec@gmail.com",
            subject: `[Student Showcase] New ${data.category} submission from ${data.child_name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <div style="background: #073D47; padding: 28px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #ffffff; margin: 0 0 4px; font-size: 18px;">New Showcase Submission</h2>
            <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 13px;">JMA Student Showcase — awaiting review</p>
          </div>
          <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF; width: 130px;">Child's Name</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${data.child_name}</td>
              </tr>
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF;">Age Group</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">${data.age_group}</td>
              </tr>
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF;">Parent</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">${data.parent_name} · <a href="mailto:${data.parent_email}" style="color: #0D5C6B;">${data.parent_email}</a></td>
              </tr>
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF;">Category</td>
                <td style="padding: 8px 0;">
                  <span style="display: inline-block; background: #E8F4F6; color: #0D5C6B; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 9999px;">${data.category}</span>
                </td>
              </tr>
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF;">Title</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${data.title}</td>
              </tr>
              ${data.file_url ? `
              <tr style="border-top: 1px solid #F3F4F6;">
                <td style="padding: 8px 0; font-size: 13px; color: #9CA3AF;">File</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="${data.file_url}" style="color: #0D5C6B;">View attached file (${data.file_type})</a></td>
              </tr>` : ""}
            </table>
            <div style="background: #F9FAFB; border-radius: 8px; border-left: 3px solid #C9A84C; padding: 16px;">
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em;">Description</p>
              <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.7; white-space: pre-wrap;">${data.description}</p>
            </div>
            <p style="margin: 24px 0 0; font-size: 13px; color: #6B7280;">
              Review and publish this submission in the <a href="https://jaffnamuslimuk.org/admin/showcase" style="color: #0D5C6B;">admin dashboard</a>.
            </p>
          </div>
        </div>
      `,
        });

        return { success: true };
    } catch (err) {
        console.error("[showcase:submit]", err);
        return { success: false, error: "Failed to submit. Please try again." };
    }
}

// ── Admin: publish / reject / delete ─────────────────────────

export async function publishShowcaseAction(
    id: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await updateShowcaseStatus(id, "published");
        revalidatePath("/community/showcase");
        revalidatePath("/admin/showcase");
        return { success: true };
    } catch (err) {
        console.error("[showcase:publish]", err);
        return { success: false, error: "Failed to publish." };
    }
}

export async function rejectShowcaseAction(
    id: string,
    admin_note?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await updateShowcaseStatus(id, "rejected", admin_note);
        revalidatePath("/admin/showcase");
        return { success: true };
    } catch (err) {
        console.error("[showcase:reject]", err);
        return { success: false, error: "Failed to reject." };
    }
}

export async function deleteShowcaseAction(
    id: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await deleteShowcaseSubmission(id);
        revalidatePath("/community/showcase");
        revalidatePath("/admin/showcase");
        return { success: true };
    } catch (err) {
        console.error("[showcase:delete]", err);
        return { success: false, error: "Failed to delete." };
    }
}