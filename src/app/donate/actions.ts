// src/app/donate/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitBankTransferAction(
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const receipt = formData.get("receipt") as File | null;
    const payment_ref = formData.get("payment_ref") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const donation_type = formData.get("donation_type") as string;
    const frequency = formData.get("frequency") as string;
    const campaign = formData.get("campaign") as string;
    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const gift_aid = formData.get("gift_aid") === "true";
    const is_dedication = formData.get("is_dedication") === "true";
    const dedication_type = formData.get("dedication_type") as string;
    const dedication_name = formData.get("dedication_name") as string;
    const dedication_message = formData.get("dedication_message") as string;

    if (!receipt || receipt.size === 0) {
        return { success: false, error: "Receipt is required." };
    }
    if (receipt.size > 5 * 1024 * 1024) {
        return { success: false, error: "Receipt must be under 5MB." };
    }

    // Upload receipt to Supabase storage
    const ext = receipt.name.split(".").pop();
    const path = `donations/receipts/${Date.now()}-${full_name.replace(/\s+/g, "-")}.${ext}`;
    const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, receipt, { contentType: receipt.type });

    if (uploadError) {
        console.error("[donate] receipt upload:", uploadError.message);
        return { success: false, error: "Failed to upload receipt. Please try again." };
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    const receipt_url = urlData.publicUrl;

    // Save to donations table
    const { error: dbError } = await supabase.from("donations").insert({
        full_name,
        email,
        phone: phone || null,
        amount,
        donation_type,
        frequency,
        campaign,
        payment_ref,
        receipt_url,
        gift_aid,
        is_dedication,
        dedication_type: is_dedication ? dedication_type : null,
        dedication_name: is_dedication ? dedication_name : null,
        dedication_message: is_dedication ? dedication_message : null,
        status: "pending_verification",
    });

    if (dbError) {
        console.error("[donate] db insert:", dbError.message);
        return { success: false, error: "Failed to save donation. Please try again." };
    }

    const giftAidBonus = gift_aid ? Math.round(amount * 0.25 * 100) / 100 : 0;
    const formattedAmount = `£${amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;

    // Donor confirmation email
    await resend.emails.send({
        from: "JMA <noreply@jaffnamuslimuk.org>",
        to: email,
        subject: `Donation Received — Thank you, ${full_name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
        <div style="background: #073D47; padding: 32px 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 4px;">JazakAllah Khair</h1>
          <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">Jaffna Muslim Association UK</p>
        </div>
        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">Dear ${full_name},</p>
          <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
            We have received your bank transfer and uploaded receipt. Our team will verify your payment and confirm within 24–48 hours. May Allah accept your donation and reward you abundantly.
          </p>
          <div style="background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB; padding: 16px; margin: 24px 0;">
            <p style="margin: 0 0 12px; font-weight: 700; font-size: 14px; color: #111827;">Donation Summary</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
              <tr><td style="padding: 6px 0; color: #6B7280; width: 45%;">Amount</td><td style="padding: 6px 0; font-weight: 700; color: #0D5C6B; font-size: 18px;">${formattedAmount}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280;">Donation Type</td><td style="padding: 6px 0;">${donation_type}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280;">Campaign</td><td style="padding: 6px 0;">${campaign}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280;">Payment Reference</td><td style="padding: 6px 0; font-weight: 600;">${payment_ref}</td></tr>
              ${gift_aid ? `<tr><td style="padding: 6px 0; color: #6B7280;">Gift Aid</td><td style="padding: 6px 0; color: #15803D; font-weight: 600;">+£${giftAidBonus.toFixed(2)} will be reclaimed by JMA</td></tr>` : ""}
              ${is_dedication ? `<tr><td style="padding: 6px 0; color: #6B7280;">${dedication_type}</td><td style="padding: 6px 0;">${dedication_name}</td></tr>` : ""}
            </table>
          </div>
          <p style="margin: 0; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
            If you have any questions, contact us at <a href="mailto:info@jaffnamuslimuk.org" style="color: #0D5C6B;">info@jaffnamuslimuk.org</a>
          </p>
        </div>
      </div>
    `,
    });

    // Committee notification email
    await resend.emails.send({
        from: "JMA Website <noreply@jaffnamuslimuk.org>",
        to: "info@jaffnamuslimuk.org",
        cc: "jmauk.sec@gmail.com",
        subject: `New Donation — ${formattedAmount} from ${full_name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
        <div style="background: #073D47; padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0 0 4px; font-size: 18px;">New Bank Transfer Donation</h2>
          <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 13px;">Pending verification</p>
        </div>
        <div style="background: #ffffff; padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280; width: 35%;">Donor</td><td style="padding: 10px 0; font-weight: 700;">${full_name}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0D5C6B;">${email}</a></td></tr>
            ${phone ? `<tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Phone</td><td style="padding: 10px 0;">${phone}</td></tr>` : ""}
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Amount</td><td style="padding: 10px 0; font-weight: 700; font-size: 18px; color: #0D5C6B;">${formattedAmount}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Type</td><td style="padding: 10px 0;">${donation_type}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Campaign</td><td style="padding: 10px 0;">${campaign}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Frequency</td><td style="padding: 10px 0;">${frequency}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Payment Ref</td><td style="padding: 10px 0; font-weight: 600;">${payment_ref}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Gift Aid</td><td style="padding: 10px 0;">${gift_aid ? `Yes — claim £${giftAidBonus.toFixed(2)} from HMRC` : "No"}</td></tr>
            ${is_dedication ? `<tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">${dedication_type}</td><td style="padding: 10px 0;">${dedication_name}${dedication_message ? ` — "${dedication_message}"` : ""}</td></tr>` : ""}
            <tr><td style="padding: 10px 0; color: #6B7280;">Receipt</td><td style="padding: 10px 0;"><a href="${receipt_url}" style="color: #0D5C6B; font-weight: 600;">View uploaded receipt →</a></td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 13px; color: #6B7280;">Please verify this transfer in your bank statement and update the donation status in the <a href="https://jaffnamuslimuk.org/admin" style="color: #0D5C6B;">admin dashboard</a>.</p>
        </div>
      </div>
    `,
    });

    return { success: true };
}