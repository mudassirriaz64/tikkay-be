import { SiteSettings } from '@/types';
import { db } from './defaults';

export async function getSiteSettings(): Promise<SiteSettings> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return db.settings;
}
