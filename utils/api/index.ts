import { projectRoutes } from "./project";
import { issuesRoutes } from "./issues";
import { sprintsRoutes } from "./sprints";
import { documentsRoutes } from "./document";
import { workflowRoutes } from "./workflow";

export const api = {
  project: projectRoutes,
  issues: issuesRoutes,
  sprints: sprintsRoutes,
  document: documentsRoutes,
  workflow: workflowRoutes,
};
