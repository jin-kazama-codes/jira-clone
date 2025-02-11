"use client";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FaChevronRight } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { IssueList } from "./issue-list";
import { IssueStatusCount } from "../issue/issue-status-count";
import { type Sprint } from "@prisma/client";
import { type IssueType } from "@/utils/types";
import { SprintDropdownMenu } from "./sprint-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StartSprintModal } from "@/components/modals/start-sprint";
import { CompleteSprintModal } from "../modals/complete-sprint";
import { UpdateSprintModal } from "../modals/update-sprint";
import { AlertModal } from "../modals/alert";
import { useQueryClient } from "@tanstack/react-query";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { toast } from "../toast";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import {
  assigneeNotInFilters,
  epicNotInFilters,
  getPluralEnd,
  isEpic,
  isSubtask,
  issueNotInSearch,
  issueTypeNotInFilters,
  sprintId,
} from "@/utils/helpers";
import { useCookie } from "@/hooks/use-cookie";
import { useTimeEstimates } from "@/utils/getOriginalEstimate";
import Timelist from "./estimate-time-list";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useFiltersContext } from "@/context/use-filters-context";
import { IssueSkeleton } from "../skeletons";
import IssueListSkeleton from "../ui/issue-list-skeleton";

const user = useCookie("user");

const SprintList: React.FC<{
  sprint: Sprint;
  index: number;
}> = ({ sprint, index }) => {
  const [openAccordion, setOpenAccordion] = useState(sprint.id);

  const { search, assignees, issueTypes, epics } = useFiltersContext();
  const { issues, getIssueCountBySprintId } = useIssues(openAccordion);

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, sprintId: string | null) => {
      if (!issues) return [];
      return issues.filter((issue) => {
        if (
          issue.sprintId === sprintId &&
          !isEpic(issue) &&
          !isSubtask(issue)
        ) {
          if (issueNotInSearch({ issue, search })) return false;
          if (assigneeNotInFilters({ issue, assignees })) return false;
          if (epicNotInFilters({ issue, epics })) return false;
          if (issueTypeNotInFilters({ issue, issueTypes })) return false;
          return true;
        }
        return false;
      });
    },
    [search, assignees, epics, issueTypes]
  );

  return (
    <Accordion
      onValueChange={setOpenAccordion}
      value={openAccordion}
      className="overflow-hidden rounded-xl border-2 bg-slate-100 p-4 dark:border-darkSprint-30 dark:bg-darkSprint-10"
      type="single"
      collapsible
    >
      <Suspense fallback={<IssueListSkeleton size={4} />}>
        <AccordionItem value={sprint.id}>
          <SprintListHeader
            sprint={sprint}
            issues={filterIssues(issues, sprint.id)}
          />
          <IssueList
            sprintId={sprint.id}
            issues={filterIssues(issues, sprint.id)}
          />
        </AccordionItem>
      </Suspense>
    </Accordion>
  );
};

