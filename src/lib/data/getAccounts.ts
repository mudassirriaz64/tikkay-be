import {
  mockAccountOrders,
  mockDemoProfile,
  mockMyReviews,
} from "@/lib/mock/accounts";
import { mockMenuItems } from "@/lib/mock/menu";
import { AccountsPageData } from "@/types";

export async function getAccountsPageData(): Promise<AccountsPageData> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    demoProfile: mockDemoProfile,
    orders: mockAccountOrders,
    reviews: mockMyReviews,
    menuItems: mockMenuItems,
  };
}
