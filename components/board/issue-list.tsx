import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { type IssueType } from "@/utils/types";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import clsx from "clsx";
import { statusMap } from "../issue/issue-select-status";
import { type IssueStatus } from "@prisma/client";
import { getPluralEnd } from "@/utils/helpers";
import { EmtpyIssue } from "../issue/issue-empty";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../ui/button";
import { useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const IssueList: React.FC<{ sprintId: string | null; status: IssueStatus; issues: IssueType[] }> = ({
  sprintId,
  status,
  issues,
}) => {
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

    createIssue(
      {
        name,
        type,
        parentId: null,
        sprintId,
        reporterId: null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }

  return (
    <div
      className={clsx(
        "mb-5 h-max min-h-fit w-[350px] rounded-xl  px-1.5  pb-3 border-x-2 border-b-2 "
      )}
    >
      <h2 className="sticky top-[0.5px] -mx-1.5 -mt-1.5 mb-1.5 bg-white border-y-2 rounded-t-md px-2 py-3 text-md font-semibold text-gray-500">
        {statusMap[status]}{" "}
        {issues.filter((issue) => issue.status == status).length}
        {` ISSUE${getPluralEnd(issues).toUpperCase()}`}
      </h2>

      <Droppable droppableId={status}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className=" h-fit min-h-[10px] py-2"
          >
            {issues
              .sort((a, b) => a.boardPosition - b.boardPosition)
              .map((issue, index) => (
                <Issue key={issue.id} index={index} issue={issue} />
              ))}
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
    </div>
  );
};

export { IssueList };
