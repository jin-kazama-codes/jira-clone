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
import { useTimeEstimates } from "@/utils/getOriginalEstimate";
import Timelist from "./estimate-time-list";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { getPluralEnd } from "@/utils/helpers";

const BacklogList: React.FC<{
  id: string;
}> = ({ id }) => {
  const [openAccordion, setOpenAccordion] = useState("backlog");
  const { issues } = useIssues(openAccordion);

  // useEffect(() => {
  //   setOpenAccordion(`backlog`);
  // }, [id]);

  // if(issuesLoading){
  //   return <div>Loading...</div>
  // }
  const filteredIssues = issues?.filter((issue) => issue.type === "TASK") ?? [];
  return (
    <Accordion
      className="rounded-xl border-2 bg-slate-100 p-4 pb-2 dark:border-darkSprint-30 dark:bg-darkSprint-10"
      type="single"
      value={openAccordion}
      onValueChange={setOpenAccordion}
      collapsible
    >
      <AccordionItem value={`backlog`}>
        <BacklogListHeader issues={filteredIssues} />
        <IssueList sprintId={null} issues={filteredIssues} />
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
    useTimeEstimates(issues);

  return (
    <div className="flex w-full items-center justify-between text-sm ">
      <AccordionTrigger className="flex w-full items-center p-2  font-medium [&[data-state=open]>svg]:rotate-90">
        <Fragment>
          <FaChevronRight
            className="mr-2 text-xs text-black transition-transform dark:text-dark-50"
            aria-hidden
          />
          <div className="flex items-center gap-x-3">
            <div className="text-semibold text-xl dark:text-dark-50">
              Backlog
            </div>
            <div className="ml-3 font-normal text-gray-800 dark:text-darkSprint-50">
              ({issues.length ? issues.length : 0} issue{getPluralEnd(issues)})
            </div>
            {convertedOriginalEstimate ? (
              <span className="dark:text-darkSprint-50">
                Estimate:{" "}
                <span className="text-md font-bold  dark:text-dark-50">
                  {convertedOriginalEstimate}
                </span>
              </span>
            ) : null}
          </div>
        </Fragment>
      </AccordionTrigger>
      <div className="flex items-center gap-x-2 py-2">
        <Timelist Time={convertedTotalTime} />
        {(user?.role === "admin" || user?.role === "manager") && (
          <Button
            onClick={handleCreateSprint}
            className="rounded-xl  !bg-button px-4 !text-white hover:!bg-buttonHover  dark:!bg-dark-0"
          >
            <span className="whitespace-nowrap text-white ">Create Sprint</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export { BacklogList };
