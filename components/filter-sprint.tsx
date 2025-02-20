import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { useFiltersContext } from "@/context/use-filters-context";
import { Button } from "@/components/ui/button";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { type Sprint } from "@prisma/client";
const SprintFilter: React.FC = () => {
  const { sprints: filterSprints, setSprints } = useFiltersContext();
  const { sprints } = useSprints();

  function filterActiveSprints(sprint: Sprint) {
    return sprint.status === "ACTIVE";
  }
  function onSelectChange(sprint: Sprint) {
    // If the sprint is already selected, deselect it
    if (filterSprints.includes(sprint.id)) {
      setSprints([]);  // Deselect the sprint
    } else {
      setSprints([sprint.id]);  // Select the clicked sprint
    }
  }
  return (
    <Dropdown>
      <DropdownTrigger className="rounded-xl border-2 border-gray-300 bg-gray-50 px-2 transition-all duration-200 hover:bg-gray-200 dark:border-darkSprint-30 dark:bg-darkSprint-20 dark:text-dark-50 [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button customColors className="flex items-center gap-x-4">
          <span className="text-sm">Sprint</span>
          {/* <CountBall
            count={filterSprints.length}
            className="bg-inprogress text-xs text-white"
            hideOnZero={true}
          /> */}
          <FaChevronDown className="text-xs" />
        </Button>
      </DropdownTrigger>
      <DropdownPortal>
        <DropdownContent
          side="bottom"
          align="start"
          className="z-10 mt-2 w-64 rounded-[3px] border-[0.3px] bg-white py-2 shadow-md dark:border-darkSprint-30 dark:bg-darkSprint-20"
        >
          {sprints?.filter(filterActiveSprints).map((sprint) => (
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              key={sprint.id}
              className="px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-darkSprint-30"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSelectChange(sprint)
              }
            >
              <div className="flex items-center gap-x-2 hover:cursor-default">
                <input
                  type="checkbox"
                  className="form-checkbox h-3 w-3 rounded-sm text-inprogress"
                  checked={filterSprints.includes(sprint.id)}
                />
                <TooltipWrapper text={sprint.name}>
                  <span className="text-sm text-gray-700 dark:text-dark-50">{sprint.name}</span>
                </TooltipWrapper>
              </div>
            </DropdownItem>
          ))}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

export { SprintFilter };
