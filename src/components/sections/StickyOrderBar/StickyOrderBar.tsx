import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export function StickyOrderBar() {
  // Hardcoded for Phase 1 visual demo
  const cartItemCount = 2;
  const cartTotal = 1100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[89px] items-center justify-between border-t border-[var(--border-warm)] bg-[rgba(32,31,31,0.95)] px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.45)] backdrop-blur-[12px] md:hidden pb-safe">
      <div className="flex flex-col">
        <span className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]">
          Tikkay<span className="text-[var(--accent-orange)]">Shikkay</span>
        </span>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full border border-[var(--border-warm)] bg-[var(--bg-surface-alt)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
            {cartItemCount} items
          </span>
          <span className="font-[family:var(--font-serif)] text-sm font-bold text-[var(--text-primary)]">
            {formatCurrency(cartTotal)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--whatsapp-green)]/12 text-[var(--whatsapp-green)] transition-transform active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="sr-only">WhatsApp</span>
        </a>
        <Button variant="primary" className="h-11 px-5 rounded-xl flex gap-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Cart</span>
        </Button>
      </div>
    </div>
  );
}
