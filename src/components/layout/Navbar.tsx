"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0.875rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 2.5rem)",
          maxWidth: "76rem",
          zIndex: 50,
        }}
      >
        <motion.header
          animate={{
            backgroundColor: scrolled
              ? "rgba(7, 61, 71, 0.92)"
              : "rgba(13, 92, 107, 0.18)",
            borderColor: scrolled
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.22)",
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{
            borderRadius: "0.75rem",
            border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow:
              "0 4px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
            height: "68px",
            display: "flex",
            alignItems: "center",
            padding: "0 1.25rem",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo/logo-white.svg"
              alt="Jaffna Muslim Association"
              width={220}
              height={56}
              priority
              style={{
                display: "block",
                height: "44px",
                width: "auto",
              }}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="nav-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.125rem",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.88)",
                  textDecoration: "none",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "0.5rem",
                  transition: "color 0.15s ease, background 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "#ffffff";
                  el.style.background = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "rgba(255,255,255,0.88)";
                  el.style.background = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact + Donate + hamburger */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              flexShrink: 0,
            }}
          >
            {/* Contact Us — outlined, secondary */}
            <Link
              href="/contact"
              className="contact-btn"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.9)",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                padding: "0.5rem 1.125rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "rgba(255,255,255,0.16)";
                el.style.borderColor = "rgba(255,255,255,0.6)";
                el.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "rgba(255,255,255,0.08)";
                el.style.borderColor = "rgba(255,255,255,0.35)";
                el.style.color = "rgba(255,255,255,0.9)";
              }}
            >
              Contact Us
            </Link>

            {/* Donate Now — solid, primary */}
            <Link
              href="/donate"
              className="donate-btn"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#ffffff",
                backgroundColor: "#C9A84C",
                padding: "0.5625rem 1.25rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                transition: "background-color 0.2s ease, transform 0.15s ease",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 10px rgba(201,168,76,0.4)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "#B08D35";
                el.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "#C9A84C";
                el.style.transform = "scale(1)";
              }}
            >
              Donate Now
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="hamburger-btn"
              style={{
                display: "none",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                color: "#ffffff",
                borderRadius: "0.5rem",
                width: "38px",
                height: "38px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: "5.375rem",
              left: "1.25rem",
              right: "1.25rem",
              zIndex: 49,
              backgroundColor: "rgba(7, 61, 71, 0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "0.75rem",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 16px 48px -8px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            {/* Mobile logo */}
            <div
              style={{
                padding: "1.125rem 1.25rem 0.75rem",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Image
                src="/logo/logo-white.svg"
                alt="Jaffna Muslim Association"
                width={180}
                height={46}
                style={{ height: "36px", width: "auto" }}
              />
            </div>

            <nav
              aria-label="Mobile navigation"
              style={{ padding: "0.5rem 1.25rem 0.875rem" }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.88)",
                    textDecoration: "none",
                    padding: "0.75rem 0.5rem",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(255,255,255,0.88)";
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Contact Us — mobile */}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  marginTop: "0.875rem",
                  textAlign: "center",
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.9)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                }}
              >
                Contact Us
              </Link>

              {/* Donate Now — mobile */}
              <Link
                href="/donate"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  marginTop: "0.625rem",
                  textAlign: "center",
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#ffffff",
                  backgroundColor: "#C9A84C",
                  padding: "0.8125rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                }}
              >
                Donate Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .hamburger-btn { display: none !important; }
          .donate-btn { display: inline-flex !important; }
          .contact-btn { display: inline-flex !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .contact-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}