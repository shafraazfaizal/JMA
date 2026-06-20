"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Save } from "lucide-react";
import { uploadMedia } from "@/lib/supabase/storage";
import { createEventAction, updateEventAction } from "@/app/admin/events/actions";
import { isEventPast } from "@/lib/admin/events-utils";
import {
    adminInputStyle, AdminFieldLabel, AdminFieldHint,
    onFocusBorder, onBlurBorder,
} from "@/components/admin/AdminFormFields";
import type { DBEvent } from "@/types/database";

export default function EventForm({ event }: { event?: DBEvent }) {
    const router = useRouter();
    const isEdit = !!event;

    const [imageUrl, setImageUrl] = useState(event?.image_url ?? "");
    const [eventDate, setEventDate] = useState(event?.event_date ?? "");
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError("");
        try {
            const url = await uploadMedia(file, "events");
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
            formData.set("slug", event.slug);
            await updateEventAction(event.id, formData);
        } else {
            await createEventAction(formData);
        }
    };

    const willBePast = eventDate ? isEventPast(eventDate) : false;

    return (
        <form action={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>

                {/* Title */}
                <div>
                    <AdminFieldLabel required>Event Title</AdminFieldLabel>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={event?.title}
                        placeholder="e.g. JMA Annual Fundraising Dinner 2025"
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    {isEdit && <AdminFieldHint>URL: jaffnamuslims.org.uk/events/{event.slug}</AdminFieldHint>}
                </div>

                {/* Description */}
                <div>
                    <AdminFieldLabel required>Description</AdminFieldLabel>
                    <textarea
                        name="description"
                        required
                        rows={5}
                        defaultValue={event?.description}
                        placeholder="Describe what this event is about, who it's for, and what to expect"
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.7 }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                </div>

                {/* Date + Time */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel required>Event Date</AdminFieldLabel>
                        <input
                            name="event_date"
                            type="date"
                            required
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                        {eventDate && (
                            <AdminFieldHint>
                                Will show as {willBePast ? <strong style={{ color: "#9CA3AF" }}>Past</strong> : <strong style={{ color: "#0D5C6B" }}>Upcoming</strong>} on the live site (calculated automatically from this date).
                            </AdminFieldHint>
                        )}
                    </div>
                    <div>
                        <AdminFieldLabel required>Event Time</AdminFieldLabel>
                        <input
                            name="event_time"
                            type="text"
                            required
                            defaultValue={event?.event_time}
                            placeholder="e.g. 6:30 PM"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                </div>

                {/* Location + Address */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel required>Location (City)</AdminFieldLabel>
                        <input
                            name="location"
                            type="text"
                            required
                            defaultValue={event?.location}
                            placeholder="e.g. Manchester"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel>Full Address <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></AdminFieldLabel>
                        <input
                            name="address"
                            type="text"
                            defaultValue={event?.address ?? ""}
                            placeholder="e.g. Mercure Manchester Piccadilly, Portland St"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                </div>

                {/* Image upload */}
                <div>
                    <AdminFieldLabel>Event Photo</AdminFieldLabel>
                    {imageUrl ? (
                        <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", height: "200px", border: "1.5px solid #E5E7EB" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="Event" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                    {uploadError && <AdminFieldHint>{uploadError}</AdminFieldHint>}
                    <AdminFieldHint>If left empty, a teal gradient placeholder is shown instead.</AdminFieldHint>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F3F4F6" }}>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/events")}
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
                        {submitting ? "Saving…" : (<><Save size={16} aria-hidden="true" /> {isEdit ? "Save Changes" : "Publish Event"}</>)}
                    </button>
                </div>
            </div>
        </form>
    );
}