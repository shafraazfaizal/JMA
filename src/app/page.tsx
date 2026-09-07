"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import type { Variants } from "framer-motion";
import {
  Clock, Utensils, Mic2, Trophy, Award, Users,
  MapPin, ArrowRight, Star,
} from "lucide-react";

// ── Animation variants — ease as named string to satisfy Framer types ─────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerItem = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } },
});

// ── Scroll reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={staggerItem(delay)}
    >
      {children}
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const mainLink = "https://docs.google.com/forms/d/e/1FAIpQLScqJZ1qeNmpPXeeeDtglejkbU-YdAILOT2dz_DM4IFdUsyKhg/viewform";

const stageLinks = [
  { label: "Children's Stage Programme", href: "https://forms.gle/BBBLXvHzdXBLPGcx8" },
  { label: "Fancy Dress", href: "https://forms.gle/3hsQ28EHwJHPTLAn8" },
  { label: "Achievement Awards", href: "https://forms.gle/41qwLrcKLMaDNc4a8" },
];

const sportsLinks = [
  { label: "Football — Under 11 (Age 7–10)", href: "https://forms.gle/fioLNcW9LFkiRkr28" },
  { label: "Football — Under 16 (Age 11–15)", href: "https://forms.gle/fioLNcW9LFkiRkr28" },
  { label: "Football — Under 25 (Age 16–25)", href: "https://forms.gle/fioLNcW9LFkiRkr28" },
  { label: "Football — Under 35 (Age 26–35)", href: "https://forms.gle/fioLNcW9LFkiRkr28" },
  { label: "Football — Over 35", href: "https://forms.gle/fioLNcW9LFkiRkr28" },
  { label: "Football — Individuals (no team)", href: "https://forms.gle/Us3u9PqfKEwyXEft6" },
  { label: "Cricket Exhibition Match", href: "https://forms.gle/nrSzXtj4J6j8YvTL7" },
];

const venueEncoded = encodeURIComponent("Ford Sports and Social Club, Barkingside, Ilford, IG3 8HE");

