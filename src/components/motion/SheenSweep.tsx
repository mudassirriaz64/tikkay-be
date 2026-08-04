"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface SheenSweepProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SheenSweep({
  children,
  className,
  delay = 0.2,
}: SheenSweepProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion) return;

      const overlay = el.querySelector(".sheen-overlay");
      if (!overlay) return;

      gsap.fromTo(
        overlay,
        { xPercent: -130 },
        {
          xPercent: 130,
          duration: 1.5,
          delay,
          ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        },
      );
    },
    { scope: ref, dependencies: [reducedMotion, delay] },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {children}
      <div
        aria-hidden="true"
        className="sheen-overlay pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
}
