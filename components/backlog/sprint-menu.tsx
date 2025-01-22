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
  const [sprints, setSprints] = useState<any[]>([]);


  const queryClient = useQueryClient(); 

  const { updateSprint } = useSprints();

  const sprintData = queryClient.getQueryData(["sprints"]) ?? [];

  useEffect(() => {
    if (sprintData?.pages) {
      setSprints(sprintData?.pages.flatMap((page) => page.sprints));
    }
  }, [sprintData]);


  const menuOptions = useMemo<MenuOptionType[]>(() => {
    const options = [
      { id: "edit", label: "Edit Sprint" },
      { id: "delete", label: "Delete Sprint" },
    ];
    const currentSprintIndex = sprints?.findIndex(s => s.id === sprint.id);

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
    const currentIndex = sprints.findIndex(
      (s) => s.position === sprint.position
    );
    const targetIndex =
      placement === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < sprints.length) {
      const targetSprint = sprints[targetIndex];

      // Swap positions between current sprint and target sprint
      updateSprint({ sprintId: sprint.id, position: targetSprint.position });
      updateSprint({ sprintId: targetSprint.id, position: sprint.position });
    }
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
      console.log("pos")
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
            className="z-10 w-fit rounded-md border dark:bg-darkSprint-20 dark:text-dark-50  dark:border-darkSprint-30 border-gray-300 bg-white shadow-md"
          >
            <DropdownLabel className="sr-only">ACTIONS</DropdownLabel>
            <DropdownGroup>
              {menuOptions.map((action) => (
                <DropdownItem
                  onClick={(e) => handleSprintAction(action.id, e)}
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent px-4 py-2 text-sm hover:cursor-default dark:hover:text-white dark:hover:bg-darkSprint-30 hover:bg-gray-100"
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
