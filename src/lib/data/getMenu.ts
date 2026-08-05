import { MenuPageData } from "@/types";
import {
  mockBotiData,
  mockFeaturedItems,
  mockMenuCategories,
  mockMenuItems,
  mockMenuTabs,
  mockPlatterData,
  mockSideItems,
} from "../mock/menu";

export async function getMenu(): Promise<MenuPageData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    categories: mockMenuCategories,
    items: mockMenuItems,
    tabs: mockMenuTabs,
    featured: mockFeaturedItems,
    platter: mockPlatterData,
    boti: mockBotiData,
    sides: mockSideItems,
  };
}
