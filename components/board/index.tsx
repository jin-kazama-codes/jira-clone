"use client";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { type Sprint, type IssueStatus, type Project } from "@prisma/client";
// import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import clsx from "clsx";
import { useIssues } from "@/hooks/query-hooks/useIssues";
import { useSprints } from "@/hooks/query-hooks/useSprints";
import { type IssueType } from "@/utils/types";
import { useStrictModeDroppable } from "@/hooks/useStrictModeDroppable";

const STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const Board: React.FC<{
  project: Project;
}> = ({ project }) => {
  // const { issueId, setIssueId } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const { issues } = useIssues();
  const { sprints } = useSprints();

  function filterIssuesBySprintAndStatus({
    issue,
    sprints,
    status,
  }: {
    issue: IssueType;
    sprints: Sprint[];
    status: IssueStatus;
  }) {
    const sprint = sprints.find((sprint) => sprint.id == issue.sprintId);
    if (!sprint) return false;
    return issue.status == status && sprint.status == "ACTIVE";
  }

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  const [droppableEnabled] = useStrictModeDroppable();

  if (!droppableEnabled) {
    return null;
  }

  if (!issues || !sprints) {
    return <div />;
  }

  function onDragEnd() {
    console.log("drag end");
  }

  return (
    <div>
      <BoardHeader project={project} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex min-h-full w-full max-w-full gap-x-4 overflow-y-auto">
          {STATUSES.map((status) => (
            <div key={status} className="w-[300px]">
              <h2 className="text-xs text-gray-400">
                {status}{" "}
                {issues.filter((issue) => issue.status == status).length}
              </h2>
              <Column
                status={status}
                issues={issues.filter((issue) =>
                  filterIssuesBySprintAndStatus({ issue, status, sprints })
                )}
              />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const Column: React.FC<{ status: string; issues: IssueType[] }> = ({
  status,
  issues,
}) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) return null;

  return (
    <Droppable droppableId={status}>
      {({ droppableProps, innerRef, placeholder }) => (
        <div
          {...droppableProps}
          ref={innerRef}
          className={clsx(issues.length == 0 && "min-h-[1px]")}
        >
          <Fragment>
            {issues
              .sort((a, b) => a.listPosition - b.listPosition)
              .map((issue, index) => (
                <Issue key={issue.key} index={index} issue={issue} />
              ))}
          </Fragment>
          {placeholder}
        </div>
      )}
    </Droppable>
  );
};

const Issue: React.FC<{ issue: IssueType; index: number }> = ({
  issue,
  index,
}) => {
  return (
    <Draggable draggableId={issue.key} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          // data-state={issueId == issue.key ? "selected" : "not-selected"}
          // onClick={() => setIssueId(issue.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            isDragging ? "bg-blue-100" : "bg-white",
            "group flex w-full max-w-full items-center justify-between border-[0.3px] border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 [&[data-state=selected]]:bg-blue-100"
          )}
        >
          {issue.name}
        </div>
      )}
    </Draggable>
  );
};

export { Board };