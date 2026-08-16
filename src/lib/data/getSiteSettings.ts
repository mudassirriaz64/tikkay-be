import { SiteSettings } from "@/types";
import { settingsService } from "@/lib/api/settings.service";
import { tryOrFallback } from "@/lib/api/client";
import { db } from "./defaults";

export async function getSiteSettings(): Promise<SiteSettings> {
  return tryOrFallback(
    async () => settingsService.get(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return db.settings;
    },
  );
}
