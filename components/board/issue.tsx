import { type IssueType } from "@/utils/types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue/issue-icon";
import { Avatar } from "../avatar";
import { IssueDropdownMenu } from "../issue/issue-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { isEpic } from "@/utils/helpers";
import { EpicName } from "../backlog/issue";

import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { useCookie } from "@/hooks/use-cookie";

const Issue: React.FC<{ issue: IssueType; index: number }> = ({
  issue,
  index,
}) => {
  const { setIssueKey } = useSelectedIssueContext();
  const user = useCookie('user');

  return (
    <Draggable draggableId={issue.id} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          onClick={() => setIssueKey(issue.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            isDragging && "bg-white z-auto",
            "group my-2 max-w-full dark:border-darkButton-0 dark:bg-darkButton-30 rounded-xl bg-slate-50 border-[0.2px] border-slate-200  p-2 text-sm shadow-sm dark:shadow-none shadow-gray-300 hover:bg-gray-200 "
          )}
        >
          <div className="flex items-start justify-between">
            <span className="mb-2 dark:text-dark-50" >{issue.name}</span>
            {(user?.role === "admin" ||
              user?.role === "manager") &&
              <IssueDropdownMenu issue={issue}>
                <DropdownTrigger
                  asChild
                  className="rounded-m flex h-fit items-center gap-x-2 bg-opacity-30 px-1.5 text-xs font-semibold focus:ring-2"
                >
                  <div className="invisible rounded-full px-1.5 py-1.5 text-gray-700 group-hover:visible group-hover:bg-slate-100 dark:group-hover:!bg-darkSprint-40 group-hover:hover:bg-slate-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-slate-700 [&[data-state=open]]:text-white">
                    <BsThreeDots className="sm:text-xl text-black" />
                  </div>
                </DropdownTrigger>
              </IssueDropdownMenu>
            }
          </div>
          <div className="w-fit">
            {isEpic(issue.parent) ? (
              <EpicName issue={issue.parent} className="py-0.5 text-sm" />
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <IssueIcon issueType={issue.type} />
              <span className="text-xs font-medium text-gray-600 dark:text-dark-50">
                {issue.key}
              </span>
            </div>
            <Avatar
              size={20}
              src={issue.assignee?.avatar}
              alt={issue.assignee?.name ?? "Unassigned"}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export { Issue };
