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

const IssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType | undefined, detailPage?: boolean }
>(({ issue, detailPage }, ref) => {
  const [parentRef, parentWidth] = useContainerWidth();

  if (!issue) return <div />;

  console.log("PARENTWIDTH", parentWidth)
  
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
          className="w-full transition-all rounded-xl [&[data-state=notEditing]]:hover:bg-gray-100"
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
      />
      <div className="relative flex items-center gap-x-3">
        <IssueSelectStatus
          key={issue.id + issue.status}
          currentStatus={issue.status}
          issueId={issue.id}
          variant="lg"
        />
        <NotImplemented>
          <Button customColors className="hover:bg-gray-200 rounded-xl">
            <div className="flex items-center">
              <LightningIcon className="mt-0.5" />
              <span>Actions</span>
            </div>
          </Button>
        </NotImplemented>
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
      <IssueMetaInfo issue={issue} />

      <div className="row  flex  mt-2">
        <h2 className="pr-2">Activity :</h2>
        <button className={`${activity === "comments" ? "bg-slate-300 border-2 " : "bg-slate-100"} rounded-md rounded-r-none  px-2 py-1 border-2 `} onClick={() => setActivity("comments")}>Comments</button>
        <button className={`${activity === "worklog" ? "bg-slate-300 border-2 " : "bg-slate-100"} rounded-md rounded-l-none  px-2 py-1 border-2 `} onClick={() => setActivity("worklog")}>Worklog</button>
      </div>
      {activity === "comments" ? <Comments issue={issue} /> : <Worklog
        issue={issue} />}

    </Fragment>
  );
});

SmallIssueDetailsInfo.displayName = "SmallIssueDetailsInfo";

const LargeIssueDetails = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType, detailPage?: boolean }
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
      className={`flex ${detailPage ? 'max-h-[87vh]' : 'max-h-[70vh]' } w-full overflow-hidden`}
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
            className="w-full transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
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
        <div className="row flex  mt-2">
          <h2 className="pr-2">Activity :</h2>
          <button className={`${activity === "comments" ? "bg-slate-300 border-2 " : "bg-slate-100"} rounded-md rounded-r-none  px-2 py-1 border-2 `} onClick={() => setActivity("comments")}>Comments</button>
          <button className={`${activity === "worklog" ? "bg-slate-300 border-2 " : "bg-slate-100"} rounded-md rounded-l-none  px-2 py-1 border-2 `} onClick={() => setActivity("worklog")}>Worklog</button>
        </div>
        {activity === "comments" ? <Comments issue={issue} /> : <Worklog issue={issue}/>}
        
      </div>

      <div className="mt-4 bg-white pl-3">
        <div className="relative flex items-center gap-x-3">
          <IssueSelectStatus
            key={issue.id + issue.status}
            currentStatus={issue.status}
            issueId={issue.id}
            variant="lg"
          />
          <NotImplemented>
            <Button customColors className="hover:bg-gray-200">
              <div className="flex items-center">
                <LightningIcon className="mt-0.5" />
                <span>Actions</span>
              </div>
            </Button>
          </NotImplemented>
        </div>

        <IssueDetailsInfoAccordion issue={issue} />
        <IssueMetaInfo issue={issue} />
      </div>
    </Split>
  );
});

LargeIssueDetails.displayName = "LargeIssueDetails";

export { IssueDetailsInfo };
