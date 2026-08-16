import { FounderDetails, StatItem } from "../mock/about";
import { aboutService } from "@/lib/api/about.service";
import { tryOrFallback } from "@/lib/api/client";
import { db } from "./defaults";

export async function getAboutFounderDetails(): Promise<FounderDetails> {
  return tryOrFallback(
    async () => aboutService.getPageData().then((p) => p.founder),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return db.about.founder;
    },
  );
}

export async function getAboutStats(): Promise<StatItem[]> {
  return tryOrFallback(
    async () => aboutService.getStats(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return db.about.stats;
    },
  );
}
