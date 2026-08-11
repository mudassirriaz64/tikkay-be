import { db } from "./defaults";
import { MilestoneStat } from "../mock/milestones";

export async function getMilestones(): Promise<MilestoneStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return db.about.milestones;
}
