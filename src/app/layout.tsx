import type { Metadata } from "next";
import "./globals.css";
import PublicChrome from "@/components/layout/PublicChrome";

export const metadata: Metadata = {
  title: {
    default: "Jaffna Muslim Association — UK Charity",
    template: "%s | Jaffna Muslim Association",
  },
  description:
    "Jaffna Muslim Association (JMA) is a UK-registered charity serving the Jaffna Muslim community. Donate to support education, healthcare, infrastructure, and welfare projects on the ground in Jaffna.",
  keywords: [
    "Jaffna Muslim charity UK",
    "JMA charity",
    "Jaffna donation",
    "Sri Lanka Muslim charity",
    "Zakat UK",
    "Jaffna Muslim Association",
  ],
  authors: [{ name: "Jaffna Muslim Association" }],
  creator: "SKAYL Studio",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://jaffnamuslims.org.uk",
    siteName: "Jaffna Muslim Association",
    title: "Jaffna Muslim Association — UK Registered Charity",
    description:
      "Serving the Jaffna Muslim community across two nations. Donate today — 100% reaches the ground.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaffna Muslim Association",
    description: "UK charity serving the Jaffna Muslim community.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — loaded via <link>, NOT next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Noto+Serif+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "var(--font-inter)", margin: 0 }}>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}