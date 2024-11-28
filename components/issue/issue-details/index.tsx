"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { IssueDetailsHeader } from "./issue-details-header";
import { IssueDetailsInfo } from "./issue-details-info";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { useCookie } from "@/hooks/use-cookie";
import { getProjectKeyFromUrl, setCookie } from "@/utils/helpers";

const IssueDetails: React.FC<{
  issueKey: string | null;
  detailPage?: boolean
}> = ({ issueKey, detailPage }) => {
  const { issues } = useIssues();
  const { setIssueKey } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [isInViewport, viewportRef] = useIsInViewport({ threshold: 1 });
  const project = useCookie('project');
  const [loading, setLoading] = useState(true); // Initial loading state
  const projectKey = getProjectKeyFromUrl();

  useEffect(() => {
    // Only execute if project cookie is not found
    if (!project) {

      async function fetchProjectByKey(projectKey) {
        try {
          const response = await fetch(`/api/project/${projectKey}`);
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          const data = await response.json();
          // Optionally, set cookie here
          setCookie('project', data.project);
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false); // Set loading to false once data is fetched
        }
      }

      fetchProjectByKey(projectKey);
    } else {
      setLoading(false); // Skip fetch if project already exists in cookie
    }
  }, [project]);

  const getIssue = useCallback(
    (issueKey: string | null) => {
      return issues?.find((issue) => issue.key === issueKey);
    },
    [issues]
  );

  const [issueInfo, setIssueInfo] = useState(() => getIssue(issueKey));

  useEffect(() => {
    setIssueInfo(() => getIssue(issueKey));
    if (renderContainerRef.current) {
      renderContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [issueKey, getIssue]);

  // If loading, render a loader or empty state
  if (loading) return <div>Loading...</div>;

  if (!issueInfo || !issues) return <div />;

  return (
    <div
      ref={renderContainerRef}
      data-state={issueKey ? "open" : "closed"}
      className="relative z-10 flex rounded-xl bg-sprint w-full flex-col overflow-y-scroll pl-4 pr-2 [&[data-state=closed]]:hidden"
    >
      <IssueDetailsHeader
        detailPage={detailPage}
        issue={issueInfo}
        setIssueKey={setIssueKey}
        isInViewport={isInViewport}
      />
      <IssueDetailsInfo detailPage={detailPage} issue={issueInfo} ref={viewportRef} />
    </div>
  );
};

export { IssueDetails };
