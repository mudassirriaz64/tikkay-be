import { SiteSettings } from "@/types";
import { settingsService } from "@/lib/api/settings.service";

export async function getSiteSettings(): Promise<SiteSettings> {
  return settingsService.get();
}
