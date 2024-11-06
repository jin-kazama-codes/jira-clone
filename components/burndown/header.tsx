"use client";
import React, { useEffect, useState } from "react";
import { type Project } from "@prisma/client";

const BurndownHeader: React.FC<{ project: Project }> = ({
  project,
  setSprintId,
  sprintId,
}) => {
  const [sprints, setSprints] = useState(null)

  const fetchSprints = async () => {
    try {
      const response = await fetch("/api/sprints?closed=true");
      const data = await response.json();


      if (data.sprints && data.sprints.length > 0) {
        setSprints(data.sprints);

        // Sort sprints by closed date to get the latest
        const sortedSprints = data.sprints.sort(
          (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        // Set the latest closed sprint as default
        const latestClosedSprint = sortedSprints[0];
        setSprintId(latestClosedSprint.id);
      }
    } catch (error) {
      console.error("Error fetching sprint data:", error);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">
        Projects / {project.name} / Burndown
      </div>
      <h1 className="mt-2">Burndown report</h1>
      {sprints?.length && (
        <div className="mt-5">
          <p className="font-semibold text-sm ml-1 text-slate-600">Sprint</p>
          <select
            value={sprintId || ""}
            onChange={(e) => setSprintId(e.target.value)}
            className="p-2 mt-1 w-1/5 border rounded-xl "
          >
            {sprints?.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </select>
        </div>
      )
      }

    </div>
  );
};

export { BurndownHeader };
