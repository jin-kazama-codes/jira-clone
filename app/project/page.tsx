import CreateProject from "./create/page";
import { type Project } from "@prisma/client";
import { parsePageCookies } from "@/utils/cookies";
import ProjectList from "@/components/project/project-list";
import { prisma } from "@/server/db";

const Project: React.FC = async () => {
  const user = parsePageCookies("user");
  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "manager");

  const members = await prisma.member.findMany({
    where: {
      id: user.id
    },
    select: {
      projectId: true // Only select the projectId field
    }
  });

  // Extract all projectIds from the members array
  const projectIds = members.map(member => member.projectId);
  const findManyProjects = isAdminOrManager ? {} : {
      where: {
        id: {
          in: projectIds  // Use `in` operator to match multiple projectIds
        }
      }
  }
  const projects = await prisma.project.findMany(findManyProjects);

  return (
    <>
      <div className="container mx-auto py-16">
        <div
          className={`grid gap-6 ${isAdminOrManager ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
        >
          {/* Left: Project List */}
          {projects && (
            <div className={isAdminOrManager ? "lg:col-span-1 " : "col-span-1"}>
              <ProjectList projects={projects} />
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
