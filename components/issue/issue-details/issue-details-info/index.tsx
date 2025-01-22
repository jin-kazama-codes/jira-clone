import React, { Fragment, useRef, useState } from "react";
import { NotImplemented } from "@/components/not-implemented";
import { LightningIcon } from "@/components/svgs";
import { IssueTitle } from "../../issue-title";
import { IssueSelectStatus } from "../../issue-select-status";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { type IssueType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Comments } from "./issue-details-info-comments";
import { IssueMetaInfo } from "./issue-details-info-meta";
import { Description } from "./issue-details-info-description";
import { IssueDetailsInfoAccordion } from "./issue-details-info-accordion";
import { IssueDetailsInfoActions } from "./issue-details-info-actions";
import { ChildIssueList } from "./issue-details-info-child-issues";
import { hasChildren, isEpic } from "@/utils/helpers";
import { ColorPicker } from "@/components/color-picker";
import { useContainerWidth } from "@/hooks/use-container-width";
import Split from "react-split";
import "@/styles/split.css";
import Worklog from "./issue-details-info-worklog";
import { HiOutlineChat } from "react-icons/hi";
import { MdOutlineWorkHistory } from "react-icons/md";

const IssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType | undefined; detailPage?: boolean }
>(({ issue, detailPage }, ref) => {
  const [parentRef, parentWidth] = useContainerWidth();

  if (!issue) return <div />;

  return (
    <div ref={parentRef}>
      {!parentWidth ? null : parentWidth > 800 ? (
        <LargeIssueDetails issue={issue} detailPage={detailPage} ref={ref} />
      ) : (
        <SmallIssueDetailsInfo issue={issue} ref={ref} />
      )}
    </div>
  );
});

IssueDetailsInfo.displayName = "IssueDetailsInfo";

const SmallIssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType }
>(({ issue }, ref) => {
  const { issueKey } = useSelectedIssueContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChildIssue, setIsAddingChildIssue] = useState(false);
  const [activity, setActivity] = useState("comments");

  return (
    <Fragment>
      <div className="flex items-center gap-x-2">
        {isEpic(issue) ? <ColorPicker issue={issue} /> : null}
        <h1
          ref={ref}
          role="button"
          onClick={() => setIsEditing(true)}
          data-state={isEditing ? "editing" : "notEditing"}
          className="w-full rounded-xl transition-all dark:[&[data-state=notEditing]]:hover:bg-darkSprint-30 dark:text-dark-50 [&[data-state=notEditing]]:hover:bg-gray-100"
        >
          <IssueTitle
            className="mr-1 py-1"
            key={issue.id + issue.name}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            issue={issue}
            ref={nameRef}
          />
        </h1>
      </div>

      <div className="relative mt-2 flex items-center gap-x-3">
        <IssueDetailsInfoActions
          onAddChildIssue={() => setIsAddingChildIssue(true)}
          issue={issue}
        />

        <IssueSelectStatus
          key={issue.id + issue.status}
          currentStatus={issue.status}
          issueId={issue.id}
          variant="sm"
        />
        {/* <NotImplemented>
          <Button customColors className="rounded-xl hover:bg-gray-200">
            <div className="flex items-center">
              <LightningIcon className="mt-0.5" />
              <span>Actions</span>
            </div>
          </Button>
        </NotImplemented> */}
      </div>
      <Description issue={issue} key={String(issueKey) + issue.id} />
      {hasChildren(issue) || isAddingChildIssue ? (
        <ChildIssueList
          issues={issue.children}
          parentIsEpic={isEpic(issue)}
          parentId={issue.id}
          isAddingChildIssue={isAddingChildIssue}
          setIsAddingChildIssue={setIsAddingChildIssue}
        />
      ) : null}
      <IssueDetailsInfoAccordion issue={issue} />

      <div className="row mt-5 flex">
        <h2 className="pr-2 dark:text-dark-50">Activity :</h2>
        <div
          className={`${
            activity === "comments" ? "border-2 bg-button text-white dark:bg-darkButton-0 " : "bg-slate-100 dark:bg-darkButton-20"
          } rounded-md rounded-r-none  border-2 border-buttonHover px-2 py-1 dark:text-dark-50 dark:hover:bg-darkSprint-20 dark:border-darkButton-30 hover:cursor-pointer `}
          onClick={() => setActivity("comments")}
        >
          <div className="flex items-center justify-center gap-x-2">
          <span><HiOutlineChat /></span>
          <span>Comments</span>
          </div>
        </div>
        <div
          className={`${
            activity === "worklog" ? "border-2 bg-button text-white dark:bg-darkButton-0" : "bg-slate-100 dark:bg-darkButton-20"
          } rounded-md rounded-l-none  border-2 px-2 py-1 border-buttonHover dark:text-dark-50 dark:hover:bg-darkSprint-20 dark:border-darkButton-30  hover:cursor-pointer `}
          onClick={() => setActivity("worklog")}
        >
          <div className="flex items-center justify-center gap-x-2">
          <span><MdOutlineWorkHistory/></span>
          <span>Worklog</span>
          </div>
        </div>
      </div>
      <div className="mt-5">
      {activity === "comments" ? (
        <Comments issue={issue} />
      ) : (
        <Worklog issue={issue} />
      )}
      </div>
    </Fragment>
  );
});

