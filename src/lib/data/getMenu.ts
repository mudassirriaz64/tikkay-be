import { MenuPageData } from "@/types";
import { menuService } from "@/lib/api/menu.service";
import { tryOrFallback } from "@/lib/api/client";
import { db } from "./defaults";

export async function getMenu(): Promise<MenuPageData> {
  return tryOrFallback(
    async () => menuService.getPageData(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return db.menu;
    },
  );
}
