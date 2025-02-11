import { getBaseUrl, getHeaders } from "../helpers";
import axios from "axios";

const baseUrl = getBaseUrl();

export const adminRoutes = {
  getAdmins: async () => {
    const { data } = await axios.get(`${baseUrl}/api/admin`);
    return data?.admins;
  },
  postAdmin: async (body: any) => {
    const { data } = await axios.post(`${baseUrl}/api/admin`, body, {
      headers: getHeaders(),
    });

    return data?.user;
  },
  patchAdmin: async (userId: any, body: any) => {
    const { data } = await axios.patch(
      `${baseUrl}/api/admin/${userId}`,
      body,
      {
        headers: getHeaders(),
      }
    );
    return data?.user;
  },
};