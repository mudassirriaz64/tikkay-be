import { MagneticButton } from "@/components/motion/MagneticButton";
import { Counter } from "@/components/motion/Counter";
import { SheenSweep } from "@/components/motion/SheenSweep";
import { Reveal } from "@/components/motion/Reveal";

export function LoyaltyCTABanner() {
  return (
    <section className="bg-[var(--bg-deep)] px-4 py-[80px]">
      <Reveal className="mx-auto max-w-[1280px]">
        <SheenSweep className="relative overflow-hidden rounded-[24px] border border-[var(--border-warm)] bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-ember)] px-8 py-14 md:px-14 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.14),transparent_35%)]" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-center">
            <div>
              <p className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em] text-[var(--text-on-orange)]/80">
                Join the Grill Fam
              </p>
              <h2 className="mt-4 font-[family:var(--font-serif)] text-[clamp(2.5rem,4vw,3.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[var(--text-on-orange)]">
                Join the club and get the first bite.
              </h2>
              <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-[1.55] text-[var(--text-on-orange)]/90">
                Get early access to specials, loyalty rewards, and the kind of
                updates that matter when the grill is running hot.
              </p>
              <div className="mt-8">
                <MagneticButton
                  variant="secondary"
                  size="lg"
                  className="border border-[var(--bg-deep)] bg-[var(--bg-deep)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]"
                >
                  Join WhatsApp Club
                </MagneticButton>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.08)] p-6 text-center text-[var(--text-on-orange)] md:text-left">
              <p className="font-[family:var(--font-serif)] text-sm font-bold uppercase tracking-[0.16em]">
                Member count
              </p>
              <Counter
                target={12470}
                suffix="+"
                className="mt-3 block font-[family:var(--font-serif)] text-4xl font-bold"
              />
              <p className="mt-2 text-sm leading-[1.5]">
                This number keeps growing because the food keeps delivering.
              </p>
            </div>
          </div>
        </SheenSweep>
      </Reveal>
    </section>
  );
}
