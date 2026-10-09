// src/components/ui/PushPrompt.tsx
// Drop this anywhere in your layout — it shows a subtle banner asking users to enable notifications
"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function PushPrompt() {
    const { permission, isSubscribed, loading, subscribe, unsubscribe } = usePushNotifications();
    const [dismissed, setDismissed] = useState(true); // start hidden, check storage
    const [justSubscribed, setJustSubscribed] = useState(false);

    useEffect(() => {
        // Only show prompt if not already dismissed or subscribed
        const wasDismissed = localStorage.getItem("jma-push-dismissed");
        if (!wasDismissed) setDismissed(false);
    }, []);

    const handleDismiss = () => {
        localStorage.setItem("jma-push-dismissed", "1");
        setDismissed(true);
    };

    const handleSubscribe = async () => {
        const ok = await subscribe();
        if (ok) {
            setJustSubscribed(true);
            setTimeout(() => setDismissed(true), 2500);
        }
    };

    const handleUnsubscribe = async () => {
        await unsubscribe();
    };

    // Don't render if: unsupported, denied, dismissed, or already handled
    if (permission === "unsupported" || permission === "denied") return null;
    if (dismissed && !isSubscribed) return null;

    // Already subscribed — show a small toggle in the corner
    if (isSubscribed) {
        return (
            <div style={{
                position: "fixed", bottom: "5rem", right: "1rem", zIndex: 999,
                display: "flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: "#0D5C6B", color: "#ffffff",
                padding: "0.5rem 0.875rem", borderRadius: "2rem",
                fontSize: "0.75rem", fontFamily: "var(--font-inter)",
                fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                cursor: "pointer",
            }}
                onClick={handleUnsubscribe}
                title="Tap to turn off notifications"
            >
                <Bell size={13} />
                Notifications on
            </div>
        );
    }

    return (
        <div style={{
            position: "fixed", bottom: "1.5rem", left: "50%",
            transform: "translateX(-50%)",
            width: "min(92vw, 400px)",
            zIndex: 999,
            backgroundColor: "#073D47",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "1rem",
            padding: "1rem 1.25rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            display: "flex", flexDirection: "column" as const, gap: "0.75rem",
            fontFamily: "var(--font-inter)",
            animation: "slideUp 0.3s ease",
        }}>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                    to   { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Close */}
            <button
                onClick={handleDismiss}
                style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem",
                    background: "none", border: "none", color: "rgba(255,255,255,0.4)",
                    cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center",
                }}
            >
                <X size={15} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div style={{
                    width: "32px", height: "32px", borderRadius: "0.5rem",
                    backgroundColor: "rgba(201,168,76,0.15)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <Bell size={15} style={{ color: "#C9A84C" }} />
                </div>
                <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#ffffff", marginBottom: "0.125rem" }}>
                        {justSubscribed ? "You're all set! جزاك الله خيراً" : "Stay updated"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                        {justSubscribed
                            ? "We'll notify you when JMA posts something new."
                            : "Get notified when JMA posts announcements, events & more."}
                    </p>
                </div>
            </div>

            {!justSubscribed && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        style={{
                            flex: 1, padding: "0.625rem",
                            backgroundColor: "#C9A84C", color: "#ffffff",
                            border: "none", borderRadius: "0.5rem",
                            fontWeight: 700, fontSize: "0.8125rem",
                            cursor: loading ? "wait" : "pointer",
                            fontFamily: "var(--font-inter)",
                        }}
                    >
                        {loading ? "Enabling…" : "Enable notifications"}
                    </button>
                    <button
                        onClick={handleDismiss}
                        style={{
                            padding: "0.625rem 0.875rem",
                            backgroundColor: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.6)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "0.5rem",
                            fontWeight: 600, fontSize: "0.8125rem",
                            cursor: "pointer", fontFamily: "var(--font-inter)",
                        }}
                    >
                        Not now
                    </button>
                </div>
            )}
        </div>
    );
}