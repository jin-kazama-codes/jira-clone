"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type Sprint } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from "./use-issues";

export const useSprints = (sprintId?: string) => {
  const queryClient = useQueryClient();

  // GET
  const {
    data: sprints,
    isLoading: sprintsLoading,
    refetch,
  } = useQuery(["sprints"], api.sprints.getSprints, {
    enabled: true, // Only fetch if project ID is present
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 1, // Retry only once if the query fails
  });

  // UPDATE
  const { mutate: updateSprint, isLoading: isUpdating } = useMutation(
    api.sprints.patchSprint,
    {
      onMutate: async (newSprint) => {
        await queryClient.cancelQueries(["sprints"]);
        const previousSprints = queryClient.getQueryData<{
          pages: { sprints: Sprint[] }[];
        }>(["sprints"]);

        queryClient.setQueryData(
          ["sprints"],
          (old?: { pages: { sprints: Sprint[] }[] }) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                sprints: page.sprints.map((sprint) => {
                  const { sprintId, ...updatedProps } = newSprint;
                  if (sprint.id === sprintId) {
                    return { ...sprint, ...updatedProps };
                  }
                  return sprint;
                }),
              })),
            };
          }
        );

        return { previousSprints };
      },
      onError: (err: AxiosError, newSprint, context) => {

        // Let's skip the error handling for position updates specifically
        if (newSprint.position !== undefined) {
          console.log("Skipping error handling for position update");
          return;
        }

        if (context?.previousSprints) {
          queryClient.setQueryData(["sprints"], context.previousSprints);
        }

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }

        toast.error({
          message: `Something went wrong while updating sprint ${newSprint.sprintId}`,
          description: "Please try again later.",
        });
      },
      onSettled: (newSprint) => {
        console.log("inside updateSprint")
        const sprintIden = newSprint?.id ?? "backlog"
        console.log("updateSprintId", sprintIden)
        queryClient.invalidateQueries(["sprints"]);
        queryClient.invalidateQueries(["issues", sprintIden])
        console.log("after updateSprint")
      },
    }
  );

  // POST
  const { mutate: createSprint, isLoading: isCreating } = useMutation(
    api.sprints.postSprint,
    {
      // NO OPTIMISTIC UPDATE BECAUSE WE DON'T KNOW THE KEY OF THE NEW SPRINT
      onError: (err: AxiosError) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating sprint`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["sprints"]);
      },
    }
  );

  // DELETE
  const { mutate: deleteSprint, isLoading: isDeleting } = useMutation(
    api.sprints.deleteSprint,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (deletedSprint) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["sprints"] });
        // Snapshot the previous value
        const previousSprints = queryClient.getQueryData<Sprint[]>(["sprints"]);
        // Optimistically delete the sprint
        queryClient.setQueryData(["sprints"], (old: Sprint[] | undefined) => {
          return old?.filter((sprint) => sprint.id !== deletedSprint.sprintId);
        });
        // Return a context object with the snapshotted value
        return { previousSprints };
      },
      onError: (err: AxiosError, deletedSprint, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while deleting the sprint ${deletedSprint.sprintId}`,
          description: "Please try again later.",
        });
        queryClient.setQueryData(["sprints"], context?.previousSprints);
      },
      onSettled: (sprint) => {
        toast.success({
          message: `Deleted sprint ${sprint.name}`,
          description: "Sprint deleted",
        });
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["sprints"]);
      },
    }
  );

  return {
    sprints,
    refetch,
    sprintsLoading,
    updateSprint,
    isUpdating,
    createSprint,
    isCreating,
    deleteSprint,
    isDeleting,
  };
};
