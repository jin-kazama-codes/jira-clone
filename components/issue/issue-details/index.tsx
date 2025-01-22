"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { IssueDetailsHeader } from "./issue-details-header";
import { IssueDetailsInfo } from "./issue-details-info";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { useCookie } from "@/hooks/use-cookie";
import { getProjectKeyFromUrl, setCookie } from "@/utils/helpers";
import { issuesRoutes } from "@/utils/api/issues";

const IssueDetails: React.FC<{
  issueKey: string | null;
  detailPage?: boolean;
}> = ({ issueKey, detailPage }) => {
  const { getIssueDetails } = issuesRoutes;
  const { setIssueKey } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [isInViewport, viewportRef] = useIsInViewport({ threshold: 1 });
  const project = useCookie("project");
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState<any>(null);
  const projectKey = getProjectKeyFromUrl();

  // Fetch project data if not in cookies
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
  }, [project]);

  // Fetch issue details directly from the API
  const fetchIssueDetails = useCallback(async (issueKey: string | null) => {
    if (!issueKey) return;

    try {
      setLoading(true)
      const issueInfo = await getIssueDetails(issueKey);
      setIssue(issueInfo);
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch issue details:", error);
    }
    setLoading(false)
  }, [getIssueDetails]);

  // Fetch issue when issueKey changes
  useEffect(() => {
    fetchIssueDetails(issueKey);

    if (renderContainerRef.current) {
      renderContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [issueKey, fetchIssueDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={renderContainerRef}
      data-state={issueKey ? "open" : "closed"}
      className="relative z-10 flex rounded-xl dark:bg-darkSprint-10 bg-white w-full flex-col overflow-y-scroll pl-4 pr-2 [&[data-state=closed]]:hidden"
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
