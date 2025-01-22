import { getBaseUrl } from "@/utils/helpers";

const PAGE_SIZE = 2;

export async function getSprintsPaginatedFromServer(page: number = 0) {
  const baseUrl = getBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/sprints?page=${page}&limit=${PAGE_SIZE}`
  );
  if (!response.ok) throw new Error("Failed to fetch sprints");
  const json = await response.json();
  return json;
}
