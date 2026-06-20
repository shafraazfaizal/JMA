"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Save } from "lucide-react";
import { uploadMedia } from "@/lib/supabase/storage";
import { createCampaignAction, updateCampaignAction } from "@/app/admin/campaigns/actions";
import {
    adminInputStyle, AdminFieldLabel, AdminFieldHint,
    onFocusBorder, onBlurBorder,
} from "@/components/admin/AdminFormFields";
import type { DBCampaign } from "@/types/database";

const categories: DBCampaign["category"][] = ["Infrastructure", "Education", "Healthcare", "Emergency", "Welfare"];
const statuses: DBCampaign["status"][] = ["active", "urgent", "completed"];

export default function CampaignForm({ campaign }: { campaign?: DBCampaign }) {
    const router = useRouter();
    const isEdit = !!campaign;

    const [imageUrl, setImageUrl] = useState(campaign?.image_url ?? "");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError("");
        try {
            const url = await uploadMedia(file, "campaigns");
            setImageUrl(url);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        formData.set("image_url", imageUrl);
        if (isEdit) {
            formData.set("slug", campaign.slug);
            await updateCampaignAction(campaign.id, formData);
        } else {
            await createCampaignAction(formData);
        }
    };

    return (
        <form action={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>

                {/* Title */}
                <div>
                    <AdminFieldLabel required>Campaign Title</AdminFieldLabel>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={campaign?.title}
                        placeholder="e.g. Mankumban Masjid Reconstruction"
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    {isEdit && (
                        <AdminFieldHint>URL: jaffnamuslims.org.uk/campaigns/{campaign.slug}</AdminFieldHint>
                    )}
                </div>

                {/* Short description */}
                <div>
                    <AdminFieldLabel required>Short Description</AdminFieldLabel>
                    <textarea
                        name="short_description"
                        required
                        rows={2}
                        defaultValue={campaign?.short_description}
                        placeholder="One or two sentences shown on campaign cards"
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.6 }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    <AdminFieldHint>Shown on the Campaigns grid and homepage cards.</AdminFieldHint>
                </div>

                {/* Full description */}
                <div>
                    <AdminFieldLabel required>Full Description</AdminFieldLabel>
                    <textarea
                        name="description"
                        required
                        rows={6}
                        defaultValue={campaign?.description}
                        placeholder="The full story of this campaign — shown on the campaign's own page"
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.7 }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                </div>

                {/* Category + Status */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel required>Category</AdminFieldLabel>
                        <select
                            name="category"
                            required
                            defaultValue={campaign?.category ?? "Infrastructure"}
                            style={{ ...adminInputStyle(), cursor: "pointer" }}
                        >
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <AdminFieldLabel required>Status</AdminFieldLabel>
                        <select
                            name="status"
                            required
                            defaultValue={campaign?.status ?? "active"}
                            style={{ ...adminInputStyle(), cursor: "pointer" }}
                        >
                            {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        <AdminFieldHint>&quot;Urgent&quot; shows a red badge on the live site.</AdminFieldHint>
                    </div>
                </div>

                {/* Goal + Raised */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel required>Fundraising Goal (£)</AdminFieldLabel>
                        <input
                            name="goal"
                            type="number"
                            min="1"
                            step="1"
                            required
                            defaultValue={campaign?.goal}
                            placeholder="12000"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel>Amount Raised So Far (£)</AdminFieldLabel>
                        <input
                            name="raised"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={campaign?.raised ?? 0}
                            placeholder="0"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                        <AdminFieldHint>Update this manually, or it updates automatically once Stripe is connected.</AdminFieldHint>
                    </div>
                </div>

                {/* Donor count + Days remaining */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel>Donor Count</AdminFieldLabel>
                        <input
                            name="donor_count"
                            type="number"
                            min="0"
                            defaultValue={campaign?.donor_count ?? 0}
                            placeholder="0"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel>Days Remaining <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></AdminFieldLabel>
                        <input
                            name="days_remaining"
                            type="number"
                            min="0"
                            defaultValue={campaign?.days_remaining ?? ""}
                            placeholder="Leave blank if no deadline"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                </div>

                {/* Image upload */}
                <div>
                    <AdminFieldLabel>Campaign Photo</AdminFieldLabel>
                    {imageUrl ? (
                        <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", height: "200px", border: "1.5px solid #E5E7EB" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="Campaign" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                style={{
                                    position: "absolute", top: "0.625rem", right: "0.625rem",
                                    width: "32px", height: "32px", borderRadius: "0.5rem",
                                    backgroundColor: "rgba(0,0,0,0.6)", border: "none", color: "#ffffff",
                                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                                }}
                                aria-label="Remove image"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        </div>
                    ) : (
                        <label
                            style={{
                                display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
                                gap: "0.625rem", height: "140px", borderRadius: "0.75rem",
                                border: "2px dashed #D1D5DB", backgroundColor: "#F9FAFB", cursor: "pointer",
                            }}
                        >
                            {uploading ? (
                                <Loader2 size={22} className="animate-spin" style={{ color: "#0D5C6B" }} aria-hidden="true" />
                            ) : (
                                <Upload size={22} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                            )}
                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                                {uploading ? "Uploading…" : "Click to upload a photo"}
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                        </label>
                    )}
                    {uploadError && <AdminFieldHint>{uploadError}</AdminFieldHint>}
                    <AdminFieldHint>If left empty, a teal gradient placeholder is shown instead.</AdminFieldHint>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F3F4F6" }}>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/campaigns")}
                        style={{
                            padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB",
                            backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem",
                            color: "#374151", cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                            padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "none",
                            backgroundColor: submitting ? "#094955" : "#0D5C6B", color: "#ffffff",
                            fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem",
                            cursor: submitting || uploading ? "not-allowed" : "pointer", transition: "background-color 0.2s ease",
                        }}
                    >
                        {submitting ? "Saving…" : (<><Save size={16} aria-hidden="true" /> {isEdit ? "Save Changes" : "Publish Campaign"}</>)}
                    </button>
                </div>
            </div>
        </form>
    );
}