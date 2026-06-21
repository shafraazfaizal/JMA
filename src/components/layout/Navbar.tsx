"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { navLinks, isDropdown } from "@/data/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

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
          className="navbar-header"
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
            position: "relative",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="navbar-logo-link"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexShrink: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <Image
              src="/logo/logo-white.svg"
              alt="Jaffna Muslim Association"
              width={220}
              height={56}
              priority
              className="navbar-logo-img"
              style={{
                display: "block",
                height: "44px",
                width: "auto",
                maxWidth: "100%",
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
            {navLinks.map((item) => {
              if (isDropdown(item)) {
                const isOpen = openDropdown === item.label;
                return (
                  <div
                    key={item.label}
                    style={{ position: "relative" }}
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontFamily: "var(--font-inter)",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: isOpen ? "#ffffff" : "rgba(255,255,255,0.88)",
                        background: isOpen ? "rgba(255,255,255,0.12)" : "transparent",
                        border: "none",
                        padding: "0.4rem 0.75rem",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "color 0.15s ease, background 0.15s ease",
                      }}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{
                            position: "absolute",
                            top: "calc(100% + 0.5rem)",
                            left: 0,
                            minWidth: "200px",
                            backgroundColor: "rgba(7, 61, 71, 0.97)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            borderRadius: "0.75rem",
                            border: "1px solid rgba(255,255,255,0.12)",
                            boxShadow: "0 16px 40px -8px rgba(0,0,0,0.35)",
                            overflow: "hidden",
                            padding: "0.375rem",
                          }}
                        >
                          {item.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              style={{
                                display: "block",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                color: "rgba(255,255,255,0.85)",
                                textDecoration: "none",
                                padding: "0.625rem 0.75rem",
                                borderRadius: "0.5rem",
                                transition: "background-color 0.15s ease, color 0.15s ease",
                                whiteSpace: "nowrap",
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.backgroundColor = "rgba(255,255,255,0.1)";
                                el.style.color = "#ffffff";
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.backgroundColor = "transparent";
                                el.style.color = "rgba(255,255,255,0.85)";
                              }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
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
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Contact + Donate + hamburger */}
          <div
            className="navbar-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              flexShrink: 0,
            }}
          >
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
                flexShrink: 0,
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
                flexShrink: 0,
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
              maxHeight: "calc(100vh - 7rem)",
              overflowY: "auto" as const,
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
              {navLinks.map((item) => {
                if (isDropdown(item)) {
                  const isOpen = mobileDropdownOpen === item.label;
                  return (
                    <div key={item.label} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <button
                        onClick={() => setMobileDropdownOpen(isOpen ? null : item.label)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--font-inter)",
                          fontWeight: 500,
                          fontSize: "1rem",
                          color: "rgba(255,255,255,0.88)",
                          padding: "0.75rem 0.5rem",
                        }}
                        aria-expanded={isOpen}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            {item.items.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => { setMobileOpen(false); setMobileDropdownOpen(null); }}
                                style={{
                                  display: "block",
                                  fontFamily: "var(--font-inter)",
                                  fontWeight: 400,
                                  fontSize: "0.9375rem",
                                  color: "rgba(255,255,255,0.7)",
                                  textDecoration: "none",
                                  padding: "0.625rem 0.5rem 0.625rem 1.25rem",
                                }}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
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
                    {item.label}
                  </Link>
                );
              })}

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
          .navbar-header { padding: 0 0.75rem !important; gap: 0.5rem !important; }
          .navbar-logo-img { height: 36px !important; }
          .navbar-actions { gap: 0.5rem !important; }
        }
        @media (max-width: 400px) {
          .navbar-header { padding: 0 0.625rem !important; gap: 0.375rem !important; }
          .navbar-logo-img { height: 32px !important; }
          .donate-btn { padding: 0.5rem 0.875rem !important; font-size: 0.8125rem !important; }
          .hamburger-btn { width: 34px !important; height: 34px !important; }
        }
      `}</style>
    </>
  );
}