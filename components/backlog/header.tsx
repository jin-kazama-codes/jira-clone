"use client";
import React from "react";
import { useFiltersContext } from "@/context/use-filters-context";
import { type Project } from "@prisma/client";
import { IssueTypeFilter } from "@/components/filter-issue-type";
import { SearchBar } from "@/components/filter-search-bar";
import { Members } from "../members";
import { ClearFilters } from "../filter-issue-clear";

const BacklogHeader: React.FC<{ project: Project }> = ({ project }) => {
  const { search, setSearch } = useFiltersContext();
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-black">Projects / {project.name}</div>
      <h1>Backlog </h1>
      <div className="my-3 flex items-center justify-between">
        <div className="flex items-center gap-x-5">
          <SearchBar search={search} setSearch={setSearch} placeholder={'Search Backlog'} />
          <Members />
          {/* <EpicFilter /> */}
          <IssueTypeFilter />
          <ClearFilters />
        </div>
      </div>
    </div>
  );
};

export { BacklogHeader };
