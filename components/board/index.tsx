"use client";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { type IssueStatus } from "@prisma/client";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { type IssueType } from "@/utils/types";
import {
  assigneeNotInFilters,
  epicNotInFilters,
  generatePastelColor,
  getPluralEnd,
  hasChildren,
  insertItemIntoArray,
  isEpic,
  isNullish,
  isSubtask,
  issueNotInSearch,
  issueSprintNotInFilters,
  issueTypeNotInFilters,
  moveItemWithinArray,
} from "@/utils/helpers";
import { IssueList } from "./issue-list";
import { IssueDetailsModal } from "../modals/board-issue-details";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { useFiltersContext } from "@/context/use-filters-context";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useCookie } from "@/hooks/use-cookie";
import clsx from "clsx";
import { IssueIcon } from "../issue/issue-icon";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { useWorkflow } from "@/hooks/query-hooks/use-workflow";
import { Container } from "../ui/container";

// const STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const Board: React.FC = () => {
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const { sprints, sprintsLoading } = useSprints();
  const { data: workflow, isLoading, isError } = useWorkflow();
  const [STATUSES, setStatuses] = useState([]);
  const [statusColors, setStatusColors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (workflow) {
      const labels = workflow.nodes.map((node) => node.data.label);
      setStatuses(labels);
    }
  }, [workflow]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const project = useCookie("project");

  useEffect(() => {
    const projectId = project.id; // Adjust based on your project object structure
    const storageKey = `statusColors-${projectId}`;
    const savedColors = localStorage.getItem(storageKey);
    const colorMap: Record<string, string> = savedColors
      ? JSON.parse(savedColors)
      : {};

    let needsUpdate = false;
    workflow?.nodes.forEach((node) => {
      const statusLabel = node.data.label;
      if (["To Do", "In Progress", "Done"].includes(statusLabel)) return;
      if (!colorMap[statusLabel]) {
        colorMap[statusLabel] = generatePastelColor();
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      localStorage.setItem(storageKey, JSON.stringify(colorMap));
    }

    setStatusColors(colorMap);
  }, [workflow]);

  const getStatusBackgroundColor = (status: string): string => {
    switch (status) {
      case "To Do":
        return "#d1d5db";
      case "In Progress":
        return "#93c5fd";
      case "Done":
        return "#86efac";
      default:
        return statusColors[status] || "#e5e7eb";
    }
  };

  const {
    search,
    assignees,
    issueTypes,
    epics,
    sprints: filterSprints,
  } = useFiltersContext();

  if (sprints?.length == 0) {
    return (
      <Container className="flex h-full w-full items-center justify-center font-mono text-2xl dark:text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
      </Container>
    );
  }

  const activeSprint = sprints?.find((sprint) => sprint.status === "ACTIVE");
  const fliteredSprint = sprints?.find(
    (sprint) => sprint.id === filterSprints[0]
  );

  if (activeSprint === undefined || null)
    return (
      <Container className="flex h-full w-full items-center justify-center font-mono text-2xl dark:text-white">
        <div>Start a sprint to access board</div>
      </Container>
    );

  const activeSprintId = filterSprints[0] ? filterSprints[0] : activeSprint.id;

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, status: string | null = null) => {
      if (!issues) return [];
      let filteredWithStatus = issues;
      if (status) {
        filteredWithStatus = issues.filter((issue) => issue.status === status);
      }
      const filteredIssues = filteredWithStatus.filter((issue) => {
        if (issue.sprintIsActive && !isEpic(issue) && !isSubtask(issue)) {
          if (issueNotInSearch({ issue, search })) return false;
          if (assigneeNotInFilters({ issue, assignees })) return false;
          if (epicNotInFilters({ issue, epics })) return false;
          if (issueTypeNotInFilters({ issue, issueTypes })) return false;
          if (issueSprintNotInFilters({ issue, sprintIds: filterSprints })) {
            return false;
          }

          return true;
        }
        return false;
      });
      return filteredIssues;
    },
    [search, assignees, epics, issueTypes, filterSprints]
  );

  const { updateIssue } = useIssues(activeSprintId);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const [showChild, setShowChild] = useState(false);
  const { issues, issuesLoading } = useIssues(activeSprintId);

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop + 20;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!issues || !sprints || !project) {
    return null;
  }

  if (issuesLoading)
    return (
      <div>
        {" "}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
      </div>
    );
  if (sprintsLoading)
    return (
      <div>
        {" "}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
      </div>
    );
  // if (isError) {
  //   return <div>Error: {error?.message || "Failed to load data"}</div>;
  // }

  const onDragEnd = (result: DropResult, childIssues = []) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;

    updateIssue({
      issueId: result.draggableId,
      status: destination.droppableId as string,
      boardPosition: calculateIssueBoardPosition({
        activeIssues: showChild
          ? childIssues
          : issues.filter((issue) => issue.sprintIsActive),
        destination,
        source,
        droppedIssueId: result.draggableId,
      }),
    });
  };

  const { setIssueKey } = useSelectedIssueContext();

  const child = issues
    .filter(
      (issue) =>
        issue.sprintIsActive && issue.children && issue.children.length > 0
    )
    .flatMap((issue) => issue.children);

  return (
    <Fragment>
      <IssueDetailsModal />
      <BoardHeader
        showChild={showChild}
        setChild={setShowChild}
        project={project}
        activeSprint={fliteredSprint ? fliteredSprint : activeSprint}
      />

      {/* CHILD ISSUE VIEW  */}
      {showChild && (
        // STATUS
        <div
          className="custom-scrollbar relative flex h-[68vh]
         max-w-full flex-col gap-x-4 overflow-y-scroll "
        >
          <div className="sticky top-0 z-40 flex gap-x-4 bg-white dark:bg-darkSprint-0">
            {STATUSES.map((status) => {
              return (
                <>
                  <div
                    key={status}
                    className="h-max min-h-fit w-[350px] rounded-xl border-x-2 px-1.5"
                    style={{
                      backgroundColor: getStatusBackgroundColor(status),
                    }}
                  >
                    <h2
                      className={` text-md sticky top-0 z-10  -mx-1.5 mb-1.5 rounded-t-md   px-2 py-3 font-semibold text-black dark:border-y-darkSprint-30`}
                      style={{
                        backgroundColor: getStatusBackgroundColor(status),
                      }}
                    >
                      {status}{" "}
                      {showChild
                        ? child.filter(
                            (childIssue) => childIssue.status === status
                          ).length
                        : issues.filter(
                            (issue) =>
                              issue.sprintIsActive && issue.status === status
                          ).length}
                      {` ISSUE${getPluralEnd(issues).toUpperCase()}`}
                    </h2>
                  </div>
                </>
              );
            })}
          </div>
          {/* ISSUES - REPEAT */}
          <div className="mt-0 flex w-full max-w-full flex-col">
            {filterIssues(issues, null).map((issue, index) => {
              let childIssues = [];
              if (hasChildren(issue)) {
                childIssues = issue.children;
              }
              return (
                <>
                  <div
                    onClick={() => setIssueKey(issue.key)}
                    className="flex cursor-pointer items-center gap-x-4 border-x-2  border-y bg-slate-50 px-2 py-2 dark:border-darkSprint-20 dark:bg-darkSprint-30"
                  >
                    <IssueIcon issueType={issue.type} />
                    <span className="text-xs font-medium text-gray-600 dark:text-dark-50">
                      {issue.key}
                    </span>
                    <span className="dark:text-dark-50">{issue.name}</span>
                    <span className="dark:text-dark-50">
                      ({issue.children.length} Subtask)
                    </span>
                    <span className="rounded-xl bg-slate-300 px-3 text-sm">
                      Parent
                    </span>
                  </div>
                  <DragDropContext
                    key={index + 1}
                    onDragEnd={(result: DropResult) =>
                      onDragEnd(result, childIssues)
                    }
                  >
                    <div
                      ref={renderContainerRef}
                      className="relative flex w-full  max-w-full gap-x-4 overflow-y-auto"
                    >
                      {STATUSES.map((status) => (
                        <div
                          className={clsx(
                            " h-max min-h-fit w-[350px] rounded-xl border-x-2 border-b-2 px-1.5 pb-3 dark:border-darkSprint-30 dark:bg-darkSprint-20"
                          )}
                          key={status}
                        >
                          <IssueList
                            parentId={issue.id}
                            sprintId={activeSprintId}
                            key={`${issue.id}-${status}`}
                            status={status}
                            issues={childIssues?.filter(
                              (childIssue) => childIssue.status === status
                            )}
                            showChild={showChild}
                          />
                        </div>
                      ))}
                    </div>
                  </DragDropContext>
                </>
              );
            })}
          </div>
        </div>
      )}
      {/* PARENT ISSUE VIEW  */}
      {!showChild && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            ref={renderContainerRef}
            className="custom-scrollbar relative flex h-[68vh] max-w-full gap-x-4 overflow-y-scroll "
          >
            {STATUSES.map((status) => (
              <IssueList
                statusColors={statusColors}
                sprintId={activeSprintId}
                key={status}
                status={status}
                issues={filterIssues(issues, status)}
                showChild={showChild}
              />
            ))}
          </div>
        </DragDropContext>
      )}
    </Fragment>
  );
};

