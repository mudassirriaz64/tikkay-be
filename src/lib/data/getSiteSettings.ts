import { SiteSettings } from '@/types';
import { mockSiteSettings } from '../mock/settings';

export async function getSiteSettings(): Promise<SiteSettings> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSiteSettings;
}
