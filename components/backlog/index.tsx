"use client";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { ListGroup } from "./list-group";
import { IssueDetails } from "../issue/issue-details";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import clsx from "clsx";
import { BacklogHeader } from "./header";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSprintsPaginatedFromServer } from "@/server/helper";

const Backlog: React.FC = ({ state, project }) => {
  const { issueKey } = useSelectedIssueContext();
  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    const adjustHeight = () => {
      if (headerRef.current && containerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - headerHeight;

        containerRef.current.style.height = `${availableHeight}px`;
        containerRef.current.style.maxHeight = `${availableHeight}px`;
      }
    };

    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, []);

  const {
    data: sprintData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(
    ["sprints"],
    ({ pageParam = 0 }) => getSprintsPaginatedFromServer(pageParam),
    {
      initialData: state,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
      refetchOnWindowFocus: false,
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
      <div ref={headerRef}>
        <BacklogHeader project={project} />
      </div>
      <div
        ref={containerRef}
        className="flex min-w-full max-w-max overflow-hidden"
      >
        <div
          className={clsx(
            "custom-scrollbar h-[68vh] w-full overflow-y-auto rounded-xl",
            issueKey ? "md:w-4/6 " : "w-full",
            issueKey && "pb-5 pr-2"
          )}
        >
          <ListGroup
            sprints={sprints}
            isLoading={isFetching}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>

        {issueKey && (
          <div className="custom-scrollbar hidden h-[68vh] w-2/6 overflow-y-auto rounded-xl md:block">
            <IssueDetails />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export { Backlog };
