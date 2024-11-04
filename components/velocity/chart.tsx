import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timeStringToHours } from "@/utils/helpers";
import { useCookie } from "@/hooks/use-cookie";

const VelocityChart = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [sprintData, setSprintData] = useState([]);
  const [years, setYears] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const projectName = useCookie('project').name

  const getQuarter = (date) => {
    const month = date.getMonth();
    return Math.floor(month / 3) + 1;
  };

  const quarterRanges = {
    1: { start: '01-01', end: '03-31' },
    2: { start: '04-01', end: '06-30' },
    3: { start: '07-01', end: '09-30' },
    4: { start: '10-01', end: '12-31' }
  };

  const fetchSprints = async () => {
    try {
      const response = await fetch("/api/sprints?closed=true");
      const data = await response.json();

      // Process sprints to extract years and quarters
      const sprintYearsSet = new Set();
      const sprintQuartersSet = new Set();

      const processedSprints = data.sprints.map(sprint => {
        const updatedAt = new Date(sprint.updatedAt);
        const year = updatedAt.getFullYear();
        const quarter = getQuarter(updatedAt);
        
        sprintYearsSet.add(year);
        sprintQuartersSet.add(quarter);

        return {
          ...sprint,
          name: sprint.name,
          estimateTime: sprint.estimateTime,
          timeTaken: sprint.timeTaken,
          estimatedHours: timeStringToHours(sprint.estimateTime),
          actualHours: timeStringToHours(sprint.timeTaken),
          year,
          quarter
        };
      });

      // Set available years and quarters
      const sortedYears = Array.from(sprintYearsSet).sort((a, b) => b - a);
      const sortedQuarters = Array.from(sprintQuartersSet).sort((a, b) => a - b);
      
      setYears(sortedYears);
      setQuarters(sortedQuarters);

      // Set default selections to latest year and quarter
      if (!selectedYear && sortedYears.length > 0) {
        setSelectedYear(sortedYears[0].toString());
      }
      if (!selectedQuarter && sortedQuarters.length > 0) {
        setSelectedQuarter(sortedQuarters[sortedQuarters.length - 1].toString());
      }

      setSprintData(processedSprints);
    } catch (error) {
      console.error("Error fetching sprint data:", error);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  useEffect(() => {
    if (sprintData.length === 0) return;

    // Filter sprints based on selected year and quarter
    const filteredSprints = sprintData.filter(sprint => {
      const matchYear = selectedYear ? sprint.year.toString() === selectedYear : true;
      const matchQuarter = selectedQuarter ? sprint.quarter.toString() === selectedQuarter : true;
      return matchYear && matchQuarter;
    });

    setChartOptions({
      chart: {
        type: 'column'
      },
      title: {
        text: `${projectName} Velocity Report - ${selectedYear} Q${selectedQuarter}`,
        align: 'center'
      },
      plotOptions: {
        series: {
          grouping: false,
          borderWidth: 0
        }
      },
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical'
      },
      tooltip: {
        shared: true,
        headerFormat: '<span style="font-size: 15px">{point.key}</span><br/>',
        formatter: function() {
          return `<span style="font-size: 15px; margin-bottom: 2px">${this.x}</span><br/>` +
            this.points.map(point => {
              const sprintInfo = filteredSprints.find(s => point.y === (
                point.series.name === 'Estimated Time' ? s.estimatedHours : s.actualHours
              ));
              const timeString = point.series.name === 'Estimated Time' 
                ? sprintInfo.estimateTime 
                : sprintInfo.timeTaken;
              return `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${timeString}</b><br/>`;
            }).join('');
        }
      },
      xAxis: {
        categories: filteredSprints.map(sprint => sprint.name),
        title: {
          text: 'Sprints'
        },
        labels: {
          style: {
            textAlign: 'center'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Time (Hours)'
        },
        showFirstLabel: false,
        labels: {
          format: '{value}'
        }
      },
      series: [
        {
          color: 'rgba(158, 159, 163, 0.5)',
          pointPlacement: -0.2,
          name: 'Estimated Time',
          data: filteredSprints.map(sprint => sprint.estimatedHours),
          dataLabels: [{
            enabled: true,
            inside: true,
            formatter: function() {
              const sprintInfo = filteredSprints.find(s => this.y === s.estimatedHours);
              return sprintInfo.estimateTime;
            },
            style: {
              fontSize: '12px'
            }
          }]
        },
        {
          name: 'Time Logged',
          color: '#1a9c50',
          pointPlacement: 0.2,
          data: filteredSprints.map(sprint => sprint.actualHours),
          dataLabels: [{
            enabled: true,
            inside: true,
            formatter: function() {
              const sprintInfo = filteredSprints.find(s => this.y === s.actualHours);
              return sprintInfo.timeTaken;
            },
            style: {
              fontSize: '12px'
            }
          }]
        }
      ]
    });
  }, [sprintData, selectedYear, selectedQuarter]);

  return (
    <div className="flex flex-col gap-4 h-[80vh]">
      <div className="flex gap-4 px-4 justify-center mb-4">
      <div className="flex items-center gap-2">
          <label htmlFor="year" className="font-medium text-sm">Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="quarter" className="font-medium text-sm">Quarter:</label>
          <select
            id="quarter"
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {quarters.map(quarter => (
              <option key={quarter} value={quarter.toString()}>
                Q{quarter}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 w-3/4 mx-auto">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default VelocityChart;