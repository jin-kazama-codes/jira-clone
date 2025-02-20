import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useWorklog = (issueId?: string) => {
  const queryClient = useQueryClient();

  // Get Worklogs
  const {
    data: worklogs,
    isLoading: worklogsLoading,
    refetch: refetchWorklogs,
  } = useQuery([`worklogs`, issueId], () => {
    return api.worklog.getWorklog(issueId);
  });

  // Update Worklog
  const {
    mutate: updateWorklog,
    isLoading: worklogUpdating,
    error: updatingWorklogError,
  } = useMutation({
    mutationFn: ({ worklogId, worklog }: { worklogId: string; worklog: any }) =>
      api.worklog.updateWorklog(worklogId, worklog),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["worklogs", issueId],
      });
      toast.success("Worklog updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update worklog: ${error.message}`);
    },
  });

  //Create Worklog
  const {
    mutate: createWorklog,
    isLoading: worklogCreating,
    error: creatingWorklogError,
  } = useMutation({
    mutationFn: (worklog: any) => api.worklog.createWorklog(worklog),
    onSettled: () => {
      queryClient.invalidateQueries(["worklogs", issueId]);
      toast.success("Worklog created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to create worklog: ${error.message}`);
    },
  });

  const {
    mutate: deleteWorklog,
    isLoading: worklogDeleting,
    error: deletingWorklogError,
  } = useMutation({
    mutationFn: (worklogId) => api.worklog.deleteWorklog(worklogId),
    onSettled: (worklog) => {
      const worklogIssueId = worklog?.issueId;
      queryClient.invalidateQueries([`worklogs`, worklogIssueId ?? issueId]);
      toast.success("Worklog deleted successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to delete document:", error);
    },
  });

  return {
    worklogs,
    worklogsLoading,
    refetchWorklogs,
    updateWorklog,
    worklogUpdating,
    updatingWorklogError,
    createWorklog,
    worklogCreating,
    creatingWorklogError,
    deleteWorklog,
    deletingWorklogError,
    worklogDeleting,
  };
};
