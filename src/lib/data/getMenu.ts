import { MenuPageData } from "@/types";
import { menuService } from "@/lib/api/menu.service";

export async function getMenu(): Promise<MenuPageData> {
  return menuService.getPageData();
}
