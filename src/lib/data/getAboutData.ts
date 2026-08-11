import { FounderDetails, StatItem } from "../mock/about";
import { db } from "./defaults";

export async function getAboutFounderDetails(): Promise<FounderDetails> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return db.about.founder;
}

export async function getAboutStats(): Promise<StatItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return db.about.stats;
}
