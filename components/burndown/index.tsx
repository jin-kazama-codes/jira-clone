"use client";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useCookie } from "@/hooks/use-cookie";
import "@/styles/split.css";
import { BurndownHeader } from "./header";
import BurndownIssueList from "./burndown-issue-list";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ITEMS_PER_PAGE = 20;

const Burndown: React.FC = () => {
  const project = useCookie("project");
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [sprintId, setSprintId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { issues } = useIssues();

  // useLayoutEffect(() => {
  //   if (!renderContainerRef.current) return;
  //   const calculatedHeight = renderContainerRef.current.offsetTop;
  //   renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  // }, []);

  const allIssues =
    issues?.flatMap((issue) =>
      issue.sprintId === sprintId ? [issue, ...(issue.children || [])] : []
    ) || [];

  // Calculate pagination values
  const totalPages = Math.ceil(allIssues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedIssues = allIssues.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Optionally scroll to top of list
    renderContainerRef.current?.scrollTo(0, 0);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [sprintId]);

  if (!project) return null;

  return (
    <Fragment>
      <BurndownHeader
        project={project}
        sprintId={sprintId}
        setSprintId={setSprintId}
      />
      <div className="min-w-full mt-8 max-w-max flex flex-col items-center justify-center">
        {allIssues.length > 0 ? (
          <>
            <BurndownIssueList issues={paginatedIssues} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t bg-sprint px-4 py-3 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, allIssues.length)} of {allIssues.length}{" "}
                    issues
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-full bg-black p-1.5"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft className="h-4 w-4 text-white" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => (
                        <Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`${page === currentPage
                              ? "bg-slate-500 text-white"
                              : "bg-slate-300"
                              } w-8 rounded-full`}
                          >
                            {page}
                          </button>
                        </Fragment>
                      ))}
                  </div>

                  <button
                    className="rounded-full bg-black p-1.5"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center mt-36 text-gray-800 text-lg">Complete your first sprint to view this report </p>
        )}
      </div>
    </Fragment>
  );
};

export { Burndown };
