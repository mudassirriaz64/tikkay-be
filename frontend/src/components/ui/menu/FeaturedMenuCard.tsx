"use client";

import Image from "next/image";
import { FlameRating } from "@/components/ui/FlameRating";
import { useCart } from "@/context/CartContext";
import { FeaturedItem } from "@/types/menu";
import { AddToCartButton } from "./AddToCartButton";
import { IngredientBadge } from "./IngredientBadge";
import { MenuCard } from "./MenuCard";
import { PriceTag } from "./PriceTag";
import { QuantitySelector } from "./QuantitySelector";

interface FeaturedMenuCardProps {
  item: FeaturedItem;
  ctaLabel?: string;
}

export function FeaturedMenuCard({
  item,
  ctaLabel = "Add to Order",
}: FeaturedMenuCardProps) {
  const { items, addToCart, removeFromCart } = useCart();
  const quantity = items.find((i) => i.item.id === item.id)?.quantity ?? 0;

  return (
    <MenuCard className="h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover object-center transition-transform duration-500 group-hover/menu:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent" />
        {item.ribbon ? (
          <span className="absolute left-4 top-4 rounded-full bg-[var(--accent-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-on-gold)] shadow-lg">
            {item.ribbon}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-[family:var(--font-serif)] text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {item.title}
          </h3>
          <PriceTag price={item.price} className="whitespace-nowrap text-lg" />
        </div>
        {/* Platter Servings & Breakdown */}
        {item.servings ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 px-2.5 py-0.5 text-xs font-bold text-[var(--accent-orange)]">
              Serves {item.servings} People
            </span>
          </div>
        ) : null}

        {item.included_items && item.included_items.length > 0 ? (
          <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-deep)]/60 p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Includes:</p>
            <ul className="text-xs text-[var(--text-primary)] space-y-0.5">
              {item.included_items.map((inc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent-peach)]" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <IngredientBadge key={tag} label={tag} />
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border-warm)] pt-4">
          <FlameRating level={item.spice_level} />
          {quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => addToCart(item)}
              onDecrement={() => removeFromCart(item.id)}
            />
          ) : (
            <AddToCartButton onClick={() => addToCart(item)}>
              {ctaLabel}
            </AddToCartButton>
          )}
        </div>
      </div>
    </MenuCard>
  );
}
