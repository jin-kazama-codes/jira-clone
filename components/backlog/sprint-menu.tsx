"use client";
import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
} from "@/components/ui/dropdown-menu";
import { type MenuOptionType } from "@/utils/types";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { previousSprint } from "@/server/functions";
import { useCookie } from "@/hooks/use-cookie";
import { prisma } from "@/server/db";

type SprintDropdownMenuProps = {
  children: ReactNode;
  sprint;
  setUpdateModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SprintDropdownMenu: React.FC<SprintDropdownMenuProps> = ({
  children,
  sprint,
  setUpdateModalIsOpen,
  setDeleteModalIsOpen,
}) => {
  const { updateSprint } = useSprints();

  const menuOptions: MenuOptionType[] = [
    { id: "edit", label: "Edit Sprint" },
    { id: "delete", label: "Delete Sprint" },
    { id: "up", label: "Move Sprint Up" },
    { id: "down", label: "Move Sprint Down" },
  ];

  const previousSprint = async(
    position: number
  ) => {
    const response = await fetch(`/api/sprints?position=${position}`);

    const data = await response.json();
    console.log("RESPONSE", data)
  
    return data.sprints[0].id;
  }

  const handleMove = async (sprint, direction: "up" | "down") => {
    // const projectId = useCookie("project").id;
    const currentSprintId = sprint.id;
    const currentSprintPosition = sprint.sprintPosition;
    const previousSprintPosition =
      direction === "up"
        ? currentSprintPosition - 1
        : currentSprintPosition + 1;

    const previousSprintId = await previousSprint(previousSprintPosition);

    // Swap positions
    updateSprint({
      sprintId: currentSprintId,
      sprintPosition: previousSprintPosition,
    });
    updateSprint({
      sprintId: previousSprintId,
      sprintPosition: currentSprintPosition,
    });
  };

  const handleSprintAction = (
    id: MenuOptionType["id"],
    e: React.SyntheticEvent
  ) => {
    e.stopPropagation();
    if (id == "delete") {
      setDeleteModalIsOpen(true);
    } else if (id == "edit") {
      setUpdateModalIsOpen(true);
    } else if (id === "up") {
      handleMove(sprint, "up");
    } else if (id === "down") {
      handleMove(sprint, "down");
    }
  };

  return (
    <div>
      <Dropdown modal={false}>
        {children}
        <DropdownPortal>
          <DropdownContent
            side="top"
            sideOffset={5}
            align="end"
            className="z-10 w-fit rounded-md border border-gray-300 bg-white shadow-md"
          >
            <DropdownLabel className="sr-only">ACTIONS</DropdownLabel>
            <DropdownGroup>
              {menuOptions.map((action) => (
                <DropdownItem
                  onClick={(e) => handleSprintAction(action.id, e)}
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent px-4 py-2 text-sm hover:cursor-default hover:bg-gray-100"
                  )}
                >
                  <span className={clsx("pr-2 text-sm")}>{action.label}</span>
                </DropdownItem>
              ))}
            </DropdownGroup>
          </DropdownContent>
        </DropdownPortal>
      </Dropdown>
    </div>
  );
};

SprintDropdownMenu.displayName = "SprintDropdownMenu";

export { SprintDropdownMenu };
