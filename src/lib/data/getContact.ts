import { ContactPageData } from "@/types/contact";
import { contactService } from "@/lib/api/contact.service";
import { tryOrFallback } from "@/lib/api/client";
import { db } from "./defaults";

export async function getContactPageData(): Promise<ContactPageData> {
  return tryOrFallback(
    async () => contactService.getPageData(),
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return db.contact;
    },
  );
}
