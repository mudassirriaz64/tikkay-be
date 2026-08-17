import { aboutService } from "@/lib/api/about.service";

export async function getMilestones() {
  return aboutService.getMilestones();
}
