import { getBaseUrl, getHeaders } from "../helpers";
import axios from "axios";

const baseUrl = getBaseUrl();

export const documentsRoutes = {
  postdocument: async () => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/document`, {
        headers: getHeaders(),
      });
      return data.document;
    } catch (error) {
      console.error(error);
    }
  },
  getdocuments: async () => {
    const { data } = await axios.get(`${baseUrl}/api/document`, {
      headers: getHeaders(),
    });
    return data.documents;
  },
  deletedocument: async (documentId: number) => {
    console.log("Documentid", documentId);
    const { data } = await axios.delete(
      `${baseUrl}/api/document/${documentId}`,
      {
        headers: getHeaders(),
      }
    );
    return data.document;
  },
};
