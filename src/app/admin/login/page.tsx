"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        setError("");

        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (authError) {
            setError("Incorrect email or password. Please try again.");
            setLoading(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#073D47",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(201,168,76,0.06) 0%, transparent 50%)`,
                    pointerEvents: "none",
                }}
            />

            <div style={{ maxWidth: "400px", width: "100%", position: "relative", zIndex: 1 }}>

                {/* Logo / brand mark */}
                <div style={{ textAlign: "center" as const, marginBottom: "2rem" }}>
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "1rem",
                            backgroundColor: "rgba(201,168,76,0.15)",
                            border: "1.5px solid rgba(201,168,76,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.25rem",
                        }}
                    >
                        <svg width="26" height="26" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path d="M10 3C7.5 3 5.5 5 5.5 7.5C5.5 10 7.5 12 10 12C8.2 12 6.5 11 6.5 8.5C6.5 7 7.5 5.5 9 5C8.5 5 10 3 10 3Z" fill="#C9A84C" />
                            <path d="M13 8L13.5 9.5L15 9L13.8 10L14.3 11.5L13 10.5L11.7 11.5L12.2 10L11 9L12.5 9.5L13 8Z" fill="#C9A84C" />
                        </svg>
                    </div>
                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.25rem", color: "#ffffff", marginBottom: "0.25rem" }}>
                        JMA Admin
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>
                        Sign in to manage site content
                    </p>
                </div>

                {/* Login card */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "1.25rem",
                        padding: "2.25rem",
                        boxShadow: "0 20px 60px -10px rgba(0,0,0,0.3)",
                    }}
                >
                    {error && (
                        <div
                            style={{
                                backgroundColor: "#FEF2F2",
                                border: "1px solid #FECACA",
                                borderRadius: "0.625rem",
                                padding: "0.875rem 1rem",
                                marginBottom: "1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <AlertCircle size={16} style={{ color: "#DC2626", flexShrink: 0 }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#DC2626" }}>{error}</p>
                        </div>
                    )}

                    {/* Email */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label
                            style={{
                                display: "block",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                                color: "#374151",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="admin@jaffnamuslims.org.uk"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                            style={{
                                width: "100%",
                                padding: "0.8125rem 1rem",
                                borderRadius: "0.5rem",
                                border: "1.5px solid #E5E7EB",
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.9375rem",
                                color: "#111827",
                                outline: "none",
                                boxSizing: "border-box" as const,
                                transition: "border-color 0.15s ease",
                            }}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "1.75rem" }}>
                        <label
                            style={{
                                display: "block",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                                color: "#374151",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                                style={{
                                    width: "100%",
                                    padding: "0.8125rem 2.75rem 0.8125rem 1rem",
                                    borderRadius: "0.5rem",
                                    border: "1.5px solid #E5E7EB",
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.9375rem",
                                    color: "#111827",
                                    outline: "none",
                                    boxSizing: "border-box" as const,
                                    transition: "border-color 0.15s ease",
                                }}
                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                style={{
                                    position: "absolute",
                                    right: "0.75rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#9CA3AF",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            padding: "0.9375rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            backgroundColor: loading ? "#094955" : "#0D5C6B",
                            color: "#ffffff",
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#094955"; }}
                        onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D5C6B"; }}
                    >
                        {loading ? "Signing in…" : (<><LogIn size={16} aria-hidden="true" /> Sign In</>)}
                    </button>
                </div>

                <p
                    style={{
                        textAlign: "center" as const,
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.8125rem",
                        color: "rgba(255,255,255,0.35)",
                        marginTop: "1.5rem",
                    }}
                >
                    Authorised JMA staff only
                </p>
            </div>
        </main>
    );
}