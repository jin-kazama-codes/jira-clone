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
}> = ({ sprintId, status, issues, showChild, parentId }) => {
  const [droppableEnabled] = useStrictModeDroppable();
  const { createIssue, isCreating } = useIssues();
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  if (!droppableEnabled) {
    return null;
  }

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
              className=" h-fit min-h-[10px] py-2"
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
          className="my-1 flex w-full rounded-xl bg-transparent hover:bg-gray-200 [&[data-state=closed]]:hidden"
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
              "mb-5 sticky top-0 min-h-fit h-max w-[350px] rounded-xl border-x-2 border-b-2 px-1.5 pb-3",
              status === "To Do"
                ? "bg-gray-100"
                : status === "In Progress"
                  ? "bg-blue-100"
                  : "bg-green-100"
            )}
          >
            <h2
              className={clsx(
                "text-md sticky top-0 -mx-1.5 -mt-1.5 mb-1.5 rounded-t-md border-y-2 px-2 py-3 font-semibold text-black z-10",
                status === "To Do"
                  ? "bg-gray-300"
                  : status === "In Progress"
                    ? "bg-blue-300"
                    : "bg-green-300"
              )}
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
