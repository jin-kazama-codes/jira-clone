import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";

const baseUrl = getBaseUrl();

export const workflowRoutes = {
    createWorkflow: async () => {
        try {
          const { data } = await axios.post(`${baseUrl}/api/workflow`, {
            headers: getHeaders(),
          });
          return data.workflow;
        } catch (error) {
          console.error(error);
        }
      },
     
      getWorkflow: async () => {
        try {
          const { data } = await axios.get(`${baseUrl}/api/workflow`, {
            headers: getHeaders(),
          });
          return data.workflow.workflow; // Ensure this returns valid data
        } catch (error) {
          console.error("Error fetching workflow:", error);
          throw error;
        }
      }, 
      
      updateWorkflow: async(updatedWorkflow: any) => {
        try {
          const { data } = await axios.patch(`${baseUrl}/api/workflow`,updatedWorkflow, {
            headers: getHeaders(),
          });
          return data.workflow;
        } catch (error) {
          console.error("Error fetching workflow:", error);
          throw error;
        }
      }
}