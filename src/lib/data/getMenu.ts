import { MenuCategory, MenuItem } from '@/types';
import { mockMenuCategories, mockMenuItems } from '../mock/menu';

export async function getMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    categories: mockMenuCategories,
    items: mockMenuItems,
  };
}