SmallIssueDetailsInfo.displayName = "SmallIssueDetailsInfo";

const LargeIssueDetails = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType; detailPage?: boolean }
>(({ issue, detailPage }, ref) => {
  const { issueKey } = useSelectedIssueContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activity, setActivity] = useState("comments");
  const [isAddingChildIssue, setIsAddingChildIssue] = useState(false);

  return (
    <Split
      sizes={[60, 40]}
      gutterSize={2}
      className={`flex ${
        detailPage ? "max-h-[92vh]" : "max-h-[70vh]"
      } w-full overflow-hidden`}
      minSize={300}
    >
      <div className="overflow-y-auto pr-3">
        <div className="flex items-center gap-x-2">
          {isEpic(issue) ? <ColorPicker issue={issue} /> : null}
          <h1
            ref={ref}
            role="button"
            onClick={() => setIsEditing(true)}
            data-state={isEditing ? "editing" : "notEditing"}
            className="w-full transition-all dark:[&[data-state=notEditing]]:hover:bg-darkSprint-30 dark:text-dark-50 [&[data-state=notEditing]]:hover:bg-gray-100"
          >
            <IssueTitle
              className="mr-1 py-1"
              key={issue.id + issue.name}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              issue={issue}
              ref={nameRef}
            />
          </h1>
        </div>
        <IssueDetailsInfoActions
          onAddChildIssue={() => setIsAddingChildIssue(true)}
          variant={"lg"}
        />
        <Description issue={issue} key={String(issueKey) + issue.id} />
        {hasChildren(issue) || isAddingChildIssue ? (
          <ChildIssueList
            issues={issue.children}
            parentIsEpic={isEpic(issue)}
            parentId={issue.id}
            isAddingChildIssue={isAddingChildIssue}
            setIsAddingChildIssue={setIsAddingChildIssue}
          />
        ) : null}
        <div className="row mt-6  flex">
          <h2 className="pr-2 dark:text-dark-50">Activity :</h2>
          <div
          className={`${
            activity === "comments" ? "border-2 bg-button text-white dark:bg-darkButton-0" : "bg-slate-100"
          } rounded-md rounded-r-none  border-2 border-buttonHover px-2 py-1 dark:text-dark-50 dark:hover:bg-darkSprint-20 dark:border-darkButton-30 hover:cursor-pointer dark:bg-transparent`}
          onClick={() => setActivity("comments")}
        >
          <div className="flex items-center justify-center gap-x-2">
          <span><HiOutlineChat /></span>
          <span>Comments</span>
          </div>
        </div>
        <div
          className={`${
            activity === "worklog" ? "border-2 bg-button text-white dark:bg-darkButton-0" : "bg-slate-100"
          } rounded-md rounded-l-none  border-2 px-2 py-1 border-buttonHover dark:text-dark-50 dark:hover:bg-darkSprint-20 dark:border-darkButton-30 hover:cursor-pointer dark:bg-transparent`}
          onClick={() => setActivity("worklog")}
        >
          <div className="flex items-center justify-center gap-x-2">
          <span><MdOutlineWorkHistory/></span>
          <span>Worklog</span>
          </div>
        </div>
        </div>
        <div className="mt-4">
          {activity === "comments" ? (
            <Comments issue={issue} />
          ) : (
            <Worklog issue={issue} />
          )}
        </div>
      </div>

      <div className="mt-4 overflow-y-scroll pl-3">
        <div className="relative flex items-center gap-x-3">
          <IssueSelectStatus
            key={issue.id + issue.status}
            currentStatus={issue.status}
            issueId={issue.id}
            variant="lg"
          />
          {/* <NotImplemented>
            <Button customColors className="hover:bg-gray-200">
              <div className="flex items-center">
                <LightningIcon className="mt-0.5" />
                <span>Actions</span>
              </div>
            </Button>
          </NotImplemented> */}
        </div>

        <IssueDetailsInfoAccordion issue={issue} />
      </div>
    </Split>
  );
});

LargeIssueDetails.displayName = "LargeIssueDetails";

export { IssueDetailsInfo };
