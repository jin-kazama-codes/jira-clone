import { getBaseUrl, getHeaders } from "../helpers";
import axios from "axios";

const baseUrl = getBaseUrl();

export const companyRoutes = {
  getCompany: async () => {
    const { data } = await axios.get(`${baseUrl}/api/company`);
    return data?.companies;
  },
  getCompanyById: async (companyId: any) => {
    const { data } = await axios.get(`${baseUrl}/api/company/${companyId}`);
    return data?.company;
  },
  postCompany: async (body: any) => {
    const { data } = await axios.post(`${baseUrl}/api/company`, body, {
      headers: getHeaders(),
    });

    return data?.company;
  },
  patchCompany: async (companyId: any, body: any) => {
    const { data } = await axios.patch(
      `${baseUrl}/api/company/${companyId}`,
      body,
      {
        headers: getHeaders(),
      }
    );
    return data?.company;
  },
};