type IssueListPositionProps = {
  activeIssues: IssueType[];
  destination: DraggableLocation;
  source: DraggableLocation;
  droppedIssueId: string;
};

function calculateIssueBoardPosition(props: IssueListPositionProps) {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(props);
  let position: number;

  if (isNullish(prevIssue) && isNullish(nextIssue)) {
    position = 1;
  } else if (isNullish(prevIssue) && nextIssue) {
    position = nextIssue.boardPosition - 1;
  } else if (isNullish(nextIssue) && prevIssue) {
    position = prevIssue.boardPosition + 1;
  } else if (prevIssue && nextIssue) {
    position =
      prevIssue.boardPosition +
      (nextIssue.boardPosition - prevIssue.boardPosition) / 2;
  } else {
    throw new Error("Invalid position");
  }
  return position;
}

function getAfterDropPrevNextIssue(props: IssueListPositionProps) {
  const { activeIssues, destination, source, droppedIssueId } = props;
  const beforeDropDestinationIssues = getSortedBoardIssues({
    activeIssues,
    status: destination.droppableId as string,
  });
  const droppedIssue = activeIssues.find(
    (issue) => issue.id === droppedIssueId
  );

  if (!droppedIssue) {
    throw new Error("dropped issue not found");
  }
  const isSameList = destination.droppableId === source.droppableId;

  const afterDropDestinationIssues = isSameList
    ? moveItemWithinArray(
        beforeDropDestinationIssues,
        droppedIssue,
        destination.index
      )
    : insertItemIntoArray(
        beforeDropDestinationIssues,
        droppedIssue,
        destination.index
      );

  return {
    prevIssue: afterDropDestinationIssues[destination.index - 1],
    nextIssue: afterDropDestinationIssues[destination.index + 1],
  };
}

function getSortedBoardIssues({
  activeIssues,
  status,
}: {
  activeIssues: IssueType[];
  status: string;
}) {
  return activeIssues
    .filter((issue) => issue.status === status)
    .sort((a, b) => a.boardPosition - b.boardPosition);
}

export { Board };
