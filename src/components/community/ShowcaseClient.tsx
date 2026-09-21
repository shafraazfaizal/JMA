// src/components/community/ShowcaseClient.tsx
"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { PenLine, Palette, Mic2, BookOpen, GraduationCap, Dumbbell, Upload, CheckCircle, AlertCircle, Star } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import type { DBShowcaseSubmission, ShowcaseCategory } from "@/types/database";
import { submitShowcaseAction } from "@/app/community/showcase/actions";

const CATEGORIES: { value: ShowcaseCategory; label: string; icon: typeof PenLine; colour: string; description: string }[] = [
    { value: "Written Word", label: "Written Word", icon: PenLine, colour: "#6366F1", description: "Articles, essays, poems, stories" },
    { value: "Creative Arts", label: "Creative Arts", icon: Palette, colour: "#EC4899", description: "Drawings, paintings, crafts" },
    { value: "Spoken Word", label: "Spoken Word", icon: Mic2, colour: "#F59E0B", description: "Videos, speeches, recitations, nasheeds" },
    { value: "Islamic Achievement", label: "Islamic Achievement", icon: BookOpen, colour: "#10B981", description: "Quran memorisation, Islamic knowledge" },
    { value: "Academic", label: "Academic", icon: GraduationCap, colour: "#3B82F6", description: "Exam results, school awards" },
    { value: "Sport & Fitness", label: "Sport & Fitness", icon: Dumbbell, colour: "#EF4444", description: "Sporting achievements" },
];

const AGE_GROUPS = ["Junior (5–10)", "Teen (11–15)", "Young Adult (16–18)"] as const;

type Filter = ShowcaseCategory | "All";

const emptyForm = {
    child_name: "", age_group: "" as typeof AGE_GROUPS[number] | "",
    parent_name: "", parent_email: "",
    category: "" as ShowcaseCategory | "",
    title: "", description: "",
    file_url: "", consent_publish: false, show_name: true,
};

export default function ShowcaseClient({ submissions }: { submissions: DBShowcaseSubmission[] }) {
    const [filter, setFilter] = useState<Filter>("All");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done" | "error">("idle");
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [fileType, setFileType] = useState<"image" | "video" | "pdf" | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filtered = filter === "All" ? submissions : submissions.filter((s) => s.category === filter);

    const validate = () => {
        if (!form.child_name.trim()) return "Child's name is required.";
        if (!form.age_group) return "Please select an age group.";
        if (!form.parent_name.trim()) return "Parent / guardian name is required.";
        if (!form.parent_email.trim() || !form.parent_email.includes("@")) return "A valid parent email is required.";
        if (!form.category) return "Please select a category.";
        if (!form.title.trim()) return "A title is required.";
        if (!form.description.trim()) return "Please add a short description.";
        if (!form.consent_publish) return "Please confirm consent to publish.";
        return "";
    };

    const handleFileUpload = useCallback(async (file: File) => {
        setUploadState("uploading");
        setUploadedFileName(file.name);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const path = `${Date.now()}-${file.name}`;
            const { error } = await supabase.storage.from("showcase-files").upload(path, file);
            if (error) throw error;
            const { data } = supabase.storage.from("showcase-files").getPublicUrl(path);
            const detectedType: "image" | "video" | "pdf" = file.type.startsWith("image/")
                ? "image"
                : file.type.startsWith("video/")
                    ? "video"
                    : "pdf";
            setForm((p) => ({ ...p, file_url: data.publicUrl }));
            setFileType(detectedType);
            setUploadState("done");
        } catch {
            setUploadState("error");
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    }, [handleFileUpload]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    const handleRemoveFile = () => {
        setUploadState("idle");
        setUploadedFileName("");
        setFileType(null);
        setForm((p) => ({ ...p, file_url: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = () => {
        const err = validate();
        if (err) { setFormError(err); return; }
        setFormError("");
        startTransition(async () => {
            const result = await submitShowcaseAction({
                child_name: form.child_name,
                age_group: form.age_group as typeof AGE_GROUPS[number],
                parent_name: form.parent_name,
                parent_email: form.parent_email,
                category: form.category as ShowcaseCategory,
                title: form.title,
                description: form.description,
                file_url: form.file_url || null,
                file_type: fileType,
                consent_publish: form.consent_publish,
                show_name: form.show_name,
            });
            if (result.success) {
                setSubmitted(true);
            } else {
                setFormError(result.error ?? "Something went wrong. Please try again.");
            }
        });
    };

    const getCategoryMeta = (cat: ShowcaseCategory) => CATEGORIES.find((c) => c.value === cat)!;

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
            {/* Hero */}
            <section style={{
                background: "linear-gradient(135deg, #073D47 0%, #0D5C6B 60%, #1a7a8f 100%)",
                padding: "8rem 1.5rem 4rem",
            }}>
                <div style={{ maxWidth: "72rem", margin: "0 auto", textAlign: "center" as const }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "9999px", padding: "0.375rem 1rem", marginBottom: "1.5rem" }}>
                        <Star size={14} style={{ color: "#C9A84C" }} />
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#C9A84C" }}>
                            Community Feature
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "#ffffff", lineHeight: 1.1, marginBottom: "1rem" }}>
                        Student Showcase
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto 2rem" }}>
                        Celebrating the talents, achievements, and creativity of our young community members. Every child has a gift — share yours with us.
                    </p>
                    <button
                        onClick={() => { setShowForm(true); setSubmitted(false); window.scrollTo({ top: 800, behavior: "smooth" }); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", padding: "0.875rem 2rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(201,168,76,0.35)" }}
                    >
                        <Upload size={16} /> Submit Your Work
                    </button>
                </div>
            </section>

            <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "3rem 1.5rem" }}>

                {/* Category filter */}
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" as const, marginBottom: "2.5rem" }}>
                    {(["All", ...CATEGORIES.map((c) => c.value)] as Filter[]).map((cat) => {
                        const meta = cat !== "All" ? getCategoryMeta(cat as ShowcaseCategory) : null;
                        const active = filter === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.375rem",
                                    padding: "0.5rem 1rem", borderRadius: "9999px",
                                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem",
                                    border: active ? "none" : "1px solid #E5E7EB",
                                    backgroundColor: active ? (meta?.colour ?? "#0D5C6B") : "#ffffff",
                                    color: active ? "#ffffff" : "#6B7280",
                                    cursor: "pointer", transition: "all 0.15s ease",
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Submissions grid */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center" as const, padding: "4rem 1.5rem", color: "#9CA3AF" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem" }}>
                            {submissions.length === 0
                                ? "No submissions yet — be the first to share your work!"
                                : "No submissions in this category yet."}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                        {filtered.map((s) => {
                            const meta = getCategoryMeta(s.category);
                            const Icon = meta.icon;
                            return (
                                <div key={s.id} style={{
                                    backgroundColor: "#ffffff", borderRadius: "1rem",
                                    border: "1px solid #E5E7EB", overflow: "hidden",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
                                >
                                    <div style={{ height: "4px", backgroundColor: meta.colour }} />
                                    {s.file_url && s.file_type === "image" && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={s.file_url} alt={s.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                                    )}
                                    <div style={{ padding: "1.25rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                            <div style={{ width: "28px", height: "28px", borderRadius: "0.375rem", backgroundColor: `${meta.colour}18`, border: `1px solid ${meta.colour}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Icon size={13} style={{ color: meta.colour }} />
                                            </div>
                                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 700, color: meta.colour, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                                                {s.category}
                                            </span>
                                        </div>
                                        <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                                            {s.title}
                                        </h3>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                            {s.description}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "0.5rem" }}>
                                            <div>
                                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#111827", marginBottom: "0.125rem" }}>
                                                    {s.show_name ? s.child_name : "Anonymous"}
                                                </p>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>
                                                    {s.age_group}
                                                </p>
                                            </div>
                                            {s.file_url && s.file_type !== "image" && (
                                                <a href={s.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0D5C6B", textDecoration: "none" }}>
                                                    View {s.file_type} →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Submission form */}
                {showForm && (
                    <div id="submit-form" style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "2.5rem", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginTop: "2rem" }}>
                        {submitted ? (
                            <div style={{ textAlign: "center" as const, padding: "2rem 0" }}>
                                <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                                    <CheckCircle size={28} style={{ color: "#059669" }} />
                                </div>
                                <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.375rem", color: "#111827", marginBottom: "0.75rem" }}>
                                    Submission Received! 🎉
                                </h3>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 1.5rem" }}>
                                    Jazakallahu Khayran! We've sent a confirmation to your email. Our team will review the submission and publish it shortly Insha Allah.
                                </p>
                                <button
                                    onClick={() => { setForm(emptyForm); setSubmitted(false); setShowForm(false); }}
                                    style={{ padding: "0.75rem 1.5rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                                >
                                    Submit Another
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.375rem", color: "#111827", marginBottom: "0.5rem" }}>
                                    Share Your Work
                                </h2>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "2rem" }}>
                                    Fill in the form below and we'll review your submission before publishing it.
                                </p>

                                {/* Category selector */}
                                <div style={{ marginBottom: "1.5rem" }}>
                                    <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "0.75rem" }}>Category *</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                                        {CATEGORIES.map((cat) => {
                                            const Icon = cat.icon;
                                            const active = form.category === cat.value;
                                            return (
                                                <button
                                                    key={cat.value}
                                                    type="button"
                                                    onClick={() => setForm((p) => ({ ...p, category: cat.value }))}
                                                    style={{
                                                        padding: "0.875rem", borderRadius: "0.75rem", textAlign: "left" as const,
                                                        border: active ? `2px solid ${cat.colour}` : "2px solid #E5E7EB",
                                                        backgroundColor: active ? `${cat.colour}10` : "#F9FAFB",
                                                        cursor: "pointer", transition: "all 0.15s ease",
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                                                        <Icon size={14} style={{ color: cat.colour }} />
                                                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#111827" }}>{cat.label}</span>
                                                    </div>
                                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{cat.description}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Fields */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                                    {[
                                        { label: "Child's First Name *", key: "child_name", placeholder: "e.g. Aisha", type: "text" },
                                        { label: "Parent / Guardian Name *", key: "parent_name", placeholder: "Your full name", type: "text" },
                                        { label: "Parent Email *", key: "parent_email", placeholder: "your@email.com", type: "email" },
                                        { label: "Submission Title *", key: "title", placeholder: "e.g. My Poem about Ramadan", type: "text" },
                                    ].map(({ label, key, placeholder, type }) => (
                                        <div key={key}>
                                            <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "0.375rem" }}>{label}</label>
                                            <input
                                                type={type}
                                                value={form[key as keyof typeof form] as string}
                                                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                                placeholder={placeholder}
                                                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", fontFamily: "var(--font-inter)", fontSize: "0.9375rem", boxSizing: "border-box" as const }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Age group */}
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "0.375rem" }}>Age Group *</label>
                                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const }}>
                                        {AGE_GROUPS.map((ag) => (
                                            <button
                                                key={ag}
                                                type="button"
                                                onClick={() => setForm((p) => ({ ...p, age_group: ag }))}
                                                style={{
                                                    padding: "0.5rem 1.25rem", borderRadius: "9999px", border: "2px solid",
                                                    borderColor: form.age_group === ag ? "#0D5C6B" : "#E5E7EB",
                                                    backgroundColor: form.age_group === ag ? "#0D5C6B" : "#ffffff",
                                                    color: form.age_group === ag ? "#ffffff" : "#374151",
                                                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem",
                                                    cursor: "pointer", transition: "all 0.15s ease",
                                                }}
                                            >
                                                {ag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "0.375rem" }}>Description / Content *</label>
                                    <textarea
                                        rows={5}
                                        value={form.description}
                                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                        placeholder="Write the article, poem, or describe the achievement here. If submitting a drawing or video, describe what it's about..."
                                        style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", fontFamily: "var(--font-inter)", fontSize: "0.9375rem", resize: "vertical" as const, boxSizing: "border-box" as const }}
                                    />
                                </div>

                                {/* File Upload */}
                                <div style={{ marginBottom: "1.5rem" }}>
                                    <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "0.5rem" }}>
                                        File Upload (optional)
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/*,.pdf,.doc,.docx"
                                        style={{ display: "none" }}
                                        onChange={handleFileInputChange}
                                    />
                                    {uploadState === "idle" && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={handleDrop}
                                            style={{
                                                border: `2px dashed ${isDragOver ? "#0D5C6B" : "#D1D5DB"}`,
                                                borderRadius: "0.75rem",
                                                padding: "2rem 1.5rem",
                                                textAlign: "center" as const,
                                                cursor: "pointer",
                                                backgroundColor: isDragOver ? "rgba(13,92,107,0.04)" : "#FAFAFA",
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.5rem" }}>
                                                <div style={{ width: "44px", height: "44px", borderRadius: "0.5rem", backgroundColor: "rgba(13,92,107,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Upload size={20} style={{ color: "#0D5C6B" }} />
                                                </div>
                                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", margin: 0 }}>
                                                    Drag &amp; drop or click to upload
                                                </p>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", margin: 0 }}>
                                                    Images, videos, PDFs up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {uploadState === "uploading" && (
                                        <div style={{ border: "2px dashed #D1D5DB", borderRadius: "0.75rem", padding: "2rem 1.5rem", textAlign: "center" as const, backgroundColor: "#FAFAFA" }}>
                                            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#0D5C6B", animation: "spin 0.8s linear infinite" }} />
                                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#6B7280", margin: 0 }}>Uploading…</p>
                                            </div>
                                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                        </div>
                                    )}
                                    {uploadState === "done" && (
                                        <div style={{ border: "2px solid #D1FAE5", borderRadius: "0.75rem", padding: "1rem 1.25rem", backgroundColor: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
                                                <CheckCircle size={20} style={{ color: "#059669", flexShrink: 0 }} />
                                                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#065F46", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                                                    {uploadedFileName}
                                                </span>
                                            </div>
                                            <button onClick={handleRemoveFile} style={{ flexShrink: 0, padding: "0.25rem 0.75rem", borderRadius: "0.375rem", border: "1px solid #6EE7B7", backgroundColor: "transparent", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#065F46", cursor: "pointer" }}>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    {uploadState === "error" && (
                                        <div style={{ border: "2px solid #FECACA", borderRadius: "0.75rem", padding: "1rem 1.25rem", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                                <AlertCircle size={20} style={{ color: "#DC2626", flexShrink: 0 }} />
                                                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#991B1B" }}>Upload failed. Please try again.</span>
                                            </div>
                                            <button onClick={handleRemoveFile} style={{ flexShrink: 0, padding: "0.25rem 0.75rem", borderRadius: "0.375rem", border: "1px solid #FCA5A5", backgroundColor: "transparent", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#991B1B", cursor: "pointer" }}>
                                                Try again
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Consent checkboxes */}
                                <div style={{ backgroundColor: "#F9FAFB", borderRadius: "0.75rem", border: "1px solid #E5E7EB", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                                    <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={form.consent_publish}
                                            onChange={(e) => setForm((p) => ({ ...p, consent_publish: e.target.checked }))}
                                            style={{ marginTop: "3px", flexShrink: 0, width: "16px", height: "16px" }}
                                        />
                                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#374151", lineHeight: 1.5 }}>
                                            I give consent for this submission to be reviewed and published on the JMA website. *
                                        </span>
                                    </label>
                                    <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={form.show_name}
                                            onChange={(e) => setForm((p) => ({ ...p, show_name: e.target.checked }))}
                                            style={{ marginTop: "3px", flexShrink: 0, width: "16px", height: "16px" }}
                                        />
                                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#374151", lineHeight: 1.5 }}>
                                            Display child's first name on the published submission (uncheck to publish as Anonymous).
                                        </span>
                                    </label>
                                </div>

                                {/* Error */}
                                {formError && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.5rem", padding: "0.875rem 1rem", marginBottom: "1.25rem" }}>
                                        <AlertCircle size={16} style={{ color: "#DC2626", flexShrink: 0 }} />
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#991B1B", margin: 0 }}>{formError}</p>
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isPending}
                                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.625rem", backgroundColor: "#C9A84C", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}
                                    >
                                        {isPending ? "Submitting…" : "Submit Your Work"}
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        style={{ padding: "0.875rem 1.5rem", borderRadius: "0.625rem", backgroundColor: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}