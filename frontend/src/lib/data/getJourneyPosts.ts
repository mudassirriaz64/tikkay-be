import { JourneyPost } from '@/types';
import { aboutService } from '@/lib/api/about.service';

export async function getJourneyPosts(): Promise<JourneyPost[]> {
  return aboutService.getJourneyPosts();
}
