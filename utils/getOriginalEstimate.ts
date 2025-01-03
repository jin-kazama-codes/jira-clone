import { string } from "zod";
import { minutesToTimeString, timeStringToMinutes } from "./helpers";

export const getTimeEstimates = (issues, page = 'sprint') => {
    let totalOriginalEstimate = 0;
    let totalTime = page !== 'sprint' ? 0 : {
        TODO: 0,
        IN_PROGRESS: 0,
        DONE: 0
    };

    // Loop over issues
    issues.forEach(issue => {
        // Check if estimateTime is not null before adding
        if (issue.estimateTime) {
            const convertedTime = timeStringToMinutes(issue.estimateTime);
            totalOriginalEstimate += convertedTime;

            // Adding total time to the correct status
            const convertedTimeSpent = timeStringToMinutes(issue.timeSpent)
            if (page !== 'sprint') {
                totalTime += convertedTimeSpent;
            } else {
                if (issue.status === 'To Do' || issue.status === 'In Progress' || issue.status === 'Done') {
                    totalTime[issue.status] += convertedTime;
                } else {
                    console.warn(`Unknown status "${issue.status}" found. Skipping...`);
                }
        }
    }   
    });

    const convertedOriginalEstimate = minutesToTimeString(totalOriginalEstimate);
    

    let convertedTotalTime;
    if (page !== 'sprint') {
        convertedTotalTime = minutesToTimeString(totalTime);
    } else {
        convertedTotalTime = {
            TODO: minutesToTimeString(totalTime.TODO),
            IN_PROGRESS: minutesToTimeString(totalTime.IN_PROGRESS),
            DONE: minutesToTimeString(totalTime.DONE)
        };
    }

    return {
        convertedOriginalEstimate,
        convertedTotalTime
    };
};
