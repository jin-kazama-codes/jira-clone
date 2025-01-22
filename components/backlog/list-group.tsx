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
import { useCallback, useEffect, useState } from "react";
import { useFiltersContext } from "@/context/use-filters-context";
import {
  assigneeNotInFilters,
  epicNotInFilters,
  insertItemIntoArray,
  isEpic,
  isNullish,
  isSubtask,
  issueNotInSearch,
  issueTypeNotInFilters,
  sprintId,
} from "@/utils/helpers";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { type Sprint } from "@prisma/client";
import { Button } from "../ui/button";

const ListGroup: React.FC<{
  className?: string;
  sprints: Sprint[];
  hasNextPage;
  fetchNextPage;
  isFetchingNextPage;
}> = ({
  className,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  sprints,
}) => {
  const { updateIssue, getIssuesBySprintId } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { search, assignees, issueTypes, epics } = useFiltersContext();
  const [openAccordion, setOpenAccordion] = useState<[]>([]);
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  async function fetchAllIssues() {
    if (!sprints.length) return;

    try {
      setLoading(true); // Start loading

      setOpenAccordion(sprints[0]?.id);

      // Fetch sprint issues
      const sprintIssuesPromises = sprints.map((sprint) =>
        getIssuesBySprintId(sprint.id)
      );

      // Fetch backlog issues (explicitly passing null)
      const backlogIssuesPromise = getIssuesBySprintId();

      // Wait for all issues to be fetched
      const allIssues = await Promise.all([
        ...sprintIssuesPromises,
        backlogIssuesPromise,
      ]);

      // Combine all issues
      const combinedIssues = allIssues.flat();

      setIssues(combinedIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  useEffect(() => {
    fetchAllIssues();
  }, [sprints]);

  // Refetch issues when the accordion changes
  // useEffect(() => {
  //   async function fetchIssues() {
  //     if (openAccordion) {
  //       setLoading(true);
  //       const issueData = await getIssuesBySprintId(openAccordion);
  //       setIssues(issueData);
  //       setLoading(false);
  //     }
  //   }

  //   fetchIssues();
  // }, [openAccordion]);

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, sprintId: string | null) => {
      if (!issues) return [];
      return issues.filter((issue) => {
        if (
          issue.sprintId === sprintId &&
          !isEpic(issue) &&
          !isSubtask(issue)
        ) {
          if (issueNotInSearch({ issue, search })) return false;
          if (assigneeNotInFilters({ issue, assignees })) return false;
          if (epicNotInFilters({ issue, epics })) return false;
          if (issueTypeNotInFilters({ issue, issueTypes })) return false;
          return true;
        }
        return false;
      });
    },
    [search, assignees, epics, issueTypes]
  );

  const onDragEnd = (result: DropResult) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;

    updateIssue({
      issueId: result.draggableId,
      sprintId: sprintId(destination.droppableId),
      sprintPosition: calculateIssueSprintPosition({
        activeIssues: issues ?? [],
        destination,
        source,
        droppedIssueId: result.draggableId,
      }),
    });
  };

  if (loading) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  if (!sprints || !sprints.length) {
    return <div className="py-10 text-center">No sprints available</div>;
  }

  return (
    <div
      className={clsx(
        "min-h-full w-full max-w-full overflow-y-auto",
        className
      )}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {sprints.map((sprint) => (
          <div key={sprint.id} className="my-3">
            <SprintList
              sprint={sprint}
              issues={
                // openAccordion === sprint.id
                filterIssues(issues, sprint.id)
                // : []
              }
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
            />
            
          </div>
        ))}
        {hasNextPage && (
              <div className="py-4 text-center">
                <button
                  onClick={handleLoadMore}
                  className="btn btn-primary"
                  disabled={isFetchingNextPage}
                >
                
                  {isFetchingNextPage ? (<div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 dark:bg-darkSprint-30 border-t-black dark:border-t-dark-0" />) : (<Button className="rounded-xl px-4 dark:!bg-dark-0  !bg-button hover:!bg-buttonHover">
          <span className="whitespace-nowrap text-white">Load More</span>
        </Button>)}
                </button>
              </div>
            )}
        <BacklogList id="backlog" issues={filterIssues(issues, null)} />
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
  const sortedIssues = activeIssues
    .filter((issue) => issue.sprintId === destination.droppableId)
    .sort((a, b) => a.sprintPosition - b.sprintPosition);

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
