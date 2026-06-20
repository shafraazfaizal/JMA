"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Save, FileText } from "lucide-react";
import { uploadMedia } from "@/lib/supabase/storage";
import { createNewsArticleAction, updateNewsArticleAction } from "@/app/admin/news/actions";
import { estimateReadTime } from "@/lib/admin/news-utils";
import {
    adminInputStyle, AdminFieldLabel, AdminFieldHint,
    onFocusBorder, onBlurBorder,
} from "@/components/admin/AdminFormFields";
import type { DBNewsArticle } from "@/types/database";

const categories: DBNewsArticle["category"][] = [
    "Project Updates", "Community News", "Charity Education", "Event News", "Newsletter",
];

export default function NewsArticleForm({ article }: { article?: DBNewsArticle }) {
    const router = useRouter();
    const isEdit = !!article;

    const [imageUrl, setImageUrl] = useState(article?.image_url ?? "");
    const [pdfUrl, setPdfUrl] = useState(article?.pdf_url ?? "");
    const [category, setCategory] = useState<DBNewsArticle["category"]>(article?.category ?? "Project Updates");
    const [content, setContent] = useState(article?.content ?? "");
    const [readTime, setReadTime] = useState(article?.read_time ?? 3);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const isNewsletter = category === "Newsletter";

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        setError("");
        try {
            const url = await uploadMedia(file, "news");
            setImageUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingPdf(true);
        setError("");
        try {
            const url = await uploadMedia(file, "newsletters");
            setPdfUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "PDF upload failed.");
        } finally {
            setUploadingPdf(false);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);
        // Auto-suggest read time only if the admin hasn't manually overridden it yet
        if (!article) {
            setReadTime(estimateReadTime(value));
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        formData.set("image_url", imageUrl);
        formData.set("pdf_url", pdfUrl);
        formData.set("read_time", String(readTime));

        if (isEdit) {
            formData.set("slug", article.slug);
            await updateNewsArticleAction(article.id, formData);
        } else {
            await createNewsArticleAction(formData);
        }
    };

    return (
        <form action={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>

                {/* Title */}
                <div>
                    <AdminFieldLabel required>
                        {isNewsletter ? "Newsletter Issue Title" : "Article Title"}
                    </AdminFieldLabel>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={article?.title}
                        placeholder={isNewsletter ? "e.g. JMA Monthly Newsletter — July 2025" : "e.g. Mankumban Masjid Reaches Phase 2"}
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    {isEdit && <AdminFieldHint>URL: jaffnamuslims.org.uk/news/{article.slug}</AdminFieldHint>}
                </div>

                {/* Category */}
                <div>
                    <AdminFieldLabel required>Category</AdminFieldLabel>
                    <select
                        name="category"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value as DBNewsArticle["category"])}
                        style={{ ...adminInputStyle(), cursor: "pointer" }}
                    >
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <AdminFieldHint>
                        Choose &quot;Newsletter&quot; for monthly issues — this unlocks the PDF attachment field below.
                    </AdminFieldHint>
                </div>

                {/* Author + Published date */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                    <div>
                        <AdminFieldLabel>Author</AdminFieldLabel>
                        <input
                            name="author"
                            type="text"
                            defaultValue={article?.author ?? "JMA Team"}
                            placeholder="JMA Team"
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel required>Publish Date</AdminFieldLabel>
                        <input
                            name="published_at"
                            type="date"
                            required
                            defaultValue={article ? article.published_at.split("T")[0] : new Date().toISOString().split("T")[0]}
                            style={adminInputStyle()}
                            onFocus={onFocusBorder}
                            onBlur={onBlurBorder}
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <AdminFieldLabel required>Excerpt</AdminFieldLabel>
                    <textarea
                        name="excerpt"
                        required
                        rows={2}
                        defaultValue={article?.excerpt}
                        placeholder="One or two sentences shown on news cards and the featured article"
                        style={{ ...adminInputStyle(), resize: "vertical" as const, lineHeight: 1.6 }}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                </div>

                {/* Content */}
                <div>
                    <AdminFieldLabel required>
                        {isNewsletter ? "Newsletter Content" : "Article Content"}
                    </AdminFieldLabel>
                    <textarea
                        name="content"
                        required
                        rows={10}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Write the full article here. Leave a blank line between paragraphs."
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
                            {uploadingImage ? (
                                <Loader2 size={22} className="animate-spin" style={{ color: "#0D5C6B" }} aria-hidden="true" />
                            ) : (
                                <Upload size={22} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                            )}
                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                                {uploadingImage ? "Uploading…" : "Click to upload a cover image"}
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploadingImage} />
                        </label>
                    )}
                    <AdminFieldHint>If left empty, a teal gradient placeholder is shown instead.</AdminFieldHint>
                </div>

                {/* PDF attachment — only shown for Newsletter category */}
                {isNewsletter && (
                    <div style={{ backgroundColor: "#FDF2F8", border: "1px solid #FBCFE8", borderRadius: "0.875rem", padding: "1.25rem" }}>
                        <AdminFieldLabel>Newsletter PDF <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></AdminFieldLabel>
                        {pdfUrl ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff", border: "1.5px solid #E5E7EB", borderRadius: "0.625rem", padding: "0.75rem 1rem" }}>
                                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#BE185D", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
                                    <FileText size={16} aria-hidden="true" /> View uploaded PDF
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setPdfUrl("")}
                                    style={{ width: "28px", height: "28px", borderRadius: "0.375rem", border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                    aria-label="Remove PDF"
                                >
                                    <X size={14} aria-hidden="true" />
                                </button>
                            </div>
                        ) : (
                            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", height: "64px", borderRadius: "0.625rem", border: "2px dashed #FBCFE8", backgroundColor: "#ffffff", cursor: "pointer" }}>
                                {uploadingPdf ? (
                                    <Loader2 size={18} className="animate-spin" style={{ color: "#BE185D" }} aria-hidden="true" />
                                ) : (
                                    <FileText size={18} style={{ color: "#BE185D" }} aria-hidden="true" />
                                )}
                                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#BE185D", fontWeight: 500 }}>
                                    {uploadingPdf ? "Uploading…" : "Upload newsletter PDF"}
                                </span>
                                <input type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: "none" }} disabled={uploadingPdf} />
                            </label>
                        )}
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9D174D", marginTop: "0.625rem" }}>
                            If attached, a &quot;Download PDF&quot; button appears on this newsletter&apos;s page.
                        </p>
                    </div>
                )}

                {error && (
                    <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem", padding: "0.875rem 1rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#DC2626" }}>{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F3F4F6" }}>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/news")}
                        style={{ padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: "pointer" }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || uploadingImage || uploadingPdf}
                        style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                            padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "none",
                            backgroundColor: submitting ? "#094955" : "#0D5C6B", color: "#ffffff",
                            fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem",
                            cursor: submitting || uploadingImage || uploadingPdf ? "not-allowed" : "pointer",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        {submitting ? "Saving…" : (<><Save size={16} aria-hidden="true" /> {isEdit ? "Save Changes" : "Publish Article"}</>)}
                    </button>
                </div>
            </div>
        </form>
    );
}