import { AccountsPageData } from "@/types";
import { usersService } from "@/lib/api/users.service";

export async function getAccountsPageData(): Promise<AccountsPageData> {
  return usersService.getAccountsPage();
}
