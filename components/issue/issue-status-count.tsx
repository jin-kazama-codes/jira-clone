"use client";
import { getIssueCountByStatus } from "@/utils/helpers";
import { type IssueType } from "@/utils/types";
import clsx from "clsx";
import { Fragment, useCallback, useEffect, useState } from "react";

const IssueStatusCount: React.FC<{ issues: IssueType[] }> = ({ issues }) => {
  const memoizedCount = useCallback(getIssueCountByStatus, []);
  const [statusCount, setStatusCount] = useState(() =>
    memoizedCount(issues ?? [])
  );

  useEffect(() => {
    setStatusCount(() => memoizedCount(issues ?? []));
  }, [issues, memoizedCount]);

  return (
    <Fragment>
      {Object.entries(statusCount ?? {})?.map(([status, count]) => (
        <CountBall
          key={status}
          count={count}
          className={clsx(
            status == "To Do" && "bg-todo text-black",
            status == "In Progress" && "bg-inprogress text-white",
            status == "Done" && "bg-done text-white"
          )}
        />
      ))}
    </Fragment>
  );
};

const CountBall: React.FC<{
  count: number;
  className: string;
  hideOnZero?: boolean;
}> = ({ count, className, hideOnZero = false }) => {
  if (hideOnZero && count === 0) return null;
  return (
    <span
      className={clsx(
        "flex h-4 w-fit items-center justify-center rounded-full px-2 text-xs font-semibold",
        className
      )}
    >
      {count}
    </span>
  );
};

export { IssueStatusCount, CountBall };
