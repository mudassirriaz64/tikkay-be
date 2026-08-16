import { AccountsPageData } from "@/types";
import { usersService } from "@/lib/api/users.service";
import { tryOrFallback, ClientApiError } from "@/lib/api/client";
import { db } from "./defaults";

export async function getAccountsPageData(): Promise<AccountsPageData> {
  return tryOrFallback<AccountsPageData>(
    async () => {
      try {
        return await usersService.getAccountsPage();
      } catch (err) {
        const apiErr = ClientApiError.fromUnknown(err);
        if (apiErr.statusCode === 401 || apiErr.statusCode === 403) {
          throw apiErr;
        }
        return {
          demoProfile: db.orders.profile,
          orders: db.orders.orders,
          reviews: db.orders.reviews,
          menuItems: db.orders.menuItems,
        };
      }
    },
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        demoProfile: db.orders.profile,
        orders: db.orders.orders,
        reviews: db.orders.reviews,
        menuItems: db.orders.menuItems,
      };
    },
  );
}
