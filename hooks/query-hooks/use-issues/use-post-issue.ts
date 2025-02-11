"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from ".";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";

const usePostIssue = (sprintId?:string) => {
  const queryClient = useQueryClient();
  const { issueKey } = useSelectedIssueContext()

  const { mutate: createIssue, isLoading: isCreating } = useMutation(
    api.issues.postIssue,
    {
      // NO OPTIMISTIC UPDATE BECAUSE WE DON'T KNOW THE KEY OF THE NEW ISSUE
      onError: (err: AxiosError, createdIssue) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating the issue ${createdIssue.name}`,
          description: "Please try again later.",
        });
      },
      onSettled: (createdIssue) => {
        queryClient.invalidateQueries(["issues", sprintId]);
        queryClient.invalidateQueries([`issueDetails`, issueKey])
        queryClient.invalidateQueries([`${sprintId}-count`, sprintId ])
      },
    }
  );
  return { createIssue, isCreating };
};

export { usePostIssue };
