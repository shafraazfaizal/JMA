// src/app/community/quiz/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import {
  createQuizRegistration,
  getActiveQuizSession,
  getRegistrationsForMonth,
  markLinkSent,
  updateQuizSession,
  createQuizSession,
} from "@/lib/admin/quiz";
import type { AgeGroup, DBQuizSession } from "@/types/database";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Public: register for quiz ─────────────────────────────────

export async function registerForQuizAction(data: {
  child_name: string;
  age_group: AgeGroup;
  parent_name: string;
  parent_email: string;
  parent_phone?: string;
}): Promise<{ success: boolean; error?: string; alreadyRegistered?: boolean }> {
  try {
    const session = await getActiveQuizSession();
    if (!session) {
      return { success: false, error: "Registration is not currently open. Please check back soon." };
    }

    await createQuizRegistration({ ...data, quiz_month: session.quiz_month });

    // Confirmation to parent
    const quizDate = session.scheduled_at
      ? new Date(session.scheduled_at).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
      : "to be confirmed";

    await resend.emails.send({
      from: "JMA <noreply@jaffnamuslimuk.org>",
      to: data.parent_email,
      subject: `${data.child_name} is registered for the JMA Monthly Quiz`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <div style="background: #073D47; padding: 32px 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; font-size: 20px; margin: 0 0 4px;">You're Registered!</h1>
            <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">JMA Monthly Quiz — ${session.title}</p>
          </div>
          <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">Assalamu Alaikum ${data.parent_name},</p>
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
              Jazakallahu Khayran for registering <strong>${data.child_name}</strong> for the JMA Monthly Quiz! We're excited to have them participate Insha Allah.
            </p>
            <div style="background: #F9FAFB; border-radius: 8px; border-left: 3px solid #C9A84C; padding: 16px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0; width: 130px;">Quiz</td>
                  <td style="font-size: 14px; color: #111827; font-weight: 600; padding: 4px 0;">${session.title}</td>
                </tr>
                ${session.topic ? `
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0;">Topic</td>
                  <td style="font-size: 14px; color: #111827; padding: 4px 0;">${session.topic}</td>
                </tr>` : ""}
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0;">Date</td>
                  <td style="font-size: 14px; color: #111827; padding: 4px 0;">${quizDate}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #9CA3AF; padding: 4px 0;">Format</td>
                  <td style="font-size: 14px; color: #111827; padding: 4px 0;">Online (Zoom)</td>
                </tr>
              </table>
            </div>
            <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
              We will send you the Zoom link 24–48 hours before the quiz. Please make sure to keep an eye on this inbox. May Allah grant ${data.child_name} success!
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
      subject: `[Quiz] New registration — ${data.child_name} (${session.title})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #073D47; padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #ffffff; margin: 0; font-size: 16px;">New Quiz Registration</h2>
          </div>
          <div style="background: #ffffff; padding: 20px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 8px; font-size: 15px; color: #111827;"><strong>${data.child_name}</strong> (${data.age_group}) has registered for <strong>${session.title}</strong>.</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #6B7280;">Parent: ${data.parent_name} · ${data.parent_email}${data.parent_phone ? ` · ${data.parent_phone}` : ""}</p>
            <p style="margin: 12px 0 0; font-size: 13px; color: #9CA3AF;">View all registrants in the <a href="https://jaffnamuslimuk.org/admin/quiz" style="color: #0D5C6B;">admin dashboard</a>.</p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("[quiz:register]", err);
    // Unique constraint violation = already registered
    if (err instanceof Error && err.message.includes("unique")) {
      return { success: false, alreadyRegistered: true };
    }
    return { success: false, error: "Failed to register. Please try again." };
  }
}

// ── Admin: open / close registration ─────────────────────────

export async function openQuizRegistrationAction(input: {
  id: string;
  quiz_month: string;
  title: string;
  topic?: string;
  scheduled_at?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // First close any other open sessions
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase
      .from("quiz_sessions")
      .update({ registration_open: false })
      .eq("registration_open", true);

    await updateQuizSession(input.id, { registration_open: true });
    revalidatePath("/community/quiz");
    revalidatePath("/admin/quiz");
    return { success: true };
  } catch (err) {
    console.error("[quiz:open]", err);
    return { success: false, error: "Failed to open registration." };
  }
}

export async function closeQuizRegistrationAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateQuizSession(id, { registration_open: false });
    revalidatePath("/community/quiz");
    revalidatePath("/admin/quiz");
    return { success: true };
  } catch (err) {
    console.error("[quiz:close]", err);
    return { success: false, error: "Failed to close registration." };
  }
}

// ── Admin: send Zoom link to all registrants ──────────────────

export async function sendQuizLinkAction(
  sessionId: string,
  quizMonth: string,
  zoomLink: string
): Promise<{ success: boolean; error?: string; sent?: number }> {
  try {
    await updateQuizSession(sessionId, { zoom_link: zoomLink });
    const registrants = await getRegistrationsForMonth(quizMonth);

    if (registrants.length === 0) {
      return { success: true, sent: 0 };
    }

    const session = (await import("@/lib/admin/quiz")).getAllQuizSessions;
    // Get session details for the email
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: sessionData } = await supabase
      .from("quiz_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    const quizDate = sessionData?.scheduled_at
      ? new Date(sessionData.scheduled_at).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
      : "check your email for the time";

    // Resend batch — send individually (simpler than batch API for small lists)
    await Promise.all(
      registrants.map((r) =>
        resend.emails.send({
          from: "JMA <noreply@jaffnamuslimuk.org>",
          to: r.parent_email,
          subject: `Your Zoom link for the JMA Quiz — ${sessionData?.title ?? "Monthly Quiz"}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
              <div style="background: #073D47; padding: 32px 24px; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; font-size: 20px; margin: 0 0 4px;">Your Quiz Link is Here!</h1>
                <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">${sessionData?.title ?? "JMA Monthly Quiz"}</p>
              </div>
              <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
                <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">Assalamu Alaikum ${r.parent_name},</p>
                <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
                  The quiz is almost here! Here is the Zoom link for <strong>${r.child_name}</strong> to join Insha Allah
                </p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${zoomLink}" style="display: inline-block; background: #C9A84C; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                    Join the Quiz on Zoom
                  </a>
                </div>
                <div style="background: #F9FAFB; border-radius: 8px; border-left: 3px solid #C9A84C; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.7;">
                    <strong style="color: #374151;">Date:</strong> ${quizDate}<br />
                    ${sessionData?.topic ? `<strong style="color: #374151;">Topic:</strong> ${sessionData.topic}<br />` : ""}
                    <strong style="color: #374151;">Format:</strong> Online via Zoom — please join 5 minutes early
                  </p>
                </div>
                <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
                  May Allah bless ${r.child_name} and grant them success. We look forward to seeing them!
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
        })
      )
    );

    await markLinkSent(quizMonth);
    revalidatePath("/admin/quiz");
    return { success: true, sent: registrants.length };
  } catch (err) {
    console.error("[quiz:send-link]", err);
    return { success: false, error: "Failed to send links." };
  }
}

