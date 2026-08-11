import { JourneyPost } from '@/types';
import { db } from './defaults';

export async function getJourneyPosts(): Promise<JourneyPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return db.about.journeyPosts;
}
