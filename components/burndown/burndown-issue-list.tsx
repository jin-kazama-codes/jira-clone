import React, { useEffect, useRef } from "react";
import { IssueIcon } from "../issue/issue-icon";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { capitalize } from "@/utils/helpers";
import { IssueSelectStatus } from "../issue/issue-select-status";
import { useRouter } from "next/navigation";


const BurndownIssueList = ({ issues }) => {
  const { setIssueKey } = useSelectedIssueContext();
  const router = useRouter()
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [issues]);

  return (
    <div className=" w-full h-[61vh] overflow-y-scroll custom-scrollbar" ref={scrollRef}>
      <h2 className="mb-1  text-xl font-semibold dark:text-dark-50">All Issues</h2>
      <div className="overflow-hidden rounded-lg border  dark:border-darkSprint-30">
        {/* Column Headers */}
        <div className="grid grid-cols-5 gap-4 border-b dark:text-dark-50 bg-slate-300 px-4 py-2 font-medium dark:bg-darkSprint-20  text-gray-700">
          <div>Date</div>
          <div>Issue Key</div>
          <div>Title</div>
          <div>Type</div>
          <div>Status</div>
        </div>

        {/* Issue List */}
        <div className="divide-y ">
          {issues?.map((issue) => (
            <div
              key={issue.id}
              onClick={() => {
                setIssueKey(issue.key);
                router.push(`/issue/${issue?.key}`)
              }}
              className="grid dark:border-darkButton-0 dark:bg-darkButton-30 cursor-pointer grid-cols-5 dark:text-darkSprint-0 dark:hover:bg-darkButton-20 items-center gap-4 bg-slate-100 px-4 py-3 hover:bg-gray-00"
            >
              <div className="text-sm text-gray-600 dark:text-dark-50">
                {new Date(issue.createdAt).toISOString().split("T")[0]}
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-dark-50">
                {issue.key}
              </div>
              <div className="truncate text-sm dark:text-dark-50">{issue.name}</div>
              <div className="flex items-center gap-2">
                <IssueIcon issueType={issue.type} />
                <span className="text-sm dark:text-dark-50">{capitalize(issue.type)}</span>
              </div>
              <div>
                <IssueSelectStatus
                  currentStatus={issue.status}
                  issueId={issue.id}
                  page="burndown"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BurndownIssueList;
