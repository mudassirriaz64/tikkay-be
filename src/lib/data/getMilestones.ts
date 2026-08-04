import { mockMilestones } from "../mock/milestones";

export async function getMilestones() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockMilestones;
}
