"use client";
import { api } from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUpdateIssue } from "./use-update-issue";
import { useUpdateIssuesBatch } from "./use-update-batch";
import { usePostIssue } from "./use-post-issue";
import { useDeleteIssue } from "./use-delete-issue";

export const TOO_MANY_REQUESTS = {
  message: `You have exceeded the number of requests allowed per minute.`,
  description: "Please try again later.",
};

export const useIssues = (sprintId?: string | null) => {
  const sprintIden = sprintId !== null ? sprintId : "backlog";
  const { data: issues, isLoading: issuesLoading } = useQuery(
    ["issues", sprintIden], // Dynamic query key with sprintId
    ({ signal }) => {
      // Extract sprintId from the query key
      return getIssuesBySprintId({ signal }, sprintId); // Call API with sprintId
    },
    {
      enabled: !!sprintId, // Only fetch if sprintId is present
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
      retry: 1, // Retry only once if the query fails
    }
  );

  const getIssuesBySprintId = async (
    { signal }: { signal: AbortSignal },
    sprintId?: string | null
  ) => {
    const res = await api.issues.getIssuesBySprintId(
      signal,
      sprintId ?? sprintId
    );
    return res;
    // return queryClient.getQueryData<IssueType[]>(["issues", sprintId]);
  };

  const getIssueCountBySprintId = (sprintId?: string | null) => {
    return useQuery({
      queryKey: [`${sprintId}-count`, sprintId], // Unique query key
      queryFn: () => api.issues.getIssueCount(sprintId ?? sprintId), // Fetch issues or return an empty array for backlog
      enabled: !!sprintId, // Prevent fetching if no sprintId is provided
      staleTime: 5 * 60 * 1000, // Adjust as needed
      cacheTime: 10 * 60 * 1000, // Adjust as needed
    });
  };

  const { updateIssuesBatch, batchUpdating } = useUpdateIssuesBatch(sprintIden);
  const { updateIssue, isUpdating } = useUpdateIssue(sprintIden);
  const { createIssue, isCreating } = usePostIssue(sprintIden);
  const { deleteIssue, isDeleting } = useDeleteIssue(sprintIden);

  return {
    issues,
    issuesLoading,
    updateIssue,
    isUpdating,
    updateIssuesBatch,
    batchUpdating,
    createIssue,
    isCreating,
    deleteIssue,
    isDeleting,
    getIssuesBySprintId,
    getIssueCountBySprintId,
  };
};
