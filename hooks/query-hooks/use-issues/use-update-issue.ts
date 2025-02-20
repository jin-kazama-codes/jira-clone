"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from ".";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";

const useUpdateIssue = (sprintId?: string) => {
  const queryClient = useQueryClient();
  const {issueKey} = useSelectedIssueContext()

  const { mutate: updateIssue, isLoading: isUpdating } = useMutation(
    ["issues", sprintId],
    api.issues.patchIssue,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newIssue) => {
        const sprintId = newIssue?.sprintId;
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["issues", sprintId]);
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData<IssueType[]>([
          "issues",
          sprintId,
        ]);

        queryClient.setQueryData(["issues", sprintId], (old?: IssueType[]) => {
          const newIssues = (old ?? []).map((issue) => {
            const { issueId, ...updatedProps } = newIssue;
            if (issue.id === issueId) {
              // Assign the new prop values to the issue
              return Object.assign(issue, updatedProps);
            }
            return issue;
          });
          return newIssues;
        });
        toast.success({
          message: `Issue ${newIssue.issueId} updated!`,
          description: "Changes saved successfully.",
        });
        // }
        // Return a context object with the snapshotted value
        return { previousIssues };
      },
      onError: (err: AxiosError, newIssue, context) => {
        const sprintId = newIssue?.sprintId;
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(["issues", sprintId], context?.previousIssues);

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }

        toast.error({
          message: `Something went wrong while updating the issue ${newIssue.issueId}`,
          description: "Please try again later.",
        });
      },
      onSettled: (newIssue) => {
        const newIssueKey = newIssue.key
        const issueSprintId = newIssue.sprintId
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues", issueSprintId ?? sprintId]);
        queryClient.invalidateQueries([`issueDetails`, newIssueKey ?? issueKey]);

      },
    }
  );

  return { updateIssue, isUpdating };
};

export { useUpdateIssue };
