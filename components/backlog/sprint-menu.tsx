"use client";
import React, { type ReactNode, useEffect, useMemo, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type SprintDropdownMenuProps = {
  children: ReactNode;
  sprint: any;
  setUpdateModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SprintDropdownMenu: React.FC<SprintDropdownMenuProps> = ({
  children,
  sprint,
  setUpdateModalIsOpen,
  setDeleteModalIsOpen,
}) => {
  const [sprints, setSprints] = useState<any[]>([]);

  const queryClient = useQueryClient();

  const { updateSprint } = useSprints();

  const sprintData = queryClient.getQueryData(["sprints"]) ?? [];

  useEffect(() => {
    if (sprintData?.pages) {
      const fetchedSprints = sprintData?.pages?.flatMap((page) => page.sprints);
      const sortedSprints = [...fetchedSprints].sort(
        (a, b) => a.position - b.position
      );

      setSprints(sortedSprints);
    }
  }, [sprintData]);

  const menuOptions = useMemo<MenuOptionType[]>(() => {
    const options = [
      { id: "edit", label: "Edit Sprint" },
      { id: "delete", label: "Delete Sprint" },
    ];
    const currentSprintIndex = sprints?.findIndex((s) => s.id === sprint.id);

    // Determine menu options based on sprint's position in the sorted array
    if (currentSprintIndex === 0) {
      // Sprint is at the top, only allow moving down
      options.push({ id: "down", label: "Move Sprint Down" });
    } else if (currentSprintIndex === sprints?.length - 1) {
      options.push({ id: "up", label: "Move Sprint Up" });
    } else {
      options.push({ id: "up", label: "Move Sprint Up" });
      options.push({ id: "down", label: "Move Sprint Down" });
    }

    return options;
  }, [sprint.id, sprints]);

  const handlePositionChange = (placement: "up" | "down") => {
    // Find the index of the current sprint.
    const currentIndex = sprints.findIndex((s) => s.id === sprint.id);

    // Determine the target sprint based on the direction.
    let targetIndex;
    if (placement === "up" && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (placement === "down" && currentIndex < sprints.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      // If no valid move exists (e.g., at the top or bottom), exit early.
      return;
    }

    const currentSprint = sprint;
    const targetSprint = sprints[targetIndex];


    updateSprint(
      { sprintId: currentSprint.id, position: targetSprint.position },
      {
        onSuccess: () => {
          console.log("First update successful");
          return updateSprint(
            {
              sprintId: targetSprint.id,
              position: currentSprint.position,
            },
            {
              onSuccess: () => {
                toast.success(`Moved ${sprint.name} ${placement} successfully`)
              },
              onError: (error) => {
                toast.success(`Error moving ${sprint.name} ${placement}`)
              },
            }
          );
        },
        onError: (error) => {
          console.log("Error in first update:", error);
        },
      }
    );
  };

  const handleSprintAction = (
    id: MenuOptionType["id"],
    e: React.SyntheticEvent
  ) => {
    e.stopPropagation();
    if (id === "delete") {
      setDeleteModalIsOpen(true);
    } else if (id === "edit") {
      setUpdateModalIsOpen(true);
    } else if (id === "up" || id === "down") {
      handlePositionChange(id);
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
            className="z-10 w-fit rounded-md border border-gray-300 bg-white  shadow-md dark:border-darkSprint-30 dark:bg-darkSprint-20 dark:text-dark-50"
          >
            <DropdownLabel className="sr-only">ACTIONS</DropdownLabel>
            <DropdownGroup>
              {menuOptions.map((action) => (
                <DropdownItem
                  onClick={(e) => handleSprintAction(action.id, e)}
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent px-4 py-2 text-sm hover:cursor-default hover:bg-gray-100 dark:hover:bg-darkSprint-30 dark:hover:text-white"
                  )}
                >
                  <span className="pr-2 text-sm">{action.label}</span>
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
