"use client";
import { Fragment, useEffect, useState } from "react";
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
import { getPluralEnd } from "@/utils/helpers";
import { useCookie } from "@/hooks/use-cookie";
import { getTimeEstimates } from "@/utils/getOriginalEstimate";
import Timelist from "./estimate-time-list";

const user = useCookie("user");

const SprintList: React.FC<{
  sprint: Sprint;
  issues: IssueType[];
}> = ({ sprint, issues }) => {
  const [openAccordion, setOpenAccordion] = useState("");
  useEffect(() => {
    setOpenAccordion(sprint.id); // Open accordion on mount in order for DND to work.
  }, [sprint.id]);

  return (
    <Accordion
      onValueChange={setOpenAccordion}
      value={openAccordion}
      className="overflow-hidden rounded-xl border-2  p-4"
      type="single"
      collapsible
    >
      <AccordionItem value={sprint.id}>
        <SprintListHeader sprint={sprint} issues={issues} />
        <IssueList sprintId={sprint.id} issues={issues} />
      </AccordionItem>
    </Accordion>
  );
};

const SprintListHeader: React.FC<{ issues: IssueType[]; sprint: Sprint }> = ({
  issues,
  sprint,
}) => {
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { deleteSprint } = useSprints();

  function handleDeleteSprint() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    deleteSprint(
      { sprintId: sprint.id },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          queryClient.invalidateQueries(["issues"]);
          toast.success({
            message: `Deleted sprint ${sprint.name}`,
            description: "Sprint deleted",
          });
          setDeleteModalIsOpen(false);
        },
        onError: () => {
          toast.error({
            message: `Failed to delete sprint ${sprint.name}`,
            description: "Something went wrong",
          });
        },
      }
    );
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
    getTimeEstimates(issues);


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
        <AccordionTrigger className="flex w-full items-center font-medium [&[data-state=open]>svg]:rotate-90">
          <Fragment>
            <FaChevronRight
              className="mr-2 text-xs text-black transition-transform"
              aria-hidden
            />
            <div className="flex items-center gap-x-2">
              <div className="text-semibold whitespace-nowrap text-xl">
                {sprint.name}
              </div>
              <div className="flex items-center gap-x-3 whitespace-nowrap font-normal text-gray-500">
                <span>
                  {getFormattedDateRange(sprint.startDate, sprint.endDate)}
                </span>
                <span>
                  ({issues.length} issue{getPluralEnd(issues)})
                </span>
                {convertedOriginalEstimate ? (
                  <span>
                    Estimate:{" "}
                    <span className="text-md font-bold">
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
                <div className="rounded-full px-1.5 py-1.5 text-black hover:cursor-pointer hover:bg-gray-300 [&[data-state=open]]:bg-gray-300 ">
                  <BsThreeDots className="sm:text-xl " />
                </div>
              </DropdownTrigger>
            </SprintDropdownMenu>
          )}
        </div>
      </div>
      <div className="text-gray-500 pl-7 text-sm">
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
        <Button className="rounded-xl !bg-black px-4 !text-white hover:!bg-black">
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
        <Button className="rounded-xl !bg-black px-4 !text-white hover:!bg-black">
          <span className="whitespace-nowrap text-white">Start sprint</span>
        </Button>
      </StartSprintModal>
    );
  }

  return null;
};

export { SprintList };
