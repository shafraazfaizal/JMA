"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type BannerState = "hidden" | "android" | "ios";

export default function PWAInstallBanner() {
    const [state, setState] = useState<BannerState>("hidden");
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [iosExpanded, setIosExpanded] = useState(false);

    useEffect(() => {
        // Only show on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) return;

        // Don't show if already dismissed or installed
        if (localStorage.getItem("pwa-banner-dismissed")) return;

        // Check if already running as installed PWA
        if (window.matchMedia("(display-mode: standalone)").matches) return;

        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS) {
            // iOS: show instructional banner after 3s
            const timer = setTimeout(() => setState("ios"), 3000);
            return () => clearTimeout(timer);
        }

        // Android: wait for browser prompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setTimeout(() => setState("android"), 3000);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const dismiss = () => {
        setState("hidden");
        localStorage.setItem("pwa-banner-dismissed", "1");
    };

    const installAndroid = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setState("hidden");
            localStorage.setItem("pwa-banner-dismissed", "1");
        }
        setDeferredPrompt(null);
    };

    if (state === "hidden") return null;

    return (
        <>
            {/* Backdrop blur on mobile */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9998,
                    background: "rgba(0,0,0,0.25)",
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                }}
                onClick={dismiss}
            />

            {/* Banner */}
            <div
                role="dialog"
                aria-label="Add JMA UK to your home screen"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    background: "#073D47",
                    borderRadius: "1.25rem 1.25rem 0 0",
                    padding: "1.5rem 1.25rem 2rem",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.35)",
                    animation: "slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
                }}
            >
                <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

                {/* Drag handle */}
                <div style={{ width: "2.5rem", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.25)", margin: "0 auto 1.25rem" }} />

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1rem" }}>
                    <img
                        src="/icons/icon-192.png"
                        alt="JMA UK"
                        width={48}
                        height={48}
                        style={{ borderRadius: "0.75rem", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#ffffff", lineHeight: 1.3 }}>
                            Add JMA UK to your home screen
                        </p>
                        <p style={{ margin: "0.2rem 0 0", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                            Quick access to news, events &amp; community
                        </p>
                    </div>
                    <button
                        onClick={dismiss}
                        aria-label="Dismiss"
                        style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {state === "android" && (
                    <button
                        onClick={installAndroid}
                        style={{
                            width: "100%",
                            padding: "0.875rem",
                            borderRadius: "0.75rem",
                            background: "#C9A84C",
                            color: "#ffffff",
                            border: "none",
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            cursor: "pointer",
                            letterSpacing: "0.01em",
                        }}
                    >
                        Add to Home Screen
                    </button>
                )}

                {state === "ios" && (
                    <div>
                        <button
                            onClick={() => setIosExpanded((v) => !v)}
                            style={{
                                width: "100%",
                                padding: "0.875rem",
                                borderRadius: "0.75rem",
                                background: "#C9A84C",
                                color: "#ffffff",
                                border: "none",
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 700,
                                fontSize: "0.9375rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                            }}
                        >
                            How to add to Home Screen
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                style={{ transform: iosExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                            >
                                <path d="M2 5l5 5 5-5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {iosExpanded && (
                            <div style={{ marginTop: "0.875rem", background: "rgba(255,255,255,0.08)", borderRadius: "0.75rem", padding: "1rem" }}>
                                {[
                                    {
                                        icon: (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 2v10M10 2l-3 3M10 2l3 3" stroke="#C9A84C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3 13v4a1 1 0 001 1h12a1 1 0 001-1v-4" stroke="#C9A84C" strokeWidth="1.75" strokeLinecap="round" />
                                            </svg>
                                        ),
                                        text: 'Tap the Share button at the bottom of Safari',
                                    },
                                    {
                                        icon: (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <rect x="3" y="3" width="14" height="14" rx="3" stroke="#C9A84C" strokeWidth="1.75" />
                                                <path d="M10 7v6M7 10h6" stroke="#C9A84C" strokeWidth="1.75" strokeLinecap="round" />
                                            </svg>
                                        ),
                                        text: 'Scroll down and tap "Add to Home Screen"',
                                    },
                                    {
                                        icon: (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M4 10l4.5 4.5L16 6" stroke="#C9A84C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ),
                                        text: 'Tap "Add" — done!',
                                    },
                                ].map((step, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: i < 2 ? "0.75rem" : 0 }}>
                                        <div style={{ flexShrink: 0, marginTop: "1px" }}>{step.icon}</div>
                                        <p style={{ margin: 0, fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
                                            {step.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}