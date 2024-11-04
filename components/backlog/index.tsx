"use client";
import React, { Fragment, useEffect, useLayoutEffect } from "react";
import Split from "react-split";
import { ListGroup } from "./list-group";
import { IssueDetails } from "../issue/issue-details";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import clsx from "clsx";
import { BacklogHeader } from "./header";
import { useCookie } from "@/hooks/use-cookie";
import "@/styles/split.css";

const Backlog: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const project = useCookie("project");
  const { issueKey, setIssueKey } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!project) return null;
  return (
    <Fragment>
      <BacklogHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max" >
        <Split
          sizes={issueKey ? [60, 40] : [100, 0]}
          gutterSize={issueKey ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={issueKey ? 400 : 0}
        >
          <ListGroup className={clsx(issueKey && "pb-5 pr-4")} />
          <IssueDetails issueKey={issueKey} />
        </Split>
      </div>
    </Fragment>
  );
};

export { Backlog };
