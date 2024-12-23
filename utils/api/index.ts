import { projectRoutes } from "./project";
import { issuesRoutes } from "./issues";
import { sprintsRoutes } from "./sprints";
import { documentsRoutes } from "./document";

export const api = {
  project: projectRoutes,
  issues: issuesRoutes,
  sprints: sprintsRoutes,
  document: documentsRoutes,
};
