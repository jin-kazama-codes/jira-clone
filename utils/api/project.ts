import { type GetProjectResponse } from "@/app/api/project/route";
import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";
import { type GetProjectMembersResponse } from "@/app/api/project/[project_id]/members/route";

const baseUrl = getBaseUrl();

export const projectRoutes = {
  getProject: async () => {
    const { data } = await axios.get<GetProjectResponse>(
      `${baseUrl}/api/project`
    );
    return data?.project;
  },
  getMembers: async ({ project_id }: { project_id: number }) => {
    const { data } = await axios.get<GetProjectMembersResponse>(
      `${baseUrl}/api/project/${project_id}/members`
    );
    return data?.members;
  },
  updateMember: async (updatedData: any) => {
    const { data } = await axios.patch(`${baseUrl}/api/users`, updatedData, {
      headers: getHeaders(),
    });
    return data?.user;
  },
};