const SprintListHeader: React.FC<{
  issues: IssueType[];
  sprint: Sprint;
}> = ({ issues, sprint }) => {
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { deleteSprint } = useSprints();

  // function handleDeleteSprint() {
  //   // if (!isAuthenticated) {
  //   //   openAuthModal();
  //   //   return;
  //   // }
  //   // deleteSprint(
  //   //   { sprintId: sprint.id },
  //   //   {
  //   //     onSuccess: () => {
  //   //       // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   //       queryClient.invalidateQueries(["issues"]);
  //   //       toast.success({
  //   //         message: `Deleted sprint ${sprint.name}`,
  //   //         description: "Sprint deleted",
  //   //       });
  //   //       setDeleteModalIsOpen(false);
  //   //     },
  //   //     onError: () => {
  //   //       toast.error({
  //   //         message: `Failed to delete sprint ${sprint.name}`,
  //   //         description: "Something went wrong",
  //   //       });
  //   //     },
  //   //   }
  //   // );
    
  // }

  const handleDeleteSprint = async() => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
  
    try {
      const response = await fetch(`/api/sprints/${sprint.id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete sprint");
      }
  
      await queryClient.invalidateQueries(["sprints"]);
  
      toast.success({
        message: `Deleted sprint ${sprint.name}`,
        description: "Sprint deleted successfully",
      });
  
      setDeleteModalIsOpen(false);
    } catch (error) {
      toast.error({
        message: `Failed to delete sprint ${sprint.name}`,
        description: "Something went wrong. Please try again.",
      });
    }
  }
  

  function getFormattedDateRange(
    startDate: Date | undefined | null,
    endDate: Date | undefined | null
  ) {
    if (!startDate || !endDate) {
      return "";
    }
    return `${new Date(startDate).toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    })} - ${new Date(endDate).toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    })}`;
  }

  const { convertedOriginalEstimate, convertedTotalTime } =
    useTimeEstimates(issues);

  return (
    <Fragment>
      <UpdateSprintModal
        isOpen={updateModalIsOpen}
        setIsOpen={setUpdateModalIsOpen}
        sprint={sprint}
      />
      <AlertModal
        isOpen={deleteModalIsOpen}
        setIsOpen={setDeleteModalIsOpen}
        title="Delete sprint"
        description={`Are you sure you want to delete sprint BOLD${sprint.name}BOLD?`}
        actionText="Delete"
        onAction={handleDeleteSprint}
      />
      <div className="flex w-full min-w-max items-center justify-between pl-2 text-sm">
        <AccordionTrigger className="flex w-full  items-center font-medium [&[data-state=open]>svg]:rotate-90">
          <Fragment>
            <FaChevronRight
              className="mr-2 text-xs text-black transition-transform dark:text-dark-50"
              aria-hidden
            />
            <div className="flex items-center  gap-x-2">
              <div className="text-semibold whitespace-nowrap text-xl dark:text-dark-50">
                {sprint.name}
              </div>
              <div className="flex items-center gap-x-3 whitespace-nowrap font-normal text-gray-800  dark:text-darkSprint-50">
                <span>
                  {getFormattedDateRange(sprint.startDate, sprint.endDate)}
                </span>
                <span className="dark:text-dark-50">
                  ({issues.length ? issues.length : 0} issue{getPluralEnd(issues)})
                </span>
                {convertedOriginalEstimate ? (
                  <span className="dark:text-darkSprint-50">
                    Estimate:{" "}
                    <span className="text-md font-bold  dark:text-dark-50">
                      {convertedOriginalEstimate}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
          </Fragment>
        </AccordionTrigger>
        <div className="flex items-center gap-x-2">
          <Timelist Time={convertedTotalTime} />
          <SprintActionButton sprint={sprint} issues={issues} />
          {(user?.role === "admin" || user?.role === "manager") && (
            <SprintDropdownMenu
              sprint={sprint}
              setUpdateModalIsOpen={setUpdateModalIsOpen}
              setDeleteModalIsOpen={setDeleteModalIsOpen}
            >
              <DropdownTrigger
                asChild
                className="flex items-center gap-x-1 px-1.5 py-0.5 text-xs font-semibold focus:ring-2"
              >
                <div className="rounded-full px-1.5 py-1.5 text-black hover:cursor-pointer hover:bg-gray-300 dark:text-dark-50 dark:hover:bg-darkSprint-40 [&[data-state=open]]:bg-gray-300 ">
                  <BsThreeDots className="sm:text-xl " />
                </div>
              </DropdownTrigger>
            </SprintDropdownMenu>
          )}
        </div>
      </div>
      <div className="pl-7 text-sm  font-medium text-gray-800 dark:text-darkSprint-50">
        {sprint.description}
      </div>
    </Fragment>
  );
};

const SprintActionButton: React.FC<{ sprint: Sprint; issues: IssueType[] }> = ({
  sprint,
  issues,
}) => {
  if (
    sprint.status === "ACTIVE" &&
    (user?.role === "admin" || user?.role === "manager")
  ) {
    return (
      <CompleteSprintModal issues={issues} sprint={sprint}>
        <Button className="rounded-xl !bg-button px-4  hover:!bg-buttonHover dark:!bg-dark-0">
          <span className="whitespace-nowrap text-white">Complete sprint</span>
        </Button>
      </CompleteSprintModal>
    );
  }

  if (
    sprint.status === "PENDING" &&
    (user?.role === "admin" || user?.role === "manager")
  ) {
    return (
      <StartSprintModal issueCount={issues.length} sprint={sprint}>
        <Button className="rounded-xl !bg-button px-4 hover:!bg-buttonHover  dark:!bg-dark-0 ">
          <span className="whitespace-nowrap text-white">Start sprint</span>
        </Button>
      </StartSprintModal>
    );
  }

  return null;
};

export { SprintList };
