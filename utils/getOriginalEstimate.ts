import { useWorkflow } from "@/hooks/query-hooks/use-workflow";
import { useEffect, useState } from "react";
import { minutesToTimeString, timeStringToMinutes } from "./helpers";

export const useTimeEstimates = (issues, page = "sprint") => {
  const [statuses, setStatuses] = useState([]);
  const [estimates, setEstimates] = useState({
    convertedOriginalEstimate: "0m",
    convertedTotalTime: {},
  });

  const { data: workflow, isLoading, isError } = useWorkflow();

  useEffect(() => {
    if (workflow) {
      const labels = workflow.nodes.map((node) => node.data.label);
      setStatuses(labels);
    }
  }, [workflow]);

  useEffect(() => {
    if (!isLoading && !isError && statuses.length > 0) {
      // Create a status object dynamically from statuses
      const statusObject = statuses.reduce((acc, status) => {
        const key = status.toUpperCase().replace(/\s+/g, "_");
        acc[key] = 0;
        return acc;
      }, {});

      let totalOriginalEstimate = 0;
      let totalTime = page !== "sprint" ? 0 : { ...statusObject };

      issues.forEach((issue) => {
        if (issue.estimateTime) {
          const convertedTime = timeStringToMinutes(issue.estimateTime);
          totalOriginalEstimate += convertedTime;

          const convertedTimeSpent = timeStringToMinutes(issue.timeSpent);

          if (page !== "sprint") {
            totalTime += convertedTimeSpent;
          } else {
            const normalizedStatus = (issue.status || "")
              .trim()
              .toUpperCase()
              .replace(/\s+/g, "_");

            if (normalizedStatus in totalTime) {
              totalTime[normalizedStatus] += convertedTimeSpent;
            } else {
              console.warn(`Unknown status "${issue.status}" found. Skipping...`);
            }
          }
        }
      });

      // Convert times to readable format
      const convertedOriginalEstimate = minutesToTimeString(totalOriginalEstimate);

      let convertedTotalTime;
      if (page !== "sprint") {
        convertedTotalTime = minutesToTimeString(totalTime);
      } else {
        convertedTotalTime = Object.fromEntries(
          Object.entries(totalTime).map(([key, value]) => [key, minutesToTimeString(value)])
        );
      }

      setEstimates({
        convertedOriginalEstimate,
        convertedTotalTime,
      });
    }
  }, [isLoading, isError, statuses, issues, page]);

  return estimates;
};

