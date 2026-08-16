import { db } from "./defaults";
import { MilestoneStat } from "../mock/milestones";
import { aboutService } from "@/lib/api/about.service";
import { tryOrFallback } from "@/lib/api/client";

export async function getMilestones(): Promise<MilestoneStat[]> {
  return tryOrFallback(
    async () => aboutService.getMilestones(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return db.about.milestones;
    },
  );
}