const mapsLinks = [
  { label: "Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${venueEncoded}`, bg: "rgba(26,115,232,0.15)", colour: "#60A5FA", border: "rgba(26,115,232,0.3)" },
  { label: "Apple Maps", href: `https://maps.apple.com/?q=${venueEncoded}`, bg: "rgba(21,128,61,0.15)", colour: "#4ADE80", border: "rgba(21,128,61,0.3)" },
  { label: "Waze", href: `https://waze.com/ul?q=${venueEncoded}&navigate=yes`, bg: "rgba(124,58,237,0.15)", colour: "#A78BFA", border: "rgba(124,58,237,0.3)" },
];

const onTheDayItems = [
  { label: "Doors open from 11:00 AM", Icon: Clock },
  { label: "Lunch & Dinner provided", Icon: Utensils },
  { label: "Stage performances", Icon: Mic2 },
  { label: "Sports competitions", Icon: Trophy },
  { label: "Achievement awards", Icon: Award },
  { label: "All families welcome", Icon: Users },
];

// ── RegLink ───────────────────────────────────────────────────────────────────
function RegLink({ label, href, index }: { label: string; href: string; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ x: 6, backgroundColor: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.35)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
          padding: "1rem 1.25rem", borderRadius: "0.75rem",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif",
          fontWeight: 500, fontSize: "0.9375rem", textDecoration: "none",
        }}
      >
        <span>{label}</span>
        <ArrowRight size={15} style={{ color: "#C9A84C", flexShrink: 0 }} aria-hidden="true" />
      </motion.a>
    </Reveal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GatheringPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const ring1Y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const ring2Y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Noto+Serif+Display:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background-color: #031e23; overflow-x: hidden; }
        ::selection { background: rgba(201,168,76,0.3); }
        @media (max-width: 639px) {
          .info-grid { grid-template-columns: 1fr !important; }
          .maps-row  { flex-direction: column !important; }
          .hero-title { font-size: clamp(2.5rem, 10vw, 4rem) !important; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", backgroundColor: "#031e23", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

        {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            padding: "6rem 1.5rem 5rem",  // ← more bottom padding to stop g clipping
          }}
        >
          {/* Parallax bg */}
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, y: bgY,
              background: "radial-gradient(ellipse 90% 70% at 50% 30%, #0D5C6B 0%, #073D47 45%, #031e23 100%)",
            }}
          />

          {/* Rotating rings */}
          <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.06)", top: "50%", left: "50%", x: "-50%", y: ring1Y, marginLeft: "-350px", marginTop: "-350px" }} />
          <motion.div aria-hidden="true" animate={{ rotate: -360 }} transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.08)", top: "50%", left: "50%", y: ring2Y, marginLeft: "-250px", marginTop: "-250px" }} />
          <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.12)", top: "50%", left: "50%", marginLeft: "-160px", marginTop: "-160px" }} />

          {/* Breathing gold glow */}
          <motion.div
            aria-hidden="true"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", width: "500px", height: "300px", borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
              top: "50%", left: "50%", marginLeft: "-250px", marginTop: "-150px",
              filter: "blur(40px)", pointerEvents: "none",
            }}
          />

          {/* Content */}
          <motion.div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "56rem", width: "100%", y: contentY }}>

            {/* Logo — loading eager fixes LCP warning */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}
            >
              <div style={{ position: "relative" }}>
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", inset: "-12px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
                <Image
                  src="/logo/logo.svg"
                  alt="Jaffna Muslim Association"
                  width={88} height={88}
                  priority
                  loading="eager"
                  style={{ width: "80px", height: "80px", objectFit: "contain", position: "relative", zIndex: 1 }}
                />
              </div>
            </motion.div>

            {/* Org label */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0.15em" }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#C9A84C", marginBottom: "2rem" }}
            >
              Jaffna Muslim Association · United Kingdom
            </motion.p>

            {/* Title — overflow visible so descenders (g, y) never clip */}
            <div style={{ marginBottom: "0.5rem", overflow: "visible", paddingBottom: "0.125rem" }}>
              <motion.h1
                className="hero-title"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
                  fontSize: "clamp(3rem, 8vw, 6rem)", color: "#ffffff",
                  lineHeight: 1.05, letterSpacing: "-0.03em",
                  overflow: "visible",
                }}
              >
                Annual Family
              </motion.h1>
            </div>
            <div style={{ marginBottom: "2.5rem", overflow: "visible", paddingBottom: "0.25rem" }}>
              <motion.h1
                className="hero-title"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                style={{
                  fontFamily: "'Noto Serif Display', serif", fontWeight: 600, fontStyle: "italic",
                  fontSize: "clamp(3rem, 8vw, 6rem)", color: "#C9A84C",
                  lineHeight: 1.1, letterSpacing: "-0.02em",
                  overflow: "visible",
                }}
              >
                Gathering 2026
              </motion.h1>
            </div>

            {/* Animated divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              style={{ width: "80px", height: "2px", backgroundColor: "#C9A84C", borderRadius: "9999px", margin: "0 auto 3rem", transformOrigin: "center" }}
            />

            {/* Date badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease: "backOut" }}
              style={{
                display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
                backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "1.25rem", padding: "1.5rem 3rem", marginBottom: "1.5rem",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)" }}>Date</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "clamp(1rem, 2.5vw, 1.375rem)", color: "rgba(255,255,255,0.7)", lineHeight: 1 }}>Saturday</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.625rem, 4vw, 2.5rem)", color: "#C9A84C", lineHeight: 1, letterSpacing: "-0.02em" }}>19 September 2026</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.9375rem", color: "rgba(255,255,255,0.55)", marginTop: "0.25rem" }}>From 11:00 AM onwards</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto" }}
            >
              A day of connection, memories &amp; community.<br />Lunch &amp; Dinner provided.
            </motion.p>

            <motion.a
              href="#register"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
              whileHover={{ scale: 1.04, backgroundColor: "#C9A84C", color: "#ffffff" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                marginTop: "2rem",
                padding: "0.875rem 2rem", borderRadius: "9999px",
                border: "1.5px solid rgba(201,168,76,0.6)",
                backgroundColor: "rgba(0,0,0,0)", color: "#C9A84C",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, fontSize: "0.9375rem",
                textDecoration: "none",
                transition: "background-color 0.2s ease, color 0.2s ease",
                backdropFilter: "blur(8px)",
              }}
            >
              Register Now
              <ArrowRight size={16} aria-hidden="true" />
            </motion.a>

            {/* Scroll indicator
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}
              style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)" }}
              />
            </motion.div> */}
          </motion.div>
        </section>

        {/* ═══ VENUE ═══════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: "#031e23", padding: "5rem 1.5rem", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)" }} />

          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
            <Reveal>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.75rem", textAlign: "center" }}>Venue</p>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, textAlign: "center", marginBottom: "3rem" }}>
                Where are we meeting?
              </h2>
            </Reveal>

            <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>

              {/* Venue card */}
              <Reveal delay={0.1}>
                <motion.div
                  whileHover={{ y: -4, borderColor: "rgba(201,168,76,0.25)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", padding: "2rem", height: "100%", backdropFilter: "blur(12px)" }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "0.75rem", backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <MapPin size={18} style={{ color: "#C9A84C" }} aria-hidden="true" />
                  </div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#ffffff", lineHeight: 1.3, marginBottom: "0.625rem" }}>
                    Ford Sports and Social Club
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                    Barkingside, Newbury Park<br />Ilford, IG3 8HE
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.625rem" }}>Open in</p>
                  <div className="maps-row" style={{ display: "flex", gap: "0.5rem" }}>
                    {mapsLinks.map(({ label, href, bg, colour, border }) => (
                      <motion.a
                        key={label} href={href} target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
                          padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                          backgroundColor: bg, border: `1px solid ${border}`,
                          color: colour, fontFamily: "'Inter', sans-serif",
                          fontWeight: 600, fontSize: "0.75rem", textDecoration: "none", flex: 1,
                        }}
                      >
                        <MapPin size={11} aria-hidden="true" />
                        {label}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </Reveal>

              {/* On the day card */}
              <Reveal delay={0.2}>
                <motion.div
                  whileHover={{ y: -4, borderColor: "rgba(201,168,76,0.25)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", padding: "2rem", height: "100%", backdropFilter: "blur(12px)" }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "0.75rem", backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                    <Star size={18} style={{ color: "#C9A84C" }} aria-hidden="true" />
                  </div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#ffffff", marginBottom: "1.25rem" }}>On the day</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {onTheDayItems.map(({ label, Icon }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        viewport={{ once: true }}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
                      >
                        <div style={{ width: "28px", height: "28px", borderRadius: "0.375rem", backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={13} style={{ color: "#C9A84C" }} aria-hidden="true" />
                        </div>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>{label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            </div>

            {/* Map embed */}
            <Reveal delay={0.15}>
              <div style={{ borderRadius: "1.25rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", height: "260px" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.5!2d0.0891!3d51.5765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a6a0a0a0a0a0%3A0x0!2sFord+Sports+%26+Social+Club%2C+Barkingside%2C+Ilford+IG3+8HE!5e0!3m2!1sen!2suk!4v1"
                  width="100%" height="260"
                  style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ford Sports and Social Club, Ilford"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ REGISTRATION ════════════════════════════════════════════════ */}
        <section id="register" style={{ padding: "5rem 1.5rem", position: "relative", backgroundColor: "#031e23" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(13,92,107,0.3) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ maxWidth: "56rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.75rem" }}>Secure your spot</p>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1rem" }}>
                  Register now
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  All families welcome. Spaces are limited — register early إن شاء الله.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <motion.a
                href={mainLink} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 16px 40px rgba(201,168,76,0.4)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  padding: "1.25rem 2.5rem", borderRadius: "1rem",
                  background: "linear-gradient(135deg, #C9A84C 0%, #B08D35 100%)",
                  color: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "1.0625rem", textDecoration: "none",
                  boxShadow: "0 8px 32px rgba(201,168,76,0.25)", marginBottom: "0.875rem",
                }}
              >
                Main Family Registration
                <ArrowRight size={18} aria-hidden="true" />
              </motion.a>
            </Reveal>

            <Reveal delay={0.15}>
              <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.8125rem", color: "rgba(255,255,255,0.25)", marginBottom: "4rem" }}>
                Haven&apos;t registered yet? Click above to secure your family&apos;s place
              </p>
            </Reveal>

            {/* Stage */}
            <Reveal delay={0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08))" }} />
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                  <Mic2 size={13} aria-hidden="true" /> Stage Performances
                </span>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.08))" }} />
              </div>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "3rem" }}>
              {stageLinks.map((link, i) => <RegLink key={link.label} {...link} index={i} />)}
            </div>

            {/* Sports */}
            <Reveal delay={0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08))" }} />
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                  <Trophy size={13} aria-hidden="true" /> Sports Registrations
                </span>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, rgba(255,255,255,0.08))" }} />
              </div>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {sportsLinks.map((link, i) => <RegLink key={link.label} {...link} index={i} />)}
            </div>
          </div>
        </section>

        {/* ═══ VERSE ═══════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 1.5rem", position: "relative", overflow: "hidden", backgroundColor: "#031e23" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)" }} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "300px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }}
          />
          <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <Reveal>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
                style={{ width: "48px", height: "1px", backgroundColor: "#C9A84C", margin: "0 auto 2.5rem", transformOrigin: "center" }} />
              <p style={{ fontFamily: "'Noto Serif Display', serif", fontStyle: "italic", fontSize: "clamp(1.25rem, 3vw, 1.625rem)", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "1.5rem" }}>
                &ldquo;And hold firmly to the rope of Allah all together<br />and do not be divided.&rdquo;
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.12em", color: "#C9A84C" }}>
                QUR&apos;AN 3:103
              </p>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }}
                style={{ width: "48px", height: "1px", backgroundColor: "#C9A84C", margin: "2.5rem auto 0", transformOrigin: "center" }} />
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <section style={{ padding: "1.75rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8125rem", color: "rgba(255,255,255,0.2)" }}>
            © 2026 Jaffna Muslim Association UK · UK Registered Charity No. 1143032
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.12)", marginTop: "0.375rem" }}>
            info@jaffnamuslimuk.org
          </p>
        </section>

      </main>
    </>
  );
}