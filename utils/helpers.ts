import { type IssueCountType } from "./types";
import { type IssueType } from "@/utils/types";
import { type DefaultUser, type Issue } from "@prisma/client";

type Value<T> = T extends Promise<infer U> ? U : T;

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export function getHeaders() {
  return {
    "Content-type": "application/json",
  };
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeMany(str: string) {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function getIssueCountByStatus(issues: IssueType[]) {
  return issues.reduce(
    (acc, issue) => {
      acc[issue.status]++;
      return acc;
    },
    {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    } as IssueCountType
  );
}

export function isEpic(issue: IssueType | IssueType["parent"] | null) {
  if (!issue) return false;
  return issue.type == "EPIC";
}

export function isSubtask(issue: IssueType | null) {
  if (!issue) return false;
  return issue.type == "SUBTASK";
}

export function hasChildren(issue: IssueType | IssueType["parent"] | null) {
  if (!issue) return false;
  return issue.children.length > 0;
}

export function sprintId(id: string | null | undefined) {
  return id == "backlog" ? null : id;
}

export function isNullish<T>(
  value: T | null | undefined
): value is null | undefined {
  return value == null || value == undefined;
}

export function filterUserForClient(user: DefaultUser) {
  return <DefaultUser>{
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}

export function issueNotInSearch({
  issue,
  search,
}: {
  issue: IssueType;
  search: string;
}) {
  return (
    search.length &&
    !(
      issue.name.toLowerCase().includes(search.toLowerCase()) ||
      issue.assignee?.name.toLowerCase().includes(search.toLowerCase()) ||
      issue.key.toLowerCase().includes(search.toLowerCase())
    )
  );
}

export function assigneeNotInFilters({
  issue,
  assignees,
}: {
  issue: IssueType;
  assignees: string[];
}) {
  return (
    assignees.length && !assignees.includes(issue.assignee?.id ?? "unassigned")
  );
}

export function epicNotInFilters({
  issue,
  epics,
}: {
  issue: IssueType;
  epics: string[];
}) {
  return epics.length && (!issue.parentId || !epics.includes(issue.parentId));
}

export function issueTypeNotInFilters({
  issue,
  issueTypes,
}: {
  issue: IssueType;
  issueTypes: string[];
}) {
  return issueTypes.length && !issueTypes.includes(issue.type);
}

export function issueSprintNotInFilters({
  issue,
  sprintIds,
  excludeBacklog = false,
}: {
  issue: IssueType;
  sprintIds: string[];
  excludeBacklog?: boolean;
}) {
  if (isNullish(issue.sprintId)) {
    if (sprintIds.length && excludeBacklog) return true;
    return false;
  }
  return sprintIds.length && !sprintIds.includes(issue.sprintId);
}

export function dateToLongString(date: Date) {
  const dateString = new Date(date).toDateString();
  const timeStirng = new Date(date).toLocaleTimeString();

  return dateString + " at " + timeStirng;
}

export function isDone(issue: IssueType) {
  return issue.status == "DONE";
}

export function hexToRgba(hex: string | null, opacity?: number) {
  if (!hex) return "rgba(0, 0, 0, 0)";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity ?? 1})`;
}

export function generateIssuesForClient(
  issues: Issue[],
  users: DefaultUser[],
  activeSprintIds?: string[]
) {
  // Maps are used to make lookups faster
  const userMap = new Map(users.map((user) => [user.id, user]));
  const parentMap = new Map(issues.map((issue) => [issue.id, issue]));

  const issuesForClient = issues.map((issue) => {
    const parent = parentMap.get(issue.parentId ?? "") ?? null;
    const assignee = userMap.get(issue.assigneeId ?? "") ?? null;
    const reporter = userMap.get(issue.reporterId) ?? null;
    const children = issues
      .filter((i) => i.parentId === issue.id)
      .map((issue) => {
        const assignee = userMap.get(issue.assigneeId ?? "") ?? null;
        return Object.assign(issue, { assignee });
      });
    const sprintIsActive = activeSprintIds?.includes(issue.sprintId ?? "");
    return { ...issue, sprintIsActive, parent, assignee, reporter, children };
  });

  return issuesForClient as IssueType[];
}

export function calculateInsertPosition(issues: Issue[]) {
  return Math.max(...issues.map((issue) => issue.sprintPosition), 0) + 1;
}

export function moveItemWithinArray<T>(arr: T[], item: T, newIndex: number) {
  const arrClone = [...arr];
  const oldIndex = arrClone.indexOf(item);
  const oldItem = arrClone.splice(oldIndex, 1)[0];
  if (oldItem) arrClone.splice(newIndex, 0, oldItem);
  return arrClone;
}

export function insertItemIntoArray<T>(arr: T[], item: T, index: number) {
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
}

export function getPluralEnd<T>(arr: T[]) {
  if (arr.length == 0) return "s";
  return arr.length > 1 ? "s" : "";
}

export const setCookie = (param: string, obj: {}) => {
  // Set project in cookie when a project is clicked
  const cookieValue = JSON.stringify(obj);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // Cookie expires in 7 days
  document.cookie = `${param}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; secure; SameSite=Strict`;
};

export const timeStringToMinutes = (timeString?: string) => {
  if (!timeString) return 0; // Return 0 if timeString is null or undefined

  const timeRegex = /(?:(\d+)w)?\s*(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?/;
  const matches = timeString.match(timeRegex);

  const weeks = parseInt(matches?.[1] || 0, 10) * 10080; // 1 week = 10080 minutes
  const days = parseInt(matches?.[2] || 0, 10) * 1440;   // 1 day = 1440 minutes
  const hours = parseInt(matches?.[3] || 0, 10) * 60;     // 1 hour = 60 minutes
  const minutes = parseInt(matches?.[4] || 0, 10);

  return weeks + days + hours + minutes;
};

export const minutesToTimeString = (totalMinutes) => {
  const weeks = Math.floor(totalMinutes / 10080);
  const days = Math.floor((totalMinutes % 10080) / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return `${weeks > 0 ? `${weeks}w ` : ""}${days > 0 ? `${days}d ` : ""}${
    hours > 0 ? `${hours}h ` : ""
  }${minutes > 0 ? `${minutes}m` : ""}`.trim();
};

export const calculateTimeRemaining = (timeSpent, estimateTime) => {
  const timeSpentMinutes = timeStringToMinutes(timeSpent);
  const estimateTimeMinutes = timeStringToMinutes(estimateTime);

  const remainingMinutes = estimateTimeMinutes - timeSpentMinutes;
  if(remainingMinutes > 0 ){
    return minutesToTimeString(remainingMinutes)
  } else if(remainingMinutes == 0){
    return '0m'
  }else{
    return 'Overdue'
  }
};

export const calculatePercentage = (timeSpent?: string, estimateTime?: string) => {
  const timeSpentMinutes = timeStringToMinutes(timeSpent);
  const estimateTimeMinutes = timeStringToMinutes(estimateTime);

  if (estimateTimeMinutes === 0) return 0; // Prevent division by zero

  return (timeSpentMinutes / estimateTimeMinutes) * 100;
};

export const combineTimeSpent = (existingTimeSpent: string, newTimeSpent: string) => {

    const existingMinutes = timeStringToMinutes(existingTimeSpent)
    const newMinutes = timeStringToMinutes(newTimeSpent)

    const totalMinutes =  existingMinutes + newMinutes

    return minutesToTimeString(totalMinutes)
}