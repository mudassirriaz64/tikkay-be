"use client";

import { Camera, ChefHat, Flame, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GalleryTab as GalleryTabType, GalleryTabIcon } from "@/types";

const ICONS: Record<GalleryTabIcon, typeof Users> = {
  users: Users,
  "chef-hat": ChefHat,
  flame: Flame,
  camera: Camera,
};

interface GalleryTabProps {
  tab: GalleryTabType;
  active: boolean;
  onClick: () => void;
}

export function GalleryTab({ tab, active, onClick }: GalleryTabProps) {
  const Icon = ICONS[tab.icon];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border p-6 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/60",
        active
          ? "border-[var(--accent-peach)]/40 bg-[var(--bg-surface-raised)] shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_40px_rgba(255,180,162,0.08)]"
          : "border-[var(--border-warm)] bg-[var(--bg-surface)] hover:-translate-y-1 hover:border-[var(--accent-peach)]/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
          active
            ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)]"
            : "bg-[var(--accent-ember)]/15 text-[var(--accent-orange)] group-hover:scale-110",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <span className="flex flex-col gap-1.5">
        <span className="font-[family:var(--font-serif)] text-lg font-bold leading-tight text-[var(--text-primary)]">
          {tab.title}
        </span>
        <span className="text-sm leading-relaxed text-[var(--text-body)]">
          {tab.description}
        </span>
      </span>

      <span className="relative mt-auto block h-0.5 w-full overflow-hidden rounded-full bg-[var(--border-warm)]">
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 origin-left bg-[var(--accent-orange)] transition-transform duration-500 ease-[var(--ease-out-soft)]",
            active ? "scale-x-100" : "scale-x-0",
          )}
        />
      </span>
    </button>
  );
}
