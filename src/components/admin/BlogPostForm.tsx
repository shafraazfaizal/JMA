"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Save } from "lucide-react";
import { uploadMedia } from "@/lib/supabase/storage";
import { createBlogPostAction, updateBlogPostAction } from "@/app/admin/blog/actions";
import { estimateReadTime } from "@/lib/admin/blog-utils";
import {
    adminInputStyle, AdminFieldLabel, AdminFieldHint,
    onFocusBorder, onBlurBorder,
} from "@/components/admin/AdminFormFields";
import type { DBBlogPost } from "@/types/database";

const suggestedCategories = ["Reflections", "Opinion", "Ramadan Diary", "Community Voices", "Faith & Practice"];

export default function BlogPostForm({ post }: { post?: DBBlogPost }) {
    const router = useRouter();
    const isEdit = !!post;

    const [imageUrl, setImageUrl] = useState(post?.image_url ?? "");
    const [content, setContent] = useState(post?.content ?? "");
    const [readTime, setReadTime] = useState(post?.read_time ?? 4);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const url = await uploadMedia(file, "blog");
            setImageUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);
        if (!post) {
            setReadTime(estimateReadTime(value));
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        formData.set("image_url", imageUrl);
        formData.set("read_time", String(readTime));

        if (isEdit) {
            formData.set("slug", post.slug);
            await updateBlogPostAction(post.id, formData);
        } else {
            await createBlogPostAction(formData);
        }
    };

    return (
        <form action={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>

                {/* Title */}
                <div>
                    <AdminFieldLabel required>Post Title</AdminFieldLabel>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={post?.title}
                        placeholder="e.g. Why We Give: Reflections on Sadaqah Jariyah"
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    {isEdit && <AdminFieldHint>URL: jaffnamuslims.org.uk/blog/{post.slug}</AdminFieldHint>}
                </div>

                {/* Category */}
                <div>
                    <AdminFieldLabel>Category</AdminFieldLabel>
                    <input
                        name="category"
                        type="text"
                        list="category-suggestions"
                        defaultValue={post?.category ?? "Reflections"}
                        placeholder="e.g. Reflections"
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    <datalist id="category-suggestions">
                        {suggestedCategories.map((c) => <option key={c} value={c} />)}
                    </datalist>
                    <AdminFieldHint>Free text — pick from suggestions or type your own.</AdminFieldHint>
                </div>

                {/* Author name + role */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel required>Author Name</AdminFieldLabel>
                        <input
                            name="author_name"
                            type="text"
                            required
                            defaultValue={post?.author_name}
                            placeholder="e.g. Mohamed Fazil"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel>Author Role <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></AdminFieldLabel>
                        <input
                            name="author_role"
                            type="text"
                            defaultValue={post?.author_role ?? ""}
                            placeholder="e.g. JMA Chairman, Guest Contributor"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                </div>

                {/* Published date */}
                <div style={{ maxWidth: "280px" }}>
                    <AdminFieldLabel required>Publish Date</AdminFieldLabel>
                    <input
                        name="published_at"
                        type="date"
                        required
                        defaultValue={post ? post.published_at.split("T")[0] : new Date().toISOString().split("T")[0]}
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <AdminFieldLabel required>Excerpt</AdminFieldLabel>
                    <textarea
                        name="excerpt"
                        required
                        rows={2}
                        defaultValue={post?.excerpt}
                        placeholder="One or two sentences shown on blog cards"
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.6 }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                </div>

                {/* Content */}
                <div>
                    <AdminFieldLabel required>Post Content</AdminFieldLabel>
                    <textarea
                        name="content"
                        required
                        rows={12}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write the full post here. Leave a blank line between paragraphs."
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.7, fontFamily: "var(--font-inter)" }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    <AdminFieldHint>Separate paragraphs with a blank line — they&apos;ll display as proper paragraphs on the site.</AdminFieldHint>
                </div>

                {/* Read time */}
                <div style={{ maxWidth: "200px" }}>
                    <AdminFieldLabel>Read Time (minutes)</AdminFieldLabel>
                    <input
                        type="number"
                        min="1"
                        value={readTime}
                        onChange={(e) => setReadTime(Number(e.target.value) || 1)}
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    <AdminFieldHint>Auto-estimated from your content — adjust if needed.</AdminFieldHint>
                </div>

                {/* Cover image */}
                <div>
                    <AdminFieldLabel>Cover Image</AdminFieldLabel>
                    {imageUrl ? (
                        <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", height: "200px", border: "1.5px solid #E5E7EB" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                                {uploading ? "Uploading…" : "Click to upload a cover image"}
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                        </label>
                    )}
                    {error && <AdminFieldHint>{error}</AdminFieldHint>}
                    <AdminFieldHint>If left empty, a gold gradient placeholder is shown instead.</AdminFieldHint>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F3F4F6" }}>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/blog")}
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
                        {submitting ? "Saving…" : (<><Save size={16} aria-hidden="true" /> {isEdit ? "Save Changes" : "Publish Post"}</>)}
                    </button>
                </div>
            </div>
        </form>
    );
}