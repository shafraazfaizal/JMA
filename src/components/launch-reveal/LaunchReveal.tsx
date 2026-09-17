"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
    const [display, setDisplay] = useState("0");

    useEffect(() => {
        const controls = animate(count, value, { duration, ease: "easeOut" });
        const unsub = rounded.on("change", setDisplay);
        return () => { controls.stop(); unsub(); };
    }, [value]);

    return <span>{display}</span>;
}

// ── Particle ──────────────────────────────────────────────────────────────────
function GoldParticle({ delay }: { delay: number }) {
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 8 + 6;

    return (
        <motion.div
            style={{
                position: "absolute",
                left: `${x}%`,
                bottom: "-10px",
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                backgroundColor: "#C9A84C",
                opacity: 0,
            }}
            animate={{
                y: [0, -(Math.random() * 600 + 400)],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [0, 0.8, 0],
                scale: [1, Math.random() * 1.5 + 0.5, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeOut",
            }}
        />
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LaunchReveal() {
    const router = useRouter();
    const [phase, setPhase] = useState<"intro" | "reveal" | "stats" | "cta" | "launching">("intro");
    const [launched, setLaunched] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Auto-advance phases
    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase("reveal"), 2000),
            setTimeout(() => setPhase("stats"), 4500),
            setTimeout(() => setPhase("cta"), 7000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const handleLaunch = () => {
        setPhase("launching");
        setTimeout(() => setLaunched(true), 1200);
        setTimeout(() => router.push("/"), 3000);
    };

    const particles = Array.from({ length: 40 }, (_, i) => (
        <GoldParticle key={i} delay={i * 0.3} />
    ));

    return (
        <AnimatePresence>
            {!launched ? (
                <motion.div
                    key="reveal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: "easeIn" } }}
                    style={{
                        position: "fixed", inset: 0, zIndex: 9999,
                        backgroundColor: "#031e23",
                        display: "flex", flexDirection: "column" as const,
                        alignItems: "center", justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {/* Particles */}
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                        {particles}
                    </div>

                    {/* Background radial glow */}
                    <motion.div
                        aria-hidden="true"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute", top: "50%", left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "800px", height: "500px", borderRadius: "50%",
                            background: "radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, rgba(13,92,107,0.2) 40%, transparent 70%)",
                            filter: "blur(60px)", pointerEvents: "none",
                        }}
                    />

                    {/* Rotating rings */}
                    {[600, 450, 320].map((size, i) => (
                        <motion.div
                            key={size}
                            aria-hidden="true"
                            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                            transition={{ duration: 40 + i * 15, repeat: Infinity, ease: "linear" }}
                            style={{
                                position: "absolute", top: "50%", left: "50%",
                                width: `${size}px`, height: `${size}px`,
                                marginLeft: `-${size / 2}px`, marginTop: `-${size / 2}px`,
                                borderRadius: "50%",
                                border: `1px solid rgba(201,168,76,${0.06 + i * 0.03})`,
                                pointerEvents: "none",
                            }}
                        />
                    ))}

                    {/* Content */}
                    <div style={{ position: "relative", zIndex: 1, textAlign: "center" as const, padding: "2rem", maxWidth: "680px", width: "100%" }}>

                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "backOut" }}
                            style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}
                        >
                            <div style={{ position: "relative" }}>
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    style={{
                                        position: "absolute", inset: "-20px", borderRadius: "50%",
                                        background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
                                        filter: "blur(12px)",
                                    }}
                                />
                                <Image
                                    src="/logo/logo.svg"
                                    alt="Jaffna Muslim Association"
                                    width={100} height={100}
                                    priority
                                    style={{ width: "88px", height: "88px", objectFit: "contain", position: "relative", zIndex: 1 }}
                                />
                            </div>
                        </motion.div>

                        {/* Organisation name */}
                        <motion.p
                            initial={{ opacity: 0, letterSpacing: "0.5em" }}
                            animate={{ opacity: phase !== "intro" ? 1 : 0, letterSpacing: "0.2em" }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                            style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                                fontSize: "0.75rem", textTransform: "uppercase" as const,
                                color: "#C9A84C", marginBottom: "1.5rem",
                            }}
                        >
                            Jaffna Muslim Association · United Kingdom
                        </motion.p>

                        {/* Main headline */}
                        <div style={{ overflow: "visible", marginBottom: "0.5rem" }}>
                            <motion.h1
                                initial={{ y: "110%", opacity: 0 }}
                                animate={{ y: phase !== "intro" ? 0 : "110%", opacity: phase !== "intro" ? 1 : 0 }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
                                    fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "#ffffff",
                                    lineHeight: 1, letterSpacing: "-0.03em",
                                }}
                            >
                                Serving humanity,
                            </motion.h1>
                        </div>
                        <div style={{ overflow: "visible", marginBottom: "3rem" }}>
                            <motion.h1
                                initial={{ y: "110%", opacity: 0 }}
                                animate={{ y: phase !== "intro" ? 0 : "110%", opacity: phase !== "intro" ? 1 : 0 }}
                                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                                style={{
                                    fontFamily: "'Noto Serif Display', serif", fontWeight: 600, fontStyle: "italic",
                                    fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "#C9A84C",
                                    lineHeight: 1.1, letterSpacing: "-0.02em",
                                }}
                            >
                                one life at a time
                            </motion.h1>
                        </div>

                        {/* Divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: phase !== "intro" ? 1 : 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            style={{
                                width: "80px", height: "2px", backgroundColor: "#C9A84C",
                                borderRadius: "9999px", margin: "0 auto 3rem",
                                transformOrigin: "center",
                            }}
                        />

                        {/* Stats */}
                        <AnimatePresence>
                            {(phase === "stats" || phase === "cta" || phase === "launching") && (
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    style={{
                                        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: "1.5rem", marginBottom: "3rem",
                                    }}
                                    className="launch-stats"
                                >
                                    {[
                                        { value: 20, suffix: "+", label: "Years of Service" },
                                        { value: 3000, suffix: "+", label: "Families Helped" },
                                        { value: 200, suffix: "+", label: "Projects Delivered" },
                                        { value: 100, suffix: "%", label: "Donations to Ground" },
                                    ].map(({ value, suffix, label }) => (
                                        <div key={label} style={{ textAlign: "center" as const }}>
                                            <p style={{
                                                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
                                                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", color: "#C9A84C", lineHeight: 1,
                                                marginBottom: "0.375rem",
                                            }}>
                                                <AnimatedNumber value={value} duration={1.5} />{suffix}
                                            </p>
                                            <p style={{
                                                fontFamily: "'Inter', sans-serif", fontSize: "0.75rem",
                                                color: "rgba(255,255,255,0.45)", lineHeight: 1.3,
                                            }}>
                                                {label}
                                            </p>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Event tag */}
                        <AnimatePresence>
                            {(phase === "cta" || phase === "launching") && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    style={{ marginBottom: "2.5rem" }}
                                >
                                    <div style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.625rem",
                                        backgroundColor: "rgba(201,168,76,0.1)",
                                        border: "1px solid rgba(201,168,76,0.3)",
                                        borderRadius: "9999px", padding: "0.625rem 1.25rem",
                                        marginBottom: "2rem",
                                    }}>
                                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#C9A84C" }} />
                                        <span style={{
                                            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.8125rem",
                                            color: "#C9A84C",
                                        }}>
                                            Launched at the Annual Family Gathering · 19 September 2026
                                        </span>
                                    </div>

                                    {/* Launch button */}
                                    <motion.button
                                        onClick={handleLaunch}
                                        disabled={phase === "launching"}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
                                        whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(201,168,76,0.5)" }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                                            gap: "0.75rem", padding: "1.125rem 3rem",
                                            borderRadius: "9999px", border: "none",
                                            background: phase === "launching"
                                                ? "rgba(201,168,76,0.3)"
                                                : "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #B08D35 100%)",
                                            color: "#ffffff",
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            fontWeight: 800, fontSize: "1.125rem",
                                            cursor: phase === "launching" ? "not-allowed" : "pointer",
                                            boxShadow: "0 8px 32px rgba(201,168,76,0.35)",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {phase === "launching" ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#ffffff", borderRadius: "50%" }}
                                                />
                                                Launching…
                                            </>
                                        ) : (
                                            <>
                                                Enter jaffnamuslimuk.org
                                                <motion.span
                                                    animate={{ x: [0, 4, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                    style={{ fontSize: "1.25rem" }}
                                                >
                                                    →
                                                </motion.span>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* URL */}
                        <AnimatePresence>
                            {phase === "cta" && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    style={{
                                        fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
                                        color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em",
                                    }}
                                >
                                    jaffnamuslimuk.org · UK Registered Charity No. 1143032
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Burst effect on launch */}
                    <AnimatePresence>
                        {phase === "launching" && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0.8 }}
                                animate={{ scale: 8, opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                style={{
                                    position: "absolute", top: "50%", left: "50%",
                                    width: "200px", height: "200px",
                                    marginLeft: "-100px", marginTop: "-100px",
                                    borderRadius: "50%",
                                    background: "radial-gradient(circle, rgba(201,168,76,0.6) 0%, transparent 70%)",
                                    pointerEvents: "none",
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&family=Noto+Serif+Display:ital,wght@1,600&display=swap');
            @media (max-width: 639px) {
              .launch-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 1.25rem !important; }
            }
          `}</style>
                </motion.div>
            ) : (
                <motion.div
                    key="fade"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ position: "fixed", inset: 0, backgroundColor: "#031e23", zIndex: 9999 }}
                />
            )}
        </AnimatePresence>
    );
}