import { ContactPageData } from "@/types/contact";
import { db } from "./defaults";

export async function getContactPageData(): Promise<ContactPageData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return db.contact;
}
