import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookie } from "../use-cookie";
import toast from "react-hot-toast";

export const useDocuments = (parentId?: string | number) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const project = useCookie("project");
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    ["documents", project?.id, parentId],
    () => {
      return parentId
        ? api.document.getDocuments(parentId)
        : api.document.getDocuments();
    },
    {
      enabled: !!project?.id, // Only fetch if project ID is present
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
      retry: 1, // Retry only once if the query fails
    }
  );

  const deleteDocumentMutation = useMutation({
    mutationFn: ({
      documentId,
      folder,
    }: {
      documentId: number;
      folder?: boolean;
    }) => api.document.deleteDocument(documentId, folder),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["documents"], // Fixed typo: `querykey` -> `queryKey`
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete document:", error);
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
