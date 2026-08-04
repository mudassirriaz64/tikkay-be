import { FounderDetails, StatItem, mockFounderDetails, mockAboutStats } from '../mock/about';

export async function getAboutFounderDetails(): Promise<FounderDetails> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockFounderDetails;
}

export async function getAboutStats(): Promise<StatItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAboutStats;
}
