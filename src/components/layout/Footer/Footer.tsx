import { siteConfig } from "@/config/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--bg-deep)] border-t border-[var(--border-warm)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 w-full max-w-7xl mx-auto px-6">
        <div>
          <Link href="/" className="inline-block">
            <span className="font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Tikkay
              <span className="text-[var(--accent-orange)]">Shikkay</span>
            </span>
          </Link>
          <p className="text-xs text-stone-400 max-w-[280px] leading-relaxed mt-4">
            {siteConfig.footer.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-200 tracking-widest uppercase mb-4">
            QUICK LINKS
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            {siteConfig.footer.quickLinks.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="hover:text-[#E5A93C] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-200 tracking-widest uppercase mb-4">
            EXPLORE
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            {siteConfig.footer.explore.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="hover:text-[#E5A93C] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-stone-200 tracking-widest uppercase mb-4">
            CONTACT INFO
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>{siteConfig.footer.address}</li>
            <li>
              <a
                href={`tel:${siteConfig.footer.phone}`}
                className="hover:text-[#E5A93C] transition-colors"
              >
                {siteConfig.footer.phone}
              </a>
            </li>
          </ul>
          <a
            href={siteConfig.footer.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#E8927C] hover:underline mt-2"
          >
            📍 View on Google Maps
          </a>
        </div>
      </div>

      <div className="border-t border-stone-800/80 pt-8 pb-6 text-center">
        <p className="font-[family:var(--font-serif)] text-[11px] tracking-widest text-stone-500 uppercase">
          {siteConfig.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
