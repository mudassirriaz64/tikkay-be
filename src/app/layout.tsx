import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyOrderBar } from "@/components/sections/StickyOrderBar";
import { MotionProvider } from "@/providers/MotionProvider";
import "./globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased selection:bg-[var(--accent-peach)] selection:text-[var(--text-on-peach)] pb-[89px] md:pb-0"
      >
        <MotionProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <StickyOrderBar />
        </MotionProvider>
      </body>
    </html>
  );
}
