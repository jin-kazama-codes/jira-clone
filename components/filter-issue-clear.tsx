import { useFiltersContext } from "@/context/use-filters-context";
import { Button } from "@/components/ui/button";
import { useCookie } from "@/hooks/use-cookie";

const ClearFilters: React.FC = () => {
  const {
    issueTypes,
    setIssueTypes,
    assignees,
    setAssignees,
    epics,
    setEpics,
    search,
    setSearch,
    sprints,
    setSprints,
  } = useFiltersContext();
  const { showAssignedTasks } = useCookie("project");

  function clearAllFilters() {
    setIssueTypes([]);
    setEpics([]);
    setSprints([]);
    setSearch("");

    // Only clear assignees if showAssignedTasks is false
    if (!showAssignedTasks) {
      setAssignees([]);
    }
  }

  if (
    issueTypes.length === 0 &&
    epics.length === 0 &&
    sprints.length === 0 &&
    search === "" &&
    (assignees.length === 0 || (showAssignedTasks && assignees.length >= 1))
  ) {
    return null;
  }

  return (
    <Button
      customColors
      onClick={clearAllFilters}
      className="text-sm px-4 hover:bg-gray-200 dark:hover:bg-darkSprint-30 dark:bg-darkSprint-20 dark:text-dark-50"
    >
      Clear Filters
    </Button>
  );
};

export { ClearFilters };
