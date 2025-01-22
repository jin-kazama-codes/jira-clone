"use client";
import { api } from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUpdateIssue } from "./use-update-issue";
import { useUpdateIssuesBatch } from "./use-update-batch";
import { usePostIssue } from "./use-post-issue";
import { useDeleteIssue } from "./use-delete-issue";
import { type IssueType } from "@/utils/types";

export const TOO_MANY_REQUESTS = {
  message: `You have exceeded the number of requests allowed per minute.`,
  description: "Please try again later.",
};

export const useIssues = () => {
  const { data: issues, isLoading: issuesLoading } = useQuery(
    ["issues"],
    ({ signal }) => api.issues.getIssues({ signal }),
    {
      enabled: true, // Only fetch if project ID is present
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
      retry: 1, // Retry only once if the query fails
    }
  );

  const getIssuesBySprintId = async (sprintId?: string | null) => {
    const res = await api.issues.getIssuesBySprintId(sprintId ?? sprintId);
    return res;
    // return queryClient.getQueryData<IssueType[]>(["issues", sprintId]);
  };

  const { updateIssuesBatch, batchUpdating } = useUpdateIssuesBatch();
  const { updateIssue, isUpdating } = useUpdateIssue();
  const { createIssue, isCreating } = usePostIssue();
  const { deleteIssue, isDeleting } = useDeleteIssue();

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
  };
};
