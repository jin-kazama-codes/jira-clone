"use client";

import { setCookie } from "@/utils/helpers";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ProjectList = Project[];

interface ProjectListProps {
  projects: ProjectList; // The type of projectList is now an array of Project objects
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const router = useRouter();

  const handleProjectClick = (project: Project) => {
    setCookie("project", project);
    router.push("/project/backlog");
  };

  useEffect(() => {
    router.refresh();
  }, [])

  return (
    <div className="rounded-xl border bg-white pb-5">
      <div className="p-4 ">
        <h2 className="text-center text-2xl font-semibold">Projects List</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="flex cursor-pointer items-center justify-center rounded-xl bg-gray-100 p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-sm font-medium">{project.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
