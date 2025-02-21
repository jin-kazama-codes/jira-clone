"use client";
import React, { useEffect, useState } from "react";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { IssueDetailsHeader } from "./issue-details-header";
import { IssueDetailsInfo } from "./issue-details-info";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { useCookie } from "@/hooks/use-cookie";
import { getProjectKeyFromUrl, setCookie } from "@/utils/helpers";
import { useIssueDetails } from "@/hooks/query-hooks/use-issue-details";

const IssueDetails: React.FC<{
  issueKey?: string;
  detailPage?: boolean;
  roadmap?: boolean;
}> = ({ issueKey: detailIssueKey, detailPage, roadmap = false }) => {
  const { issue, issueLoading, refetch } = useIssueDetails();
  const { issueKey, setIssueKey } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [isInViewport, viewportRef] = useIsInViewport({ threshold: 1 });
  const project = useCookie("project");
  const [loading, setLoading] = useState(true);
  const projectKey = getProjectKeyFromUrl();

  useEffect(() => {
    if (detailIssueKey) {
      setIssueKey(detailIssueKey);
    }
    if (issueKey) {
      refetch();
    }
  }, [detailIssueKey, issueKey]);


  useEffect(() => {
    if (!project) {
      async function fetchProjectByKey(projectKey: string | null) {
        try {
          const response = await fetch(`/api/project/${projectKey}`);
          if (!response.ok) {
            throw new Error("Failed to fetch project");
          }
          const data = await response.json();
          setCookie("project", data.project);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchProjectByKey(projectKey);
    } else {
      setLoading(false);
    }
  }, [project, projectKey]);

  if (!roadmap && (loading || issueLoading)) {
    return <div ref={renderContainerRef}
    className="relative z-10 flex w-full h-[70vh] items-center justify-center rounded-xl bg-white pl-4 pr-2 dark:bg-darkSprint-10 [&[data-state=closed]]:hidden"><div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black dark:border-t-dark-0 dark:bg-darkSprint-30" /></div>;
  }

  if (!issue) {
    return <div ref={renderContainerRef}
    data-state={issueKey ? "open" : "closed"}
    className="relative z-10 flex w-full flex-col  rounded-xl bg-white pl-4 pr-2 dark:bg-darkSprint-10 [&[data-state=closed]]:hidden">Couldn't find Issue</div>;
  }

  return (
    <div
      ref={renderContainerRef}
      data-state={issueKey ? "open" : "closed"}
      className="relative z-10 flex w-full flex-col  rounded-xl bg-white pl-4 pr-2 dark:bg-darkSprint-10 [&[data-state=closed]]:hidden"
    >
      <IssueDetailsHeader
        detailPage={detailPage}
        issue={issue}
        setIssueKey={setIssueKey}
        isInViewport={isInViewport}
      />
      <IssueDetailsInfo
        detailPage={detailPage}
        issue={issue}
        ref={viewportRef}
      />
    </div>
  );
};

export { IssueDetails };
