import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { type IssueType } from "@/utils/types";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import clsx from "clsx";
import { getPluralEnd, hasChildren } from "@/utils/helpers";
import { EmtpyIssue } from "../issue/issue-empty";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../ui/button";
import { useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const IssueList: React.FC<{
  sprintId: string | null;
  status: string;
  issues: IssueType[];
  statusColors?: any
}> = ({ sprintId, status, issues, showChild, parentId, statusColors }) => {
  const [droppableEnabled] = useStrictModeDroppable();
  const { createIssue, isCreating } = useIssues(sprintId);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  if (!droppableEnabled) {
    return null;
  }


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

  function handleCreateIssue({
    name,
    type,
  }: {
    name: string;
    type: IssueType["type"];
  }) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!name) {
      return;
    }

    const issueParentId = showChild ? parentId : null
    const newSprintId = showChild ? null : sprintId

    createIssue(
      {
        name,
        type,
        status,
        parentId: issueParentId,
        sprintId: newSprintId,
        reporterId: null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }



  const getDroppable = () => {
    return (
      <>
        <Droppable droppableId={status}>
          {({ droppableProps, innerRef, placeholder }) => (
            <div
              {...droppableProps}
              ref={innerRef}
              className=" h-fit min-h-[10px] z-30 py-2"
            >
              {issues
                .sort((a, b) => a.boardPosition - b.boardPosition)
                .map((child, index) => {
                  return <Issue key={child.id} index={index} issue={child} />;
                })}
              {placeholder}
            </div>
          )}
        </Droppable>
        <Button
          onClick={() => setIsEditing(true)}
          data-state={isEditing ? "closed" : "open"}
          customColors
          className="my-1 flex w-full rounded-xl bg-transparent dark:text-dark-50 dark:hover:bg-darkSprint-40 dark:hover:text-white hover:bg-gray-200 [&[data-state=closed]]:hidden"
        >
          <AiOutlinePlus className="text-sm" />
          <span className="text-md ml-1">Create Issue</span>
        </Button>
        <EmtpyIssue
          data-state={isEditing ? "open" : "closed"}
          className="[&[data-state=closed]]:hidden"
          onCreate={({ name, type }) => handleCreateIssue({ name, type })}
          onCancel={() => setIsEditing(false)}
          isCreating={isCreating}
        />
      </>
    );
  };

  return (
    <>
      {!showChild && (
        <>
          <div
            className={clsx(
              "mb-5 sticky top-0 min-h-fit h-max w-[350px] rounded-xl dark:border-darkSprint-30 dark:bg-darkSprint-20 border-x-2 border-b-2 px-1.5 pb-3",
              
            )}
          >
            <h2
              className={clsx(
                "text-md sticky top-0 -mx-1.5 -mt-1.5 mb-1.5 rounded-t-md dark:border-y-darkSprint-30  border-y-2 px-2 py-3 font-semibold text-black z-10",
                
              )}
              style={{ backgroundColor: getStatusBackgroundColor(status) }}
            >
              {status}{" "}
              {issues.filter((issue) => issue.status == status).length}
              {` ISSUE${getPluralEnd(issues).toUpperCase()}`}
            </h2>

            {getDroppable()}
          </div>
        </>
      )}
      {showChild && getDroppable()}
    </>
  );
};

export { IssueList };
