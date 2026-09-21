// src/app/actions/newsletter.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletterAction(
  email: string
): Promise<{ success: boolean; error?: string; alreadySubscribed?: boolean }> {
  const supabase = await createClient();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.status === "active") {
      return { success: false, alreadySubscribed: true };
    }
    // Re-activate if previously unsubscribed
    await supabase
      .from("newsletter_subscribers")
      .update({ status: "active" })
      .eq("email", email);
  } else {
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, status: "active" });

    if (dbError) {
      console.error("[newsletter]", dbError.message);
      return { success: false, error: "Failed to subscribe. Please try again." };
    }
  }

  // Welcome email to subscriber
  await resend.emails.send({
    from: "JMA <noreply@jaffnamuslimuk.org>",
    to: email,
    subject: "Welcome to the JMA Newsletter — Thank you for subscribing",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
        <div style="background: #073D47; padding: 32px 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 4px;">Thank You</h1>
          <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">Jaffna Muslim Association UK</p>
        </div>
        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
            Assalamu Alaikum,
          </p>
          <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
            Thank you for subscribing to the JMA newsletter. You will now receive updates on our latest projects, impact stories, upcoming events, and seasonal appeals directly to your inbox Insha Allah
          </p>
          <div style="background: #F9FAFB; border-radius: 8px; border-left: 3px solid #C9A84C; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-style: italic; color: #374151; line-height: 1.7; font-size: 14px;">
              "Your generosity reaches families in Jaffna who need it most. Every contribution — large or small — makes a lasting difference on the ground."
            </p>
            <p style="margin: 8px 0 0; font-size: 13px; color: #9CA3AF;">— JMA Team</p>
          </div>
          <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
            If you ever wish to unsubscribe, simply reply to this email and we will remove you from the list immediately.
          </p>
          <p style="margin: 0; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
            UK Registered Charity No. 1143032 · <a href="https://jaffnamuslimuk.org" style="color: #0D5C6B;">jaffnamuslimuk.org</a>
          </p>
        </div>
      </div>
    `,
  });

  // Notify JMA of new subscriber
  await resend.emails.send({
    from: "JMA Website <noreply@jaffnamuslimuk.org>",
    to: "info@jaffnamuslimuk.org",
    cc: "jmauk.sec@gmail.com",
    subject: `New Newsletter Subscriber — ${email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #073D47; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 16px;">New Newsletter Subscriber</h2>
        </div>
        <div style="background: #ffffff; padding: 20px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 15px; color: #111827;"><strong>${email}</strong> has subscribed to the JMA newsletter.</p>
          <p style="margin: 12px 0 0; font-size: 13px; color: #9CA3AF;">View all subscribers in the <a href="https://jaffnamuslimuk.org/admin" style="color: #0D5C6B;">admin dashboard</a>.</p>
        </div>
      </div>
    `,
  });

  return { success: true };
}