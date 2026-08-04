import { SiteSettings } from "@/types";

export const mockSiteSettings: SiteSettings = {
  id: "mock-settings-1",
  hero_title: "Fire-Grilled. Fresh Daily. Made With Pride.",
  hero_subtitle:
    "Experience the raw, untamed flavor of Pakistani street BBQ. No shortcuts, no gas grills - just pure charcoal heat and ancestral spice blends.",
  hero_media_url: "/images/hero_image.png",
  live_cam_active: false,
  fresh_batch_count: 124,
  updated_at: new Date().toISOString(),
};
