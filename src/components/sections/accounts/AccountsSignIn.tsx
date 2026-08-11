"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { Button } from "@/components/ui/Button";
import { useAccount } from "@/providers/AccountProvider";
import { UserProfile } from "@/types";
import { Lock, Sparkles } from "lucide-react";

interface AccountsSignInProps {
  demoProfile: UserProfile;
}

export function AccountsSignIn({ demoProfile }: AccountsSignInProps) {
  const { signIn } = useAccount();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email to continue.");
      return;
    }
    signIn({
      name: name.trim(),
      email: email.trim(),
      phone: "",
      address: "",
      memberSince: new Date().toISOString(),
    });
  };

  return (
    <section className="relative overflow-hidden bg-[var(--bg-deep)] py-[88px] lg:py-[120px]">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/gallery/hero-fire.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-deep)] via-[var(--bg-deep)]/80 to-[var(--bg-deep)]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <div className="mx-auto max-w-[520px]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)]/90 p-8 backdrop-blur-md"
          >
            <div className="flex flex-col gap-3 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-[0_0_30px_rgba(255,86,42,0.4)]">
                <Lock className="h-6 w-6" aria-hidden="true" />
              </span>
              <h1 className="font-[family:var(--font-serif)] text-3xl font-bold uppercase tracking-[-0.02em] text-[var(--text-primary)]">
                Your Account
              </h1>
              <p className="text-sm leading-relaxed text-[var(--text-body)]">
                Track your orders, save your favourites and manage your profile
                - all in one place.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <ContactInput
                id="account-name"
                label="Full name"
                value={name}
                onChange={setName}
                autoComplete="name"
              />
              <ContactInput
                id="account-email"
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              {error ? (
                <p className="text-xs text-[var(--accent-ember)]">{error}</p>
              ) : null}
              <Button type="submit" className="w-full rounded-xl">
                Create my account
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-[var(--border-warm)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-faint)]">
                or
              </span>
              <span className="h-px flex-1 bg-[var(--border-warm)]" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn(demoProfile)}
              className="flex items-center justify-center gap-2 rounded-xl"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Continue with demo account
            </Button>

            <p className="text-center text-[11px] leading-relaxed text-[var(--text-faint)]">
              Demo mode - no password needed. Your data stays saved in this
              browser only.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
