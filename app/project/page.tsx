import CreateProject from "./create/page";
import { type Project } from "@prisma/client";
import { parsePageCookies } from "@/utils/cookies";
import ProjectList from "@/components/project/project-list";
import { prisma } from "@/server/db";

const Project: React.FC = async () => {
  const user = parsePageCookies("user");
  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "manager");

  // Single query to get both member and project data
  const projects = await prisma.project.findMany({
    where: isAdminOrManager ? {} : { members: { some: { id: user.id } } },
    include: { members: true }
  });

  return (
    <>
      <div className="container h-screen mx-auto py-16">
        <div
          className={`grid gap-6 ${isAdminOrManager ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
        >
          {/* Left: Project List */}
          {projects && (
            <div className={isAdminOrManager ? "lg:col-span-1 " : "col-span-1"}>
              <ProjectList projects={projects} admin={isAdminOrManager} />
            </div>
          )}
          {/* Right: Create Project Form */}
          {isAdminOrManager && (
            <div className="lg:col-span-1">
              <CreateProject />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Project;
