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
  getDocuments: async (parentId?: Number) => {
    const { data } = await axios.get(
      `${baseUrl}/api/document?parentId=${parentId || null}`,
      {
        headers: getHeaders(),
      }
    );
    return data.documents;
  },
  deleteDocument: async (documentId: number, folder?: boolean) => {
    console.log("Documentid", documentId);
    const { data } = await axios.delete(
      `${baseUrl}/api/document/${documentId}?folder=${folder || false}`,
      {
        headers: getHeaders(),
      }
    );
    return data.document;
  },
};
