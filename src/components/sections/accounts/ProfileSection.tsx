"use client";

import { useState } from "react";
import { Check, LogOut } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactInput } from "@/components/ui/contact/ContactInput";
import { Button } from "@/components/ui/Button";
import { useAccount } from "@/providers/AccountProvider";
import { formatDate } from "@/lib/utils/formatDate";

export function ProfileSection() {
  const { profile, updateProfile, signOut } = useAccount();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile({ name, email, phone, address });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <section className="bg-[var(--bg-deep)] py-[88px] lg:py-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-[64px]">
        <Reveal className="mb-12">
          <SectionHeading
            eyebrow="Profile"
            title="Your"
            accent="Details"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-5 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ContactInput
                  id="profile-name"
                  label="Full name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
                <ContactInput
                  id="profile-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
              </div>
              <ContactInput
                id="profile-phone"
                label="Phone number"
                type="tel"
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
              />
              <ContactInput
                id="profile-address"
                label="Delivery address"
                textarea
                rows={3}
                value={address}
                onChange={setAddress}
                autoComplete="street-address"
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="flex items-center gap-2 rounded-xl">
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Saved!
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={signOut}
                  className="flex items-center gap-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </Button>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6">
              <h3 className="font-[family:var(--font-serif)] text-lg font-bold text-[var(--text-primary)]">
                Membership
              </h3>
              <dl className="flex flex-col gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[var(--text-faint)]">Member since</dt>
                  <dd className="font-bold text-[var(--text-body)]">
                    {profile?.memberSince
                      ? formatDate(profile.memberSince)
                      : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[var(--text-faint)]">Tier</dt>
                  <dd className="rounded-full border border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                    BBQ Regular
                  </dd>
                </div>
              </dl>
              <p className="border-t border-[var(--border-warm)] pt-4 text-xs leading-relaxed text-[var(--text-faint)]">
                Keep your contact details up to date so your orders reach the
                right door, fast and fresh.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
