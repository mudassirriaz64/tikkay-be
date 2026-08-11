import { db, Database } from "./defaults";

export async function getAdminPageData(): Promise<Database> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return db;
}
