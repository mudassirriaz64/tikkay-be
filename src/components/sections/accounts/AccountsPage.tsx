"use client";

import { useEffect, useState } from "react";
import { AccountsSignIn } from "./AccountsSignIn";
import { AccountsDashboard } from "./AccountsDashboard";
import { useAccount } from "@/providers/AccountProvider";
import { AccountsPageData } from "@/types";

interface AccountsPageProps {
  data: AccountsPageData;
}

export function AccountsPage({ data }: AccountsPageProps) {
  const { isSignedIn } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isSignedIn) {
    return <AccountsSignIn demoProfile={data.demoProfile} />;
  }

  return <AccountsDashboard data={data} />;
}
