"use client";
import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookie } from "../use-cookie";
import toast from "react-hot-toast";

export const useMembers = () => {
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const project = useCookie("project");

  const { data: members, isLoading, isError, error, refetch } = useQuery(
    ["project-members", project?.id],
    () => api.project.getMembers({ project_id: project?.id ?? "" }),
    {
      enabled: !!project?.id, // Only fetch if project ID is present
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
      retry: 1, // Retry only once if the query fails
    }
  );

  const {
    mutate: updateMember,
    isLoading: memberUpdating,
    error: updatingMemberError,
  } = useMutation({
    mutationFn: (updatedData: any) =>
      api.project.updateMember(updatedData),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["project-members", project?.id],
      });
      toast.success("Member updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update Member: ${error.message}`);
    },
  });

  return {
    members,
    isLoading,
    isError,
    error,
    refetch, // Optionally expose refetch for manual refetching
    updateMember,
    memberUpdating
  };
};
