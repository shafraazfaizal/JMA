"use client";

import Link from "next/link";
import { Globe, MessageSquareShare, Send, Heart } from "lucide-react";
import { siteConfig } from "@/data/site";

const footerLinks = {
  organisation: {
    label: "Organisation",
    links: [
      { label: "About JMA", href: "/about" },
      { label: "Our Team", href: "/about#team" },
      { label: "Governance", href: "/about#governance" },
      { label: "Annual Reports", href: "/reports" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  give: {
    label: "Give",
    links: [
      { label: "Donate Now", href: "/donate" },
      { label: "Active Campaigns", href: "/campaigns" },
      { label: "Pay Zakat", href: "/zakat" },
      { label: "Qurbani", href: "/qurbani" },
      { label: "Gift Aid", href: "/donate#gift-aid" },
    ],
  },
  community: {
    label: "Community",
    links: [
      { label: "Membership", href: "/membership" },
      { label: "Events", href: "/events" },
      { label: "News & Updates", href: "/news" },
      { label: "Impact Stories", href: "/impact" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0a3d47",
        color: "rgba(255,255,255,0.75)",
        fontFamily: "var(--font-inter)",
      }}
    >
      {/* Main footer body */}
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "4rem 1.5rem 3rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                textDecoration: "none",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "2px solid rgba(201, 168, 76, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(201, 168, 76, 0.1)",
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 3C7.5 3 5.5 5 5.5 7.5C5.5 10 7.5 12 10 12C8.2 12 6.5 11 6.5 8.5C6.5 7 7.5 5.5 9 5C8.5 5 10 3 10 3Z" fill="#C9A84C" />
                  <path d="M13 8L13.5 9.5L15 9L13.8 10L14.3 11.5L13 10.5L11.7 11.5L12.2 10L11 9L12.5 9.5L13 8Z" fill="#C9A84C" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>
                  JMA
                </div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
                  Jaffna Muslim Association
                </div>
              </div>
            </Link>

            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1rem", color: "rgba(255,255,255,0.65)" }}>
              Serving the Jaffna Muslim community across two nations — bridging the UK diaspora with families on the ground.
            </p>

            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginBottom: "1.5rem" }}>
              UK Registered Charity No. {siteConfig.charityNumber}
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { href: siteConfig.social.facebook, icon: Globe, label: "Facebook" },
                { href: siteConfig.social.instagram, icon: Send, label: "Instagram" },
                { href: siteConfig.social.whatsapp, icon: MessageSquareShare, label: "WhatsApp" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "0.5rem",
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.6)",
                    transition: "background 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(201,168,76,0.2)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((col) => (
            <div key={col.label}>
              <h3
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: "1rem",
                }}
              >
                {col.label}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)"; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Bank transfer box */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "1rem",
              }}
            >
              Direct Bank Transfer
            </h3>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              {[
                { label: "Bank", value: siteConfig.bankDetails.bank },
                { label: "Account Name", value: siteConfig.bankDetails.accountName },
                { label: "Sort Code", value: siteConfig.bankDetails.sortCode },
                { label: "Account No.", value: siteConfig.bankDetails.accountNumber },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: "0.625rem" }}>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.125rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#ffffff", fontWeight: 500 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "1.25rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            fontSize: "0.8125rem",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>
            © {new Date().getFullYear()} Jaffna Muslim Association. All rights reserved.
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            Made with{" "}
            <Heart
              size={12}
              style={{ color: "#C9A84C", fill: "#C9A84C", display: "inline" }}
              aria-hidden="true"
            />{" "}
            for the Jaffna Muslim community · Built by{" "}
            <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
              SKAYL Studio
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
