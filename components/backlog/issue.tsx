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
}> = ({ index, issue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setIssueKey, issueKey } = useSelectedIssueContext();
  const issueKeyColorClass = getIssueKeyColorClass(issue.type);

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
            isDragging
              ? "border-[0.3px] border-gray-300 rounded-xl bg-gray-100"
              : "bg-slate-50 border-[0.3px] border-slate-200",
            "group flex w-full max-w-full items-center rounded-xl justify-between   px-3 py-1.5 text-sm hover:bg-gray-300 [&[data-state=selected]]:bg-gray-300"
          )}
          style={{
            borderBottomWidth: "0.3px", // Ensuring the bottom border is visible
            borderBottomColor: isDragging ? "rgb(209 213 219)" : "rgb(226 232 240)", // Color matches the side borders
          }}
        >
          <div
            data-state={isEditing ? "editing" : "not-editing"}
            className="flex w-fit rounded-xl items-center gap-x-2 [&[data-state=editing]]:w-full [&[data-state=not-editing]]:overflow-x-hidden"
          >
            <IssueIcon issueType={issue.type}/>
            <div
              data-state={issue.status}
              className={clsx(
                "whitespace-nowrap text-white px-2 py-0.5 rounded-xl",
                issueKeyColorClass
              )}
            >
              {issue.key}
            </div>

            <IssueTitle
              key={issue.id + issue.name}
              className="truncate py-1.5 hover:cursor-pointer hover:underline"
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
                className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 "
              >
                <MdEdit className="text-sm" />
              </Button>
              {isEpic(issue.parent) ? <EpicName issue={issue.parent} /> : null}
            </div>
          </div>
          <IssueContextMenu isEditing={isEditing} className="flex-auto">
            <ContextTrigger className="h-8 w-full" />
          </IssueContextMenu>
          <div className="relative ml-2 flex min-w-fit items-center justify-end gap-x-2">
            {hasChildren(issue) ? (
              <ChildrenTreeIcon className="p-0.5 text-gray-600" />
            ) : null}
            <IssueSelectStatus
              key={issue.id + issue.status}
              currentStatus={issue.status}
              issueId={issue.id}
            />
            <IssueAssigneeSelect issue={issue} avatarOnly />
            <IssueDropdownMenu issue={issue}>
              <DropdownTrigger
                asChild
                className=" flex items-center gap-x-2 bg-opacity-30 px-1.5 text-xs font-semibold  "
              >
                <div className="invisible !rounded-full px-1.5 py-1.5 !bg-gray-300 group-hover:visible group-hover:bg-gray-300 group-hover:hover:bg-gray-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-gray-300">
                  <BsThreeDots className="sm:text-xl text-black" />
                </div>
              </DropdownTrigger>
            </IssueDropdownMenu>
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
