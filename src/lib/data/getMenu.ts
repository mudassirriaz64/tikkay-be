import { MenuPageData } from "@/types";
import { db } from "./defaults";

export async function getMenu(): Promise<MenuPageData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return db.menu;
}
