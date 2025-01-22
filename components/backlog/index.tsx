"use client";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import Split from "react-split";
import { ListGroup } from "./list-group";
import { IssueDetails } from "../issue/issue-details";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import clsx from "clsx";
import { BacklogHeader } from "./header";
import { useCookie } from "@/hooks/use-cookie";
import "@/styles/split.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSprintsPaginatedFromServer } from "@/server/helper";

const Backlog: React.FC = ({ state, project }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const project = useCookie("project");
  const { issueKey, setIssueKey } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [sprints, setSprints] = useState([]);

  
  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  const {
    data: sprintData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["sprints"],
    ({ pageParam = 0 }) => getSprintsPaginatedFromServer(pageParam),
    {
      initialData: state,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
    }
  );

  useEffect(() => {
    if (sprintData?.pages) {
      setSprints(sprintData?.pages.flatMap((page) => page.sprints));
    }
  }, [sprintData]);



  if (!project) return null;
  return (
    <Fragment>
      <BacklogHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max">
        <Split
          sizes={issueKey ? [60, 40] : [100, 0]}
          gutterSize={issueKey ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={issueKey ? 400 : 0}
        >
          <ListGroup
            className={clsx(issueKey && "pb-5 pr-4")}
            sprints={sprints}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
          <IssueDetails issueKey={issueKey}  />
        </Split>
      </div>
    </Fragment>
  );
};

export { Backlog };
