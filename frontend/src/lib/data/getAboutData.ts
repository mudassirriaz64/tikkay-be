import { aboutService } from "@/lib/api/about.service";

export async function getAboutPageData() {
  return aboutService.getPageData();
}

export async function getAboutFounderDetails() {
  const data = await aboutService.getPageData();
  return data.founder;
}

export async function getAboutStats() {
  return aboutService.getStats();
}
