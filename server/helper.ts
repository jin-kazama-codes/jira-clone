import { getBaseUrl } from "@/utils/helpers";
import { prisma } from "./db";

const PAGE_SIZE = 2;
const baseUrl = getBaseUrl();

export async function getSprintsPaginatedFromServer(page: number = 0) {
  const response = await fetch(
    `${baseUrl}/api/sprints?page=${page}&limit=${PAGE_SIZE}`
  );
  if (!response.ok) throw new Error("Failed to fetch sprints");
  const json = await response.json();
  return json;
}

export async function getIssueIdByKey(issueKey: string) {
  const response = await fetch(`${baseUrl}/api/issue/${issueKey}`);
  if (!response.ok) throw new Error("Failed to fetch sprints");
  const issue = await response.json();
  return issue?.id;
}
