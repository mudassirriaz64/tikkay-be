import { JourneyPost } from '@/types';
import { mockJourneyPosts } from '../mock/journey';

export async function getJourneyPosts(): Promise<JourneyPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockJourneyPosts;
}
