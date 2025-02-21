import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";

const baseUrl = getBaseUrl();

export const WorklogRoutes = {
    createWorklog: async (worklog: any) => {
        try {
          const { data } = await axios.post(`${baseUrl}/api/worklog`, worklog ,{
            headers: getHeaders(),
          });
          return data.worklog;
        } catch (error) {
          console.error(error);
        }
      },
     
      getWorklog: async (issueId: string) => {
        try {
          const { data } = await axios.get(`${baseUrl}/api/worklog?issueId=${issueId}`, {
            headers: getHeaders(),
          });
          return data.worklogs; // Ensure this returns valid data
        } catch (error) {
          console.error("Error fetching Worklog:", error);
          throw error;
        }
      }, 
      
      updateWorklog: async(worklogId: any, worklog: any) => {
        try {
          const { data } = await axios.patch(`${baseUrl}/api/worklog/${worklogId}`, worklog, {
            headers: getHeaders(),
          });
          return data.worklog;
        } catch (error) {
          console.error("Error fetching Worklog:", error);
          throw error;
        }
      },

      deleteWorklog: async (worklogId: any) => {
        try {
          const { data } = await axios.delete(`${baseUrl}/api/worklog/${worklogId}`, {
            headers: getHeaders(),
          });
          return data?.worklog; 
        } catch (error) {
          console.error("Error fetching Worklog:", error);
          throw error;
        }
      },
}