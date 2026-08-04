import Image from "next/image";
import { Card } from "../Card";
import { FlameRating } from "../FlameRating";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { MenuItemCardProps } from "./MenuItemCard.types";
import { cn } from "@/lib/utils/cn";

export function MenuItemCard({ item, category, className, ...props }: MenuItemCardProps) {
  return (
    <Card
      className={cn(
        "group relative h-full min-h-[420px] flex flex-col justify-between p-6 border border-white/10 overflow-hidden",
        className,
      )}
      {...props}
    >
      <Image
        src={item.image_url}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/85 to-black/30 pointer-events-none" />

      <div className="relative z-10">
        {(item.is_bestseller || item.price > 1500) && (
          <div className="bg-[#E5A93C] text-[#121212] font-bold text-[10px] tracking-wider px-3 py-1 rounded-full w-max shadow-lg uppercase">
            {item.is_bestseller ? "BEST SELLER" : "NEW ARRIVAL"}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-auto space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight leading-tight text-white">
            {item.title}
          </h3>
          <span className="font-[family:var(--font-serif)] text-lg font-normal text-[#E5A93C] whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
        </div>

        <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <FlameRating level={item.spice_level} className="min-w-0" />
        </div>
      </div>
    </Card>
  );
}
