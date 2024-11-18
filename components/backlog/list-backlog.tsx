"use client";
import { Fragment, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IssueList } from "./issue-list";
import { IssueStatusCount } from "../issue/issue-status-count";
import { type IssueType } from "@/utils/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useCookie } from "@/hooks/use-cookie";
import { getTimeEstimates } from "@/utils/getOriginalEstimate";
import Timelist from "./estimate-time-list";

const BacklogList: React.FC<{
  id: string;
  issues: IssueType[];
}> = ({ id, issues }) => {
  const [openAccordion, setOpenAccordion] = useState("");

  useEffect(() => {
    setOpenAccordion(`backlog`); // Open accordion on mount in order for DND to work.
  }, [id]);

  return (
    <Accordion
      className="rounded-xl bg-sprint border-2 p-4 pb-20 "
      type="single"
      value={openAccordion}
      onValueChange={setOpenAccordion}
      collapsible
    >
      <AccordionItem value={`backlog`}>
        <BacklogListHeader issues={issues ?? []} />
        <IssueList sprintId={null} issues={issues ?? []} />
      </AccordionItem>
    </Accordion>
  );
};

const BacklogListHeader: React.FC<{ issues: IssueType[] }> = ({ issues }) => {
  const { createSprint } = useSprints();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const user = useCookie("user");

  function handleCreateSprint() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    createSprint();
  }

  const { convertedOriginalEstimate, convertedTotalTime } =
    getTimeEstimates(issues);

  return (
    <div className="flex w-full items-center justify-between text-sm ">
      <AccordionTrigger className="flex w-full items-center p-2  font-medium [&[data-state=open]>svg]:rotate-90">
        <Fragment>
          <FaChevronRight
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
          <div className="flex items-center gap-x-3">
            <div className="text-semibold text-xl">Backlog</div>
            <div className="ml-3 font-normal text-gray-800">
              ({issues.length} issues)
            </div>
            <div className="font-normal text-gray-800">
              {convertedOriginalEstimate
                ? convertedOriginalEstimate
                : ""}


            </div>
          </div>
        </Fragment>
      </AccordionTrigger>
      <div className="flex items-center gap-x-2 py-2">
        <Timelist Time={convertedTotalTime} />
        {(user?.role === "admin" || user?.role === "manager") && (
          <Button
            onClick={handleCreateSprint}
            className="rounded-xl  px-4 !text-white !bg-blue-600  hover:!bg-blue-700"

          >
            <span className="whitespace-nowrap text-white">Create Sprint</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export { BacklogList };
