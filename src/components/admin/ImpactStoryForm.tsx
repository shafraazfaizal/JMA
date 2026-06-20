"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Save } from "lucide-react";
import { uploadMedia } from "@/lib/supabase/storage";
import { createImpactStoryAction, updateImpactStoryAction } from "@/app/admin/impact/actions";
import {
    adminInputStyle, AdminFieldLabel, AdminFieldHint,
    onFocusBorder, onBlurBorder,
} from "@/components/admin/AdminFormFields";
import type { DBImpactStory } from "@/types/database";

const categories: DBImpactStory["category"][] = ["Infrastructure", "Education", "Healthcare", "Emergency", "Welfare"];

export default function ImpactStoryForm({ story }: { story?: DBImpactStory }) {
    const router = useRouter();
    const isEdit = !!story;

    const [imageUrl, setImageUrl] = useState(story?.image_url ?? "");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const url = await uploadMedia(file, "stories");
            setImageUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        formData.set("image_url", imageUrl);

        if (isEdit) {
            await updateImpactStoryAction(story.id, formData);
        } else {
            await createImpactStoryAction(formData);
        }
    };

    return (
        <form action={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>

                {/* Name + Age */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel required>Person&apos;s Name</AdminFieldLabel>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={story?.name}
                            placeholder="e.g. Fathima Nusrath"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel>Age <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></AdminFieldLabel>
                        <input
                            name="age"
                            type="number"
                            min="0"
                            defaultValue={story?.age ?? ""}
                            placeholder="14"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                </div>

                {/* Location + Category */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel required>Location</AdminFieldLabel>
                        <input
                            name="location"
                            type="text"
                            required
                            defaultValue={story?.location}
                            placeholder="e.g. Mankumban, Jaffna"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel required>Category</AdminFieldLabel>
                        <select
                            name="category"
                            required
                            defaultValue={story?.category ?? "Education"}
                            style={{ ...adminInputStyle(), cursor: "pointer" }}
                        >
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Quote */}
                <div>
                    <AdminFieldLabel required>Quote</AdminFieldLabel>
                    <textarea
                        name="quote"
                        required
                        rows={3}
                        defaultValue={story?.quote}
                        placeholder="A first-person quote from the person, in their own words"
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.6, fontFamily: "var(--font-noto)", fontStyle: "italic" as const }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    <AdminFieldHint>Displayed in italic serif on the Impact page — write it as a direct quote.</AdminFieldHint>
                </div>

                {/* Detail */}
                <div>
                    <AdminFieldLabel required>Detail / Context</AdminFieldLabel>
                    <textarea
                        name="detail"
                        required
                        rows={3}
                        defaultValue={story?.detail}
                        placeholder="One or two sentences of factual context about the project or support given"
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.6 }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                </div>

                {/* Display order */}
                <div style={{ maxWidth: "200px" }}>
                    <AdminFieldLabel>Display Order</AdminFieldLabel>
                    <input
                        name="display_order"
                        type="number"
                        min="0"
                        defaultValue={story?.display_order ?? 0}
                        placeholder="0"
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    <AdminFieldHint>Lower numbers appear first in the carousel.</AdminFieldHint>
                </div>

                {/* Photo */}
                <div>
                    <AdminFieldLabel>Photo</AdminFieldLabel>
                    {imageUrl ? (
                        <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", height: "200px", border: "1.5px solid #E5E7EB" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="Story" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                style={{ position: "absolute", top: "0.625rem", right: "0.625rem", width: "32px", height: "32px", borderRadius: "0.5rem", backgroundColor: "rgba(0,0,0,0.6)", border: "none", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                aria-label="Remove image"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        </div>
                    ) : (
                        <label style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.625rem", height: "140px", borderRadius: "0.75rem", border: "2px dashed #D1D5DB", backgroundColor: "#F9FAFB", cursor: "pointer" }}>
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
                    {error && <AdminFieldHint>{error}</AdminFieldHint>}
                    <AdminFieldHint>If left empty, a coloured initials avatar is shown instead — matching the homepage carousel style.</AdminFieldHint>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F3F4F6" }}>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/impact")}
                        style={{ padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: "pointer" }}
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
                        {submitting ? "Saving…" : (<><Save size={16} aria-hidden="true" /> {isEdit ? "Save Changes" : "Publish Story"}</>)}
                    </button>
                </div>
            </div>
        </form>
    );
}