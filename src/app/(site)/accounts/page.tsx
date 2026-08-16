import { MotionConfig } from "framer-motion";
import { getAccountsPageData } from "@/lib/data/getAccounts";
import { AccountsPage } from "@/components/sections/accounts/AccountsPage";

export const metadata = {
  title: "My Account - Tikkay Shikkay",
  description:
    "Track your orders, save your favourites and manage your profile at Tikkay Shikkay.",
};

export default async function AccountsRoute() {
  const data = await getAccountsPageData();

  return (
    <div className="bg-[var(--bg-base)]">
      <MotionConfig reducedMotion="user">
        <AccountsPage data={data} />
      </MotionConfig>
    </div>
  );
}
