"use client";

import { removeCookie, setCookie } from "@/utils/helpers";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "../toast";
import { FaTrashAlt } from "react-icons/fa";
import { useCookie } from "@/hooks/use-cookie";

type ProjectList = Project[];

interface ProjectListProps {
  projects: ProjectList; // The type of projectList is now an array of Project objects
  admin: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, admin }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const projectId = useCookie('Invited Project')

  const invitedProject = projects.find((project) => project.id === projectId)


  const handleProjectClick = (project: Project) => {
    setCookie("project", project);
    router.push(`/${project.key}/backlog`);
  };

  useEffect(() => {
    router.refresh();
    if(invitedProject){
      handleProjectClick(invitedProject)
    }
    removeCookie('Invited Project')
  }, []); // Add an empty dependency array to refresh only on mount

  const handleDelete = async (e, projectId: number) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/project/${projectId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data); // Show success toast
        setShowDeleteDialog(false);
      } else {
        toast.error(data); // Show error toast if project has active issues
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error({ message: "Something went wrong!",
        description: "An error occured while deleting project"
       }); // Pass a string, not an object
      setShowDeleteDialog(false);
    }
  };

  const openDeleteDialog = (e, project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

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
              className={`group flex cursor-pointer items-center ${
                admin ? "justify-between" : "justify-center"
              }  rounded-xl bg-gray-100 p-3 shadow-sm transition-shadow hover:shadow-md`}
            >
              <div className={`text-sm font-medium`}>{project.name}</div>
              {admin && (
                <button
                  className="rounded-full p-2 text-red-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                  onClick={(e) => openDeleteDialog(e, project)}
                >
                  <FaTrashAlt className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Delete Project</h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="">{projectToDelete.name}
              </span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={(e) => handleDelete(e, projectToDelete.id)}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
