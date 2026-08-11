import { AccountsPageData } from "@/types";
import { db } from "./defaults";

export async function getAccountsPageData(): Promise<AccountsPageData> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    demoProfile: db.orders.profile,
    orders: db.orders.orders,
    reviews: db.orders.reviews,
    menuItems: db.orders.menuItems,
  };
}
