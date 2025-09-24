"use client";
import React, { useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue/issue-icon";
import { Button } from "../ui/button";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { ChildrenTreeIcon } from "../svgs";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { ContextTrigger } from "../ui/context-menu";
import { IssueContextMenu, IssueDropdownMenu } from "../issue/issue-menu";
import { IssueSelectStatus } from "../issue/issue-select-status";
import { MdEdit } from "react-icons/md";
import { IssueTitle } from "../issue/issue-title";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { type IssueType } from "@/utils/types";
import { hasChildren, isEpic, hexToRgba } from "@/utils/helpers";
import { IssueAssigneeSelect } from "../issue/issue-select-assignee";
import { DARK_COLORS, LIGHT_COLORS } from "../color-picker";
import { useCookie } from "@/hooks/use-cookie";
import { OriginalEstimate } from "../original-estimate";
import { IssueSelectType } from "../issue/issue-select-type";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { toast } from "../toast";

const getIssueKeyColorClass = (type: String) => {
  switch (type) {
    case "TASK":
      return "bg-task";
    case "STORY":
      return "bg-story";
    case "BUG":
      return "bg-bug";
    case "EPIC":
      return "bg-epic";
    case "SUBTASK":
      return "bg-task";
    default:
      return "bg-gray-200";
  }
};

const Issue: React.FC<{
  issue: IssueType;
  index: number;
  onChecked: boolean;
  onHandleCheck: () => void;
}> = ({ index, issue, onHandleCheck, onChecked }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEstimate, setIsEditingEstimate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setIssueKey, issueKey } = useSelectedIssueContext();
  const issueKeyColorClass = getIssueKeyColorClass(issue.type);
  const user = useCookie("user");
  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "manager");
  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleSelectType(type: IssueType["type"]) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateIssue(
      {
        issueId: issue.id,
        type,
      },
      {
        onSuccess: (data) => {
          toast.success({
            message: `Issue type updated to ${data.type}`,
            description: "Issue type changed",
          });
        },
      }
    );
  }

  return (
    <Draggable draggableId={issue.id} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          data-state={issueKey == issue.key ? "selected" : "not-selected"}
          onClick={() => setIssueKey(issue.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            onChecked
              ? "bg-gray-200 dark:bg-darkButton-20"
              : isDragging
              ? "rounded-xl border-[0.3px] border-gray-300 bg-transparent"
              : "border-[0.3px] border-slate-200 bg-slate-50 dark:border-darkButton-0 dark:bg-darkButton-30",
            "group flex w-full max-w-full  items-center justify-between rounded-xl   px-3 py-1.5 text-sm hover:bg-gray-300 [&[data-state=selected]]:bg-transparent dark:[&[data-state=selected]]:bg-darkButton-20",
            // Add Tailwind classes for border-bottom
            "border-b-[0.3px]", // Border width
            isDragging
              ? "border-b-gray-300"
              : "border-b-slate-200 dark:border-b-darkButton-0"
          )}
        >
          {isAdminOrManager && (
            <input
              type="checkbox"
              checked={onChecked}
              onClick={(e) => e.stopPropagation()} // Prevent parent click event from triggering
              onChange={(e) => {
                e.stopPropagation(); // Prevent click event from propagating on checkbox change
                onHandleCheck();
              }}
              className="form-checkbox mr-3 h-3 w-3 rounded-sm"
            />
          )}
          <div
            data-state={isEditing ? "editing" : "not-editing"}
            className="flex w-fit items-center gap-x-2 rounded-xl [&[data-state=editing]]:w-full [&[data-state=not-editing]]:overflow-x-hidden"
          >
            <IssueSelectType
              key={issue.id + issue.type}
              currentType={issue.type}
              onSelect={handleSelectType}
            />
            <div
              data-state={issue.status}
              className={clsx(
                "whitespace-nowrap rounded-xl px-2 py-0.5 text-white",
                issueKeyColorClass
              )}
            >
              {issue.key}
            </div>

            <IssueTitle
              key={issue.id + issue.name}
              className="truncate py-1.5 hover:cursor-pointer hover:underline dark:text-white"
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              issue={issue}
              useTooltip={true}
              ref={inputRef}
            />

            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="flex items-center gap-x-1 [&[data-state=editing]]:hidden"
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
                className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 dark:text-dark-50 dark:group-hover:hover:bg-darkSprint-20 "
              >
                <MdEdit className="text-sm" />
              </Button>
              {isEpic(issue.parent) ? <EpicName issue={issue.parent} /> : null}
            </div>
          </div>
          <IssueContextMenu isEditing={isEditing} className="flex-auto">
            <ContextTrigger className="h-8 w-full" />
          </IssueContextMenu>
          <div className="relative ml-2 flex min-w-fit items-center justify-end gap-x-6">
            <div className="flex w-32 items-center justify-end gap-x-2">
              {hasChildren(issue) ? (
                <ChildrenTreeIcon className="p-0.5 text-gray-600 dark:text-dark-50" />
              ) : null}
              <IssueSelectStatus
                key={issue.id + issue.status}
                currentStatus={issue.status}
                issueId={issue.id}
              />
            </div>
            <div
              className="flex w-20 items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onBlur={() => setIsEditingEstimate(false)}
            >
              <OriginalEstimate
                setIsEditing={setIsEditingEstimate}
                isEditing={isEditingEstimate}
                page="backlog"
                issue={issue}
                className="rounded-xl bg-gray-300 px-2 dark:bg-darkSprint-20  dark:text-dark-50"
              />
            </div>
            <div className="flex w-20 items-center justify-end gap-x-2">
              <IssueAssigneeSelect issue={issue} avatarOnly />
              {(user?.role === "admin" || user?.role === "manager") && (
                <IssueDropdownMenu issue={issue}>
                  <DropdownTrigger
                    asChild
                    className=" flex items-center gap-x-2 bg-opacity-30 px-1.5 text-xs font-semibold  "
                  >
                    <div className="invisible !rounded-full !bg-gray-300 p-1.5 group-hover:visible group-hover:bg-gray-300  group-hover:hover:bg-gray-300 dark:!bg-transparent dark:group-hover:!bg-darkSprint-40 [&[data-state=open]]:visible [&[data-state=open]]:bg-gray-300">
                      <BsThreeDots className="text-black dark:!text-dark-50 sm:text-xl" />
                    </div>
                  </DropdownTrigger>
                </IssueDropdownMenu>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export const EpicName: React.FC<{
  issue: IssueType["parent"];
  className?: string;
}> = ({ issue, className }) => {
  const lightColor = LIGHT_COLORS.find(
    (color) => color.hex == issue.sprintColor
  );
  const bgColor = hexToRgba(issue.sprintColor, !!lightColor ? 0.5 : 1);

  function calcTextColor() {
    if (lightColor) {
      return DARK_COLORS.find((color) => color.label == lightColor.label)?.hex;
    } else {
      return "white";
    }
  }

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: calcTextColor(),
      }}
      className={clsx(
        "whitespace-nowrap rounded-xl px-2 py-[2px] text-xs font-bold",
        className
      )}
    >
      {issue.name.toUpperCase()}
    </div>
  );
};

export { Issue };
