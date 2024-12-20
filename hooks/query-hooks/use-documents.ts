import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookie } from "../use-cookie";

export const useDocuments = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const project = useCookie("project");
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["documents", project?.id], () => api.document.getdocuments(), {
    enabled: !!project?.id, // Only fetch if project ID is present
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 1, // Retry only once if the query fails
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: number) => api.document.deletedocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        querykey: ["documents"],
      });
    },
    onError: (error) => {
      console.error("failed to delete document");
    },
  });

  return {
    documents,
    isLoading,
    isError,
    error,
    deletedocument: deleteDocumentMutation.mutate,
    refetch, // Optionally expose refetch for manual refetching
  };
};
