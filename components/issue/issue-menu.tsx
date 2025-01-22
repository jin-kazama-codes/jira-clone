import { useEffect, useState, type ReactNode } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { type IssueType } from "@/utils/types";
import { type MenuOptionType } from "@/utils/types";
import clsx from "clsx";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
} from "@/components/ui/dropdown-menu";
import {
  Context,
  ContextContent,
  ContextGroup,
  ContextItem,
  ContextLabel,
  ContextPortal,
} from "@/components/ui/context-menu";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useSprints } from "@/hooks/query-hooks/use-sprints";

type MenuOptionsType = {
  actions: MenuOptionType[];
};

const menuOptions: MenuOptionsType = {
  actions: [
    // ONLY DELETE IS IMPLEMENTED
    // { id: "add-flag", label: "Add Flag" },
    // { id: "change-parent", label: "Change Parent" },
    // { id: "copy-issue-link", label: "Copy Issue Link" },
    // { id: "split-issue", label: "Split Issue" },
    { id: "delete", label: "Delete" },
  ],
};

const IssueDropdownMenu: React.FC<{
  children: ReactNode;
  issue: IssueType;
}> = ({ children, issue }) => {
  const { deleteIssue, updateIssue } = useIssues();
  const { sprints } = useSprints();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined);
  let backlogObj;

  if (issue.sprintId) {
    backlogObj = {
      id: null,
      name: "Backlog",
      key: "backlog",
    };
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const isBacklogPage = currentPath === "/backlog";

  const handleIssueAction = (
    id: MenuOptionType["id"],
    e: React.SyntheticEvent,
    sprintId?: string
  ) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (id == "delete") {
      deleteIssue({ issueId: issue.id });
    }
    if (id == "move-to") {
      const storedIssues = JSON.parse(
        localStorage.getItem("Selected Issue") || "[]"
      );
      if (storedIssues.length) {
        storedIssues?.forEach((id: string) => {
          updateIssue({
            issueId: id,
            sprintId,
          });
        });
      } else {
        // when only a single issue is moved to another sprint
        updateIssue({
          issueId: issue.id,
          sprintId,
        });
      }
      localStorage.removeItem("Selected Issue");
    }
  };

  return (
    <Dropdown>
      {children}
      <DropdownPortal>
        <DropdownContent
          side="top"
          sideOffset={5}
          align="end"
          className="z-50 w-fit min-w-[100px] rounded-md border dark:bg-darkSprint-20 dark:border-darkSprint-30 border-gray-300 bg-white pt-2 shadow-md"
        >
          <DropdownLabel className="p-2 text-xs font-normal dark:text-darkButton-50 text-gray-400">
            ACTIONS
          </DropdownLabel>
          <DropdownGroup>
            {menuOptions.actions.map((action) => (
              <DropdownItem
                onClick={(e) => handleIssueAction(action.id, e)}
                key={action.id}
                textValue={action.label}
                className={clsx(
                  "border-transparent p-2 text-sm hover:cursor-default dark:hover:bg-darkSprint-30 dark:hover:text-white hover:bg-gray-100"
                )}
              >
                <span className={clsx("pr-2 text-sm dark:text-dark-50 ")}>{action.label}</span>
              </DropdownItem>
            ))}
          </DropdownGroup>
          {/* TODO: Implement "move to" actions */}
          {isBacklogPage && (
            <>
              <DropdownLabel className="p-2 text-xs font-normal text-gray-400">
                MOVE TO
              </DropdownLabel>
              <DropdownGroup>
                {[
                  ...(sprints?.filter(
                    (sprint) => sprint.id !== issue.sprintId
                  ) ?? []),
                  backlogObj && issue.sprintId !== null ? backlogObj : null,
                ]
                  .filter(Boolean)
                  .map((sprint) => {
                    // if (!sprint?.id) return;
                    return (
                      <DropdownItem
                        onClick={(e) =>
                          handleIssueAction("move-to", e, sprint.id)
                        }
                        key={sprint.id}
                        textValue={sprint.name}
                        className={clsx(
                          "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
                        )}
                      >
                        <span className={clsx("pr-2 text-sm")}>
                          {sprint.name}
                        </span>
                      </DropdownItem>
                    );
                  })}
              </DropdownGroup>
            </>
          )}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};
const IssueContextMenu: React.FC<{
  children: ReactNode;
  isEditing: boolean;
  className?: string;
}> = ({ children, isEditing, className }) => {
  return (
    <div
      data-state={isEditing ? "editing" : "not-editing"}
      className={clsx("flex [&[data-state=editing]]:hidden", className)}
    >
      <Context>
        {children}
        <ContextPortal>
          <ContextContent className="w-fit min-w-[100px] rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <ContextLabel className="p-2 text-xs font-normal text-gray-400">
              ACTIONS
            </ContextLabel>
            <ContextGroup>
              {menuOptions.actions.map((action) => (
                <ContextItem
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
                  )}
                >
                  <span className={clsx("pr-2 text-sm")}>{action.label}</span>
                </ContextItem>
              ))}
            </ContextGroup>
          </ContextContent>
        </ContextPortal>
      </Context>
    </div>
  );
};

export { IssueDropdownMenu, IssueContextMenu };
