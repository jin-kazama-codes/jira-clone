"use client";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useCookie } from "../use-cookie";

export const useMembers = () => {
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

  return {
    members,
    isLoading,
    isError,
    error,
    refetch, // Optionally expose refetch for manual refetching
  };
};
