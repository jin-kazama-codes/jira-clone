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
    <div className="mt-2 w-full h-[58vh] overflow-y-scroll" ref={scrollRef}>
      <h2 className="mb-1 mt-4 text-xl font-semibold">All Issues</h2>
      <div className="overflow-hidden rounded-lg border">
        {/* Column Headers */}
        <div className="grid grid-cols-5 gap-4 border-b bg-gray-100 px-4 py-2 font-medium text-gray-700">
          <div>Date</div>
          <div>Issue Key</div>
          <div>Title</div>
          <div>Type</div>
          <div>Status</div>
        </div>

        {/* Issue List */}
        <div className="divide-y">
          {issues?.map((issue) => (
            <div
              key={issue.id}
              onClick={() => {
                setIssueKey(issue.key);
                router.push(`/project/issue/${issue?.key}`) 
              }}
              className="grid cursor-pointer grid-cols-5 items-center gap-4 px-4 py-3 hover:bg-slate-50"
            >
              <div className="text-sm text-gray-600">
                {new Date(issue.createdAt).toISOString().split("T")[0]}
              </div>
              <div className="text-xs font-medium text-gray-600">
                {issue.key}
              </div>
              <div className="truncate text-sm">{issue.name}</div>
              <div className="flex items-center gap-2">
                <IssueIcon issueType={issue.type} />
                <span className="text-sm">{capitalize(issue.type)}</span>
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
