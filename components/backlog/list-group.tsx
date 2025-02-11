"use client";

import { useIssues } from "@/hooks/query-hooks/use-issues";
import clsx from "clsx";
import { BacklogList } from "./list-backlog";
import { SprintList } from "./list-sprint";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { type IssueType } from "@/utils/types";
import { insertItemIntoArray, isNullish, sprintId } from "@/utils/helpers";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { type Sprint } from "@prisma/client";
import { Button } from "../ui/button";
import IssueListSkeleton from "../ui/issue-list-skeleton";
import { useQueryClient } from "@tanstack/react-query";

const ListGroup: React.FC<{
  className?: string;
  sprints: Sprint[];
  hasNextPage: any;
  fetchNextPage: any;
  isFetchingNextPage: any;
  isLoading: boolean 
}> = ({
  className,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  sprints,
  isLoading,
}) => {
  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const queryClient = useQueryClient();


  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;

    //todo calculatesprint position active issues need issues
    const activeIssues = queryClient.getQueryData<IssueType[]>([
      "issues",
      destination.droppableId,
    ]);

    updateIssue(
      {
        issueId: result.draggableId,
        sprintId: sprintId(destination.droppableId),
        sprintPosition: calculateIssueSprintPosition({
          activeIssues: activeIssues ?? [],
          destination,
          source,
          droppedIssueId: result.draggableId,
        }),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["issues", destination.droppableId]);
          queryClient.invalidateQueries(["issues", source.droppableId]);
        },
      }
    );
  };

  if (isLoading) {
    return <IssueListSkeleton />;
  }

  if (!sprints) return <div />;

  return (
    <div
      className={clsx(
        "min-h-full w-full max-w-full overflow-y-auto",
        className
      )}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {sprints.map((sprint, index) => (
          <div key={sprint.id} className="my-3">
            <SprintList sprint={sprint} index={index} />
          </div>
        ))}
        {hasNextPage && (
          <div className="py-4 text-center">
            <button
              onClick={handleLoadMore}
              className="btn btn-primary"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black dark:border-t-dark-0 dark:bg-darkSprint-30" />
              ) : (
                <Button className="rounded-xl !bg-button px-4  hover:!bg-buttonHover dark:!bg-dark-0">
                  <span className="whitespace-nowrap text-white">
                    Load More
                  </span>
                </Button>
              )}
            </button>
          </div>
        )}
        <BacklogList id="backlog" />
      </DragDropContext>
    </div>
  );
};

// Helper Functions
function calculateIssueSprintPosition(props: IssueListPositionProps) {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(props);
  let position: number;

  if (isNullish(prevIssue) && isNullish(nextIssue)) {
    position = 1;
  } else if (isNullish(prevIssue)) {
    position = nextIssue!.sprintPosition - 1;
  } else if (isNullish(nextIssue)) {
    position = prevIssue!.sprintPosition + 1;
  } else {
    position =
      prevIssue!.sprintPosition +
      (nextIssue!.sprintPosition - prevIssue!.sprintPosition) / 2;
  }

  return position;
}

type IssueListPositionProps = {
  activeIssues: IssueType[];
  destination: DraggableLocation;
  source: DraggableLocation;
  droppedIssueId: string;
};

function getAfterDropPrevNextIssue(props: IssueListPositionProps) {
  const { activeIssues, destination, droppedIssueId } = props;
  const sortedIssues = activeIssues.sort(
    (a, b) => a.sprintPosition - b.sprintPosition
  );

  const droppedIssue = activeIssues.find(
    (issue) => issue.id === droppedIssueId
  );
  const updatedIssues = insertItemIntoArray(
    sortedIssues,
    droppedIssue!,
    destination.index
  );

  return {
    prevIssue: updatedIssues[destination.index - 1],
    nextIssue: updatedIssues[destination.index + 1],
  };
}

ListGroup.displayName = "ListGroup";
export { ListGroup };
