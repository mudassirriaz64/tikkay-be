import { JourneyPost } from '@/types';
import { aboutService } from '@/lib/api/about.service';
import { tryOrFallback } from '@/lib/api/client';
import { db } from './defaults';

export async function getJourneyPosts(): Promise<JourneyPost[]> {
  return tryOrFallback(
    async () => aboutService.getJourneyPosts(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return db.about.journeyPosts;
    },
  );
}
