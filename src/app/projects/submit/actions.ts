// src/app/projects/submit/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function generateReference(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("project_requests")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${year}-01-01`)
    .lte("created_at", `${year}-12-31`);

  const next = String((count ?? 0) + 1).padStart(3, "0");
  return `JMA-${year}-${next}`;
}

export async function submitProjectRequestAction(
  formData: FormData
): Promise<{ success: boolean; reference?: string; error?: string }> {
  const supabase = await createClient();

  const project_type = formData.get("project_type") as string;
  const title = formData.get("title") as string;
  const location_country = formData.get("location_country") as string;
  const location_city = formData.get("location_city") as string;
  const beneficiary_count = parseInt(formData.get("beneficiary_count") as string);
  const beneficiary_description = formData.get("beneficiary_description") as string;
  const estimated_cost = parseFloat(formData.get("estimated_cost") as string);
  const urgency = formData.get("urgency") as string;
  const description = formData.get("description") as string;
  const applicant_name = formData.get("applicant_name") as string;
  const applicant_email = formData.get("applicant_email") as string;
  const applicant_phone = formData.get("applicant_phone") as string;
  const relationship = formData.get("relationship_to_beneficiary") as string;
  const docFile = formData.get("document") as File | null;

  // Validate required fields
  if (!project_type || !title || !location_country || !location_city ||
    !beneficiary_description || !description || !applicant_name ||
    !applicant_email || !applicant_phone || !relationship) {
    return { success: false, error: "Please fill in all required fields." };
  }

  // Upload document if provided
  let document_url: string | null = null;
  if (docFile && docFile.size > 0) {
    if (docFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Document must be under 5MB." };
    }
    const ext = docFile.name.split(".").pop();
    const path = `project-requests/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, docFile, { contentType: "application/pdf" });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      document_url = urlData.publicUrl;
    }
  }

  const reference_number = await generateReference(supabase);

  // Insert into database
  const { error: dbError } = await supabase.from("project_requests").insert({
    reference_number,
    project_type,
    title,
    location_country,
    location_city,
    beneficiary_count,
    beneficiary_description,
    estimated_cost,
    urgency,
    description,
    document_url,
    applicant_name,
    applicant_email,
    applicant_phone,
    relationship_to_beneficiary: relationship,
    status: "pending",
  });

  if (dbError) {
    console.error("[submitProjectRequest]", dbError.message);
    return { success: false, error: "Failed to submit your request. Please try again." };
  }

  // Send confirmation email to applicant
  await resend.emails.send({
    from: "JMA <noreply@jaffnamuslimuk.org>",
    to: applicant_email,
    subject: `Project Request Received — ${reference_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
        <div style="background: #073D47; padding: 32px 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">Project Request Received</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 14px;">Jaffna Muslim Association UK</p>
        </div>
        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 16px;">Dear ${applicant_name},</p>
          <p style="margin: 0 0 16px; color: #374151; line-height: 1.6;">
            Thank you for submitting your project request to JMA. We have received your submission and the committee will review it carefully. We will get back to you at <strong>${applicant_email}</strong> with our decision or if any further information is required from your end.
          </p>
          <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Your Reference Number</p>
            <p style="margin: 0; font-size: 22px; font-weight: 800; color: #0D5C6B; letter-spacing: 0.04em;">${reference_number}</p>
          </div>
          <p style="margin: 0 0 8px; font-weight: 600; color: #111827;">Submission Summary</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
            <tr><td style="padding: 6px 0; color: #6B7280; width: 40%;">Project</td><td style="padding: 6px 0; font-weight: 600;">${title}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Type</td><td style="padding: 6px 0;">${project_type}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Location</td><td style="padding: 6px 0;">${location_city}, ${location_country}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Estimated Cost</td><td style="padding: 6px 0;">£${estimated_cost.toLocaleString()}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Urgency</td><td style="padding: 6px 0;">${urgency}</td></tr>
          </table>
          <p style="margin: 24px 0 0; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
            Please keep your reference number for any future correspondence. If you have questions, contact us at info@jaffnamuslimuk.org.
          </p>
        </div>
      </div>
    `,
  });

  // Send notification email to JMA committee
  await resend.emails.send({
    from: "JMA Website <noreply@jaffnamuslimuk.org>",
    to: "info@jaffnamuslimuk.org",
    cc: "jmauk.sec@gmail.com",
    subject: `[${urgency.toUpperCase()}] New Project Request — ${reference_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
        <div style="background: ${urgency === "Urgent" ? "#DC2626" : "#073D47"}; padding: 24px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0 0 4px; font-size: 18px;">New Project Request — ${urgency} Priority</h2>
          <p style="color: rgba(255,255,255,0.75); margin: 0; font-size: 13px;">Ref: ${reference_number}</p>
        </div>
        <div style="background: #ffffff; padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280; width: 35%;">Project Title</td><td style="padding: 10px 0; font-weight: 700;">${title}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Type</td><td style="padding: 10px 0;">${project_type}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Location</td><td style="padding: 10px 0;">${location_city}, ${location_country}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Beneficiaries</td><td style="padding: 10px 0;">${beneficiary_count} person(s) — ${beneficiary_description}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Estimated Cost</td><td style="padding: 10px 0; font-weight: 700;">£${estimated_cost.toLocaleString()}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Urgency</td><td style="padding: 10px 0;">${urgency}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Applicant</td><td style="padding: 10px 0;">${applicant_name} (${relationship})</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Email</td><td style="padding: 10px 0;">${applicant_email}</td></tr>
            <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Phone</td><td style="padding: 10px 0;">${applicant_phone}</td></tr>
            ${document_url ? `<tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 10px 0; color: #6B7280;">Document</td><td style="padding: 10px 0;"><a href="${document_url}" style="color: #0D5C6B;">View uploaded document</a></td></tr>` : ""}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #F9FAFB; border-radius: 8px;">
            <p style="margin: 0 0 8px; font-weight: 600; font-size: 14px;">Full Description</p>
            <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${description}</p>
          </div>
          <p style="margin-top: 20px; font-size: 13px; color: #6B7280;">Review this request in the <a href="https://jaffnamuslimuk.org/admin/project-requests" style="color: #0D5C6B;">JMA Admin Dashboard</a>.</p>
        </div>
      </div>
    `,
  });

  return { success: true, reference: reference_number };
}