"use client";
import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { type GetIssueCommentsResponse } from "@/app/api/issues/[issueId]/comments/route";
import { toast } from "@/components/toast";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS, useIssues } from "./use-issues";

export const useIssueDetails = (issueId?: string) => {
  const { issueKey } = useSelectedIssueContext();
  
  // const { issues } = useIssues();

  // const getIssueId = useCallback(
  //   (issues: IssueType[] | undefined) => {
  //     return issues?.find((issue) => issue.key === issueKey)?.id ?? null;
  //   },
  //   [issueKey]
  // );

  // const [issueId, setIssueId] = useState<IssueType["id"] | null>(() =>
  //   getIssueId(issues)
  // );

  // useEffect(() => {
  //   setIssueId(getIssueId(issues));
  // }, [setIssueId, getIssueId, issues]);

  const queryClient = useQueryClient();

  // GET
  const { data: comments, isLoading: commentsLoading } = useQuery(
    ["comments", issueId],
    () => api.issues.getIssueComments({ issueId: issueId ?? "" }),
    {
      enabled: !!issueId,
      refetchOnMount: false,
    }
  );

  // Get issue Details
  const { data: issue, isLoading: issueLoading, refetch } = useQuery(
    [`issueDetails`, issueKey],
    () => {
      return api.issues.getIssueDetails(issueKey);
    },  
    {
      enabled: !!issueKey,
      refetchOnMount: true
    }
  );

  // POST
  const { mutate: addComment, isLoading: isAddingComment } = useMutation(
    api.issues.addCommentToIssue,
    {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["comments", issueId]);
        queryClient.invalidateQueries([`issueDetails`, issueKey]);
      },
      onError: (err: AxiosError) => {
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating comment`,
          description: "Please try again later.",
        });
      },
    }
  );

  // PATCH
  const { mutate: updateComment, isLoading: commentUpdating } = useMutation(
    api.issues.updateIssueComment,
    {
      onMutate: async (newComment) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["comments", issueId]);

        // Snapshot the previous value
        const previousComments = queryClient.getQueryData<
          GetIssueCommentsResponse["comments"]
        >(["comments", issueId]);
        // Optimistically update the comment
        queryClient.setQueryData(
          ["comments", issueId],
          (old?: GetIssueCommentsResponse["comments"]) => {
            const newComments = (old ?? []).map((comment) => {
              const { content } = newComment;
              if (comment.id === newComment.commentId) {
                // Assign the new prop values to the comment
                return { ...comment, content };
              }
              return comment;
            });
            return newComments;
          }
        );
        // Return a context object with the snapshotted value
        return { previousComments };
      },
      onError: (err: AxiosError, newIssue, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(
          ["comments", issueId],
          context?.previousComments
        );

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }

        toast.error({
          message: `Something went wrong while updating comment`,
          description: "Please try again later.",
        });
      },
      onSettled: (comment) => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["comments", issueId]);
        queryClient.invalidateQueries([`issueDetails`, issueKey]);

      },
    }
  );

  //DELETE

  const deleteComment = useMutation(
    async ({ issueId, commentId }: { issueId: string; commentId: string }) => {
      const response = await fetch(
        `/api/issues/${issueId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      return response.json();
    },
    {
      // Optimistically update the cache when the comment is deleted
      onSettled: () => {
        queryClient.invalidateQueries(["comments", issueId]);
        queryClient.invalidateQueries([`issueDetails`, issueKey]);
      },
    }
  );

  return {
    comments,
    commentsLoading,
    addComment,
    isAddingComment,
    updateComment,
    deleteComment,
    commentUpdating,
    issue,
    issueLoading,
    refetch
  };
};
