import { projectRoutes } from "./project";
import { issuesRoutes } from "./issues";
import { sprintsRoutes } from "./sprints";
import { documentsRoutes } from "./document";
import { workflowRoutes } from "./workflow";
import { companyRoutes } from "./company";
import { adminRoutes } from "./admin";
import { WorklogRoutes } from "./worklog";

export const api = {
  project: projectRoutes,
  issues: issuesRoutes,
  sprints: sprintsRoutes,
  document: documentsRoutes,
  workflow: workflowRoutes,
  company: companyRoutes,
  admin: adminRoutes,
  worklog: WorklogRoutes
};
