# JMA Website — CLAUDE.md
## Project
Charity website for Jaffna Muslim Association UK. Built by SKAYL Studio.
Full spec in JMA_PRD_v3.md — read it before building any page or component.

## Tech Stack
- Next.js 15, App Router, TypeScript
- Tailwind CSS v4 — @theme in globals.css, NO tailwind.config.ts
- Framer Motion — micro-interactions ONLY (see Animation Rules below)
- Lucide React — ALL icons, no emojis anywhere in the codebase
- Stripe — payments
- Resend — transactional emails

## Brand Colours
- Primary teal: #0D5C6B
- Teal hover: #094955
- Teal light bg: #E8F4F6
- Accent gold: #C9A84C
- Gold light bg: #FAF5E8

## Typography
- Headlines/UI: Plus Jakarta Sans
- Body: Inter
- Accent/quotes: Noto Serif Display
- ALL fonts loaded via Google Fonts <link> tag in layout.tsx — never use next/font

## Design Rules
- NO emojis — Lucide React icons only
- Buttons: rounded-lg (never rounded-full)
- Cards: rounded-2xl, subtle border + shadow
- Mobile-first always
- High whitespace — sections need minimum py-20 (80px vertical padding)
- Max content width: max-w-7xl mx-auto with px-6 padding
- Quality bar: match or exceed muslimaid.org and launchgood.com

## Animation Rules (CRITICAL)
- NO scroll-triggered fade-up or fade-in on sections
- NO staggered entrance animations on cards or text
- Framer Motion is ONLY for:
  - Navbar opacity transition on scroll
  - Button/card hover micro-interactions
  - Count-up stats on IntersectionObserver
  - Donation widget live interactions
  - Progress bar fill on mount
  - Mobile menu slide
  - Donor wall ticker scroll

## Navbar
- Full-width, position: fixed, top: 0
- Background: rgba(13, 92, 107, 0.45) with backdrop-filter: blur(16px)
- NOT white/glass — semi-transparent teal so hero image shows through
- NO rounded corners
- Transitions to rgba(13,92,107,0.92) on scroll

## CSS Architecture
- All design tokens in src/styles/globals.css using @theme {}
- No tailwind.config.ts — Tailwind v4 config is CSS-only
- Use CSS @media queries for breakpoints when inline styles are present

## File Structure
- src/components/layout/ — Navbar.tsx, Footer.tsx
- src/components/sections/ — all page sections
- src/components/ui/ — reusable primitives
- src/data/ — static content files
- src/types/index.ts — all TypeScript interfaces
- src/lib/ — stripe.ts, resend.ts, utils.ts

## Coding Standards
- All components: TypeScript .tsx
- "use client" only when hooks or browser APIs are needed
- Server components by default
- No `any` types — define interfaces in src/types/index.ts
- One responsibility per component
