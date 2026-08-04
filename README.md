# Tikkay Shikkay — Premium Fire-Grilled BBQ

Tikkay Shikkay is a high-performance, visually stunning web application built for a premium street-food BBQ brand. The project features rich animations, responsive layouts, a dynamic menu, an interactive platter builder, and a journey timeline.

---

## 🚀 Technology Stack

- **Core**: [Next.js](https://nextjs.org/) (App Router, Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (used for client-side Platter Builder)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🛠️ Project Phases

### Phase 1 — Frontend & Presentation (Current)
Built entirely against structured mock data matching the future database schema. Features include:
- **Hero Section**: Crisp parallax layout, video/image background, dynamic batch counter.
- **Interactive Platter Builder**: Client-side state engine (`usePlatterStore`) allowing custom platter combinations.
- **Live Menu**: Categorized listing with responsive image sizing, price markers, spice indicators, and availability checks.
- **Vertical Timeline ("A Decade of Smoke")**: Scroll-triggered animated vertical timeline of the brand journey.
- **Behind the Scenes Gallery**: Asymmetric image grids with visual hover triggers and process tag overlays.
- **Careers CTA & Catering Inquiries**: Fully interactive forms backed by stub Server Actions.

### Phase 2 — Backend & Admin Dashboard (Future)
- **Database setup**: PostgreSQL integration (Supabase/Prisma).
- **Admin Panel**: Dashboard UI with CRUD features to manage menu, journey events, review approvals, and catering leads.
- **Live Syncing**: Real-time server revalidation for menu items, counters, and franchise options.

---

## 📦 Directory Structure

```text
├── src/
│   ├── app/                # Next.js App Router (Layouts, Pages, Global CSS)
│   ├── components/         # React Components
│   │   ├── motion/         # Animation Wrappers (Reveal, GSAP, Framer Motion)
│   │   ├── layout/         # Structural Components (Navbar, Footer)
│   │   └── ui/             # Reusable Interface Elements (Card, Button, MenuItemCard)
│   ├── hooks/              # Custom React Hooks
│   ├── lib/
│   │   ├── data/           # Data Fetching Abstraction Layer (Getters)
│   │   ├── mock/           # Mock Database Entries matching Schema
│   │   └── utils/          # Formatting and Tailwind Helpers
│   └── types/              # Unified TypeScript definitions
├── public/                 # Static Assets (Images, SVGs, Fonts)
├── Design.md               # Visual Brand Guidelines (Figma Extracted Tokens)
├── Schema.md               # Database Schema Specifications
└── README.md               # General Documentation
```

---

## ⚡ Getting Started

### Prerequisites
Make sure you have Node.js 18+ installed on your local machine.

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd TikkayShikkay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🎨 Design System

All visual rules and colors are extracted directly from the Figma blueprints:
- **Primary Page Background**: `#131313`
- **Surface Card Background**: `#1C1B1B`
- **Primary Accent Peach**: `#FFB4A2`
- **Accent Orange (CTAs)**: `#FF562A`
- **Accent Gold (Prices, Badges)**: `#F4BE54`
- **Brand Typography**: `Liberation Serif` (configured site-wide via local local-font configurations)

---

## 📄 License
© 2024-2026 Tikkay Shikkay. All rights reserved. Made with Pride.
