import { db, Database } from "./defaults";
import { settingsService } from "@/lib/api/settings.service";
import { menuService } from "@/lib/api/menu.service";
import { reviewsService } from "@/lib/api/reviews.service";
import { galleryService } from "@/lib/api/gallery.service";
import { contactService } from "@/lib/api/contact.service";
import { aboutService } from "@/lib/api/about.service";
import { ordersService, usersService } from "@/lib/api";
import { tryOrFallback } from "@/lib/api/client";
import type { GalleryItem } from "../mock/gallery";

export async function getAdminPageData(): Promise<Database> {
  return tryOrFallback<Database>(
    async () => {
      const [settings, menu, reviews, gallery, contact, about] = await Promise.all([
        settingsService.get(),
        menuService.getPageData(),
        reviewsService.getPageData(),
        galleryService.getPageData(),
        contactService.getPageData(),
        aboutService.getPageData(),
      ]);

      const galleryItems: GalleryItem[] = (gallery.gallery || []) as unknown as GalleryItem[];
      const orders = await tryOrFallback(
        async () => ordersService.getAll({ limit: 20 }),
        db.orders.orders as unknown as typeof db.orders.orders,
      );
      const users = await tryOrFallback(
        async () => usersService.getAll(),
        [] as Array<{ id: string; name: string; email: string }>,
      );
      void users;

      return {
        settings,
        menu,
        reviews,
        gallery: { pageData: gallery, galleryItems },
        contact,
        about,
        orders: {
          profile: db.orders.profile,
          orders: orders as unknown as typeof db.orders.orders,
          reviews: db.orders.reviews,
          menuItems: menu.items,
        },
      };
    },
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return db;
    },
  );
}
