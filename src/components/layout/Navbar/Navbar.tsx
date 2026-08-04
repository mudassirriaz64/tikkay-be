"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
        "sticky top-0 z-50 w-full border-b backdrop-blur-[6px] transition-all duration-300 ease-in-out",
        scrolled
          ? "h-[60px] border-[var(--border-warm)]/50 bg-[rgba(32,31,31,0.92)] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
          : "h-[80px] border-transparent bg-[rgba(32,31,31,0.45)]",
      )}
    >
      <div className="relative mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-4 lg:px-[64px]">
        <Link href="/" className="shrink-0 flex items-center">
          <div className={cn(
            "relative overflow-hidden transition-all duration-300 ease-in-out",
            scrolled ? "h-9 w-9" : "h-11 w-11"
          )}>
            <Image
              src="/logo/logo_transparent.png"
              alt="Tikkay Shikkay Logo"
              fill
              sizes="(max-width: 768px) 36px, 44px"
              className="object-contain"
            />
          </div>
        </Link>

        <nav className="hidden items-center justify-center gap-7 xl:flex absolute left-1/2 transform -translate-x-1/2">
          {siteConfig.nav
            .filter((item) => !["Home", "Catering", "Careers"].includes(item.title))
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "relative pb-1.5 font-[family:var(--font-serif)] text-[13px] font-bold uppercase tracking-[0.14em] transition-colors whitespace-nowrap after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-[var(--accent-peach)] after:transition-transform after:duration-500 after:ease-[var(--ease-out-soft)]",
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

        <div className="flex shrink-0 items-center">
          <Button
            variant="primary"
            size="sm"
            className={cn(
              "hidden rounded-xl px-5 md:inline-flex transition-all duration-300 ease-in-out",
              scrolled ? "h-9 text-xs" : "h-10 text-sm"
            )}
          >
            Order on WhatsApp
          </Button>
        </div>
      </div>
    </header>
  );
}
