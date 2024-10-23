import React, { Fragment, useEffect, useRef, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { Button } from "./ui/button";
import { MdCheck, MdClose } from "react-icons/md";
import { type IssueType } from "@/utils/types";
import { TooltipWrapper } from "./ui/tooltip";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useCookie } from "@/hooks/use-cookie";

type OriginalEstimateProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  issue: IssueType;
  className?: string;
  useTooltip?: boolean;
};

const OriginalEstimate = React.forwardRef<
  HTMLInputElement,
  OriginalEstimateProps
>(({ isEditing, setIsEditing, className, issue }, ref) => {
  const [currentEstimate, setCurrentEstimate] = useState(issue.estimateTime);
  const inputRef = ref || useRef<HTMLInputElement>(null);
  const user = useCookie("user");

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleEstimateChange(e: React.SyntheticEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateIssue({
      issueId: issue.id,
      estimateTime: currentEstimate,
    });
    setIsEditing(false);
  }

  return (
    <Fragment>
      {isEditing ? (
        <div className=" w-full">
          <label htmlFor="issue-estimate" className="sr-only">
            Original estimate
          </label>
          <input
            type="text"
            ref={inputRef}
            id="issue-estimate"
            value={currentEstimate}
            onChange={(e) => setCurrentEstimate(e.target.value)}
            className="w-full min-w-max whitespace-pre-wrap rounded-xl border-2 px-1 py-1.5 outline-2 outline-blue-400"
            placeholder="e.g., 2w 4d 6h 45m"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEstimateChange(e);
              }
              if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
          />
          <div className=" flex gap-x-1">
            <Button
              className="mt-2 aspect-square rounded-full bg-red-100 p-2.5 shadow-md transition-all hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              customColors
              customPadding
            >
              <MdClose className="text-sm" />
            </Button>
            <Button
              className="mt-2 aspect-square rounded-full bg-green-100 p-2.5 shadow-md transition-all hover:bg-gray-100"
              onClick={handleEstimateChange}
              customColors
              customPadding
            >
              <MdCheck className="text-sm" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="w-auto cursor-pointer  whitespace-nowrap"
          onClick={() => {
            if (user.role === "admin" || user.role === "manager") {
              setIsEditing(true);
            }
          }}
        >
          <TooltipWrapper text={issue.estimateTime}>
            <p className={className}>
              {issue.estimateTime ? issue.estimateTime : "No Time Logged"}
            </p>
          </TooltipWrapper>
        </div>
      )}
    </Fragment>
  );
});

OriginalEstimate.displayName = "OriginalEstimate";

export { OriginalEstimate };
