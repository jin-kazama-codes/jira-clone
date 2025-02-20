import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { timeStringToHours } from "@/utils/helpers";
import { useCookie } from "@/hooks/use-cookie";

const VelocityChart = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [sprintData, setSprintData] = useState([]);
  const [years, setYears] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const projectName = useCookie("project").name;

  const getQuarter = (date) => Math.floor(date.getMonth() / 3) + 1;

  const fetchSprints = async () => {
    try {
      const response = await fetch("/api/sprints?closed=true");
      const data = await response.json();
  
      if (!data.sprints || data.sprints.length === 0) {
        setSprintData([]);
        return;
      }
  
      const sprintYearsSet = new Set();
      const sprintQuartersMap = {}; // Store quarters per year
  
      const processedSprints = data.sprints.map((sprint) => {
        const updatedAt = new Date(sprint.updatedAt);
        const year = updatedAt.getFullYear();
        const quarter = getQuarter(updatedAt);
  
        sprintYearsSet.add(year);
  
        // Ensure the year key exists in sprintQuartersMap
        if (!sprintQuartersMap[year]) {
          sprintQuartersMap[year] = new Set();
        }
        sprintQuartersMap[year].add(quarter); // Store quarters per year
  
        return {
          ...sprint,
          estimatedHours: timeStringToHours(sprint.estimateTime),
          actualHours: timeStringToHours(sprint.timeTaken),
          year,
          quarter,
        };
      });
  
      setYears([...sprintYearsSet].sort((a, b) => b - a));
  
      // Default to the latest year and its available quarters
      const latestYear = [...sprintYearsSet][0];
      setSelectedYear(latestYear.toString());
      
      if (latestYear) {
        const latestQuarters = [...sprintQuartersMap[latestYear]].sort((a, b) => b - a);
        setQuarters(latestQuarters);
        setSelectedQuarter(latestQuarters[0]?.toString() || ""); // Set latest quarter if available
      }
  
      setSprintData(processedSprints);
    } catch (error) {
      console.error("Error fetching sprint data:", error);
    }
  };

  useEffect(() => {
    if (selectedYear && sprintData.length > 0) {
      const filteredQuarters = [...new Set(
        sprintData
          .filter((sprint) => sprint.year.toString() === selectedYear)
          .map((sprint) => sprint.quarter)
      )].sort((a, b) => b - a);
  
      setQuarters(filteredQuarters);
      setSelectedQuarter(filteredQuarters[0]?.toString() || "");
    }
  }, [selectedYear, sprintData]);
  
  

  useEffect(() => {
    fetchSprints();

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (sprintData.length === 0) return;

    const isDarkMode = theme === "dark";

    const filteredSprints = sprintData.filter((sprint) => {
      const matchYear = selectedYear ? sprint.year.toString() === selectedYear : true;
      const matchQuarter = selectedQuarter ? sprint.quarter.toString() === selectedQuarter : true;
      return matchYear && matchQuarter;
    });

    setChartOptions({
      chart: {
        type: "column",
        backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
      },
      title: {
        text: `${projectName} Velocity Report - ${selectedYear} Q${selectedQuarter}`,
        style: { color: isDarkMode ? "#E5E7EB" : "#1F2937" },
      },
      xAxis: {
        categories: filteredSprints.map((sprint) => sprint.name),
        title: { text: "Sprints" },
        labels: { style: { color: isDarkMode ? "#E5E7EB" : "#1F2937" } },
      },
      yAxis: {
        title: { text: "Time (Hours)" },
        labels: { style: { color: isDarkMode ? "#E5E7EB" : "#1F2937" } },
        gridLineColor: isDarkMode ? "#374151" : "#E5E7EB",
      },
      legend: {
        enabled: true,
        align: "right",
        verticalAlign: "top",
        layout: "vertical",
        itemStyle: { color: isDarkMode ? "#E5E7EB" : "#1F2937" },
      },
      series: [
        {
          name: "Estimated Time",
          color: isDarkMode ? "rgba(158, 159, 163, 0.8)" : "rgba(158, 159, 163, 0.5)",
          data: filteredSprints.map((sprint) => sprint.estimatedHours),
        },
        {
          name: "Time Logged",
          color: isDarkMode ? "#4ADE80" : "#1a9c50",
          data: filteredSprints.map((sprint) => sprint.actualHours),
        },
      ],
    });
  }, [sprintData, selectedYear, selectedQuarter, theme]);

  return (
    <div className="flex flex-col gap-4 h-[80vh]">
      <div className={`${sprintData.length ? "flex-1 w-3/4 mx-auto" : "flex items-center justify-center h-[90vh]"}`}>
        {sprintData.length > 0 ? (
          <>
            <div className="flex gap-4 px-4 justify-center mb-4">
              <div className="flex items-center gap-2">
                <label htmlFor="year" className="font-medium text-sm dark:text-gray-200">
                  Year:
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-200 border dark:border-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="quarter" className="font-medium text-sm dark:text-gray-200">
                  Quarter:
                </label>
                <select
                  id="quarter"
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-200 border dark:border-gray-600 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {quarters.map((quarter) => (
                    <option key={quarter} value={quarter.toString()}>
                      Q{quarter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </>
        ) : (
          <p className="text-center text-gray-800 dark:text-dark-50">
            Complete your first sprint to view this report
          </p>
        )}
      </div>
    </div>
  );
};

export default VelocityChart;
