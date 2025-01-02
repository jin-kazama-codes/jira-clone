"use client";
import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useWorkflow = () => {
  const queryClient = useQueryClient();

  // Mutation for creating a workflow
  const createWorkflowMutation = useMutation({
    mutationFn: () => api.workflow.createWorkflow(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["workflow"],
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to create workflow: ${error.message}`);
    },
  });

  // Mutation for updating the workflow
  const updateWorkflowMutation = useMutation({
    mutationFn: (updatedWorkflow: any) => api.workflow.updateWorkflow(updatedWorkflow),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["workflow"],
      });
      toast.success("Workflow updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update workflow: ${error.message}`);
    },
  });

  // Query for fetching the workflow
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    ["workflow"],
    () => api.workflow.getWorkflow(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
      retry: 1, // Retry only once if the query fails
    }
  );

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    createWorkflow: createWorkflowMutation.mutate,
    updateWorkflow: updateWorkflowMutation.mutate, // Expose update mutation
  };
};
