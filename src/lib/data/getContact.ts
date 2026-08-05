import { ContactPageData } from "@/types/contact";
import { mockContactPageData } from "../mock/contact";

export async function getContactPageData(): Promise<ContactPageData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockContactPageData;
}
