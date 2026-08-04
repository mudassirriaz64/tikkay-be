"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[80px] w-full border-b backdrop-blur-[6px] transition-colors duration-300",
        scrolled
          ? "border-[var(--border-warm)]/50 bg-[rgba(32,31,31,0.92)] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
          : "border-transparent bg-[rgba(32,31,31,0.45)]",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-4 lg:px-[64px]">
        <Link href="/" className="shrink-0">
          <span className="font-[family:var(--font-serif)] text-[22px] font-bold uppercase leading-[0.95] tracking-[0.08em] text-[var(--text-primary)]">
            Tikkay
            <br />
            <span className="text-[var(--accent-orange)]">Shikkay</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 xl:flex">
          {siteConfig.nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "relative pb-1.5 font-[family:var(--font-serif)] text-[13px] font-bold uppercase tracking-[0.14em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-[var(--accent-peach)] after:transition-transform after:duration-500 after:ease-[var(--ease-out-soft)]",
                  isActive
                    ? "text-[var(--accent-peach)] after:scale-x-100"
                    : "text-[var(--text-primary)] after:scale-x-0 hover:text-[var(--accent-peach)] hover:after:scale-x-100",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-10 rounded-xl px-5 lg:inline-flex"
          >
            Call Now
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="hidden h-10 rounded-xl px-5 md:inline-flex"
          >
            Order on WhatsApp
          </Button>
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface-alt)]">
            <Image
              src="/logo/logo.svg"
              alt="Order status avatar"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
