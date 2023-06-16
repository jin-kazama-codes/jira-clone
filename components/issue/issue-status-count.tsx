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
            status == "TODO" && "bg-todo text-black",
            status == "IN_PROGRESS" && "bg-inprogress text-white",
            status == "DONE" && "bg-done text-white"
          )}
        />
      ))}
    </Fragment>
  );
};

const CountBall: React.FC<{ count: number; className: string }> = ({
  count,
  className,
}) => {
  return (
    <span
      className={clsx(
        "flex h-5 items-center justify-center rounded-full px-1.5 py-0.5 text-sm font-semibold",
        className
      )}
    >
      {count}
    </span>
  );
};

export { IssueStatusCount, CountBall };
