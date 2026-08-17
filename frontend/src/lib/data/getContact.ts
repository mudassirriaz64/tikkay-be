import { ContactPageData } from "@/types/contact";
import { contactService } from "@/lib/api/contact.service";

export async function getContactPageData(): Promise<ContactPageData> {
  return contactService.getPageData();
}