// ── Admin: publish winner ─────────────────────────────────────

export async function publishQuizWinnerAction(
  sessionId: string,
  winner: { name: string; age_group: string; prize: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateQuizSession(sessionId, {
      winner_name: winner.name,
      winner_age_group: winner.age_group as DBQuizSession["winner_age_group"],
      winner_prize: winner.prize,
      results_published: true,
      registration_open: false,
    });
    revalidatePath("/community/quiz");
    revalidatePath("/admin/quiz");
    return { success: true };
  } catch (err) {
    console.error("[quiz:publish-winner]", err);
    return { success: false, error: "Failed to publish winner." };
  }
}

// ── Admin: clear / remove winner ─────────────────────────────

export async function clearQuizWinnerAction(
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateQuizSession(sessionId, {
      winner_name: null,
      winner_age_group: null,
      winner_prize: null,
      results_published: false,
    });
    revalidatePath("/community/quiz");
    revalidatePath("/admin/quiz");
    return { success: true };
  } catch (err) {
    console.error("[quiz:clear-winner]", err);
    return { success: false, error: "Failed to clear winner." };
  }
}

// ── Admin: delete a past session ─────────────────────────────

export async function deleteQuizSessionAction(
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase
      .from("quiz_sessions")
      .delete()
      .eq("id", sessionId);
    if (error) throw error;
    revalidatePath("/admin/quiz");
    return { success: true };
  } catch (err) {
    console.error("[quiz:delete-session]", err);
    return { success: false, error: "Failed to delete session." };
  }
}

// ── Admin: create new quiz session ───────────────────────────

export async function createQuizSessionAction(input: {
  quiz_month: string;
  title: string;
  topic?: string;
  scheduled_at?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await createQuizSession(input);
    revalidatePath("/admin/quiz");
    return { success: true };
  } catch (err) {
    console.error("[quiz:create-session]", err);
    return { success: false, error: "Failed to create quiz session." };
  }
}