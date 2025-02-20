"use client";

import { removeCookie, setCookie } from "@/utils/helpers";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "../toast";
import { FaTrashAlt } from "react-icons/fa";
import { useCookie } from "@/hooks/use-cookie";
import { FaChevronRight, FaChevronLeft, FaSearch } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

type ProjectList = Project[];

interface ProjectListProps {
  projects: ProjectList;
  admin: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, admin }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const projectId = useCookie('Invited Project');
  const projectsPerPage = 6;
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries(); 
  }, []);

  const invitedProject = projects.find((project) => project.id === projectId);

  const handleProjectClick = (project: Project) => {
    setCookie("project", project);
    router.push(`/${project.key}/backlog`);
  };

  useEffect(() => {
    router.refresh();
    if (invitedProject) {
      handleProjectClick(invitedProject);
    }
    removeCookie('Invited Project');
  }, []);

  const handleDelete = async (e, projectId: number) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/project/${projectId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data);
        setShowDeleteDialog(false);
        router.refresh();
      } else {
        toast.error(data);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error({
        message: "Something went wrong!",
        description: "An error occurred while deleting project"
      });
      setShowDeleteDialog(false);
    }
  };

  const openDeleteDialog = (e, project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  // Filter and sort projects
  const filteredAndSortedProjects = [...projects]
    .filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredAndSortedProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredAndSortedProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="rounded-xl border bg-white pb-2 dark:bg-darkSprint-20 dark:border-darkSprint-30">
      <div className="p-4 bg-header rounded-t-xl dark:bg-darkSprint-10">
        <h2 className="text-center text-2xl font-semibold text-white dark:text-dark-50 mb-3">Project List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white dark:placeholder:text-darkSprint-50 dark:text-white border dark:bg-darkSprint-30 dark:border-darkSprint-20 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      <div className="h-auto overflow-y-auto mb-2">
        <div className="p-4">
          {currentProjects.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-dark-50 py-8">
              No projects found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`group flex cursor-pointer items-center dark:bg-darkButton-30 dark:border-darkButton-0 ${
                    admin ? "justify-between" : "justify-center"
                  } rounded-xl bg-gray-200 p-3 shadow-sm transition-shadow hover:shadow-md`}
                >
                  <div className="text-sm text-gray-700 font-medium dark:text-dark-50">{project.name}</div>
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
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 ">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 hover:dark:text-white hover:dark:bg-darkSprint-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === pageNum
                  ? "bg-header dark:bg-darkSprint-10 text-white"
                  : "hover:bg-gray-100 hover:dark:text-white hover:dark:bg-darkSprint-10"
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 hover:dark:text-white hover:dark:bg-darkSprint-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-header">
            <h3 className="mb-4 text-lg font-semibold text-white pl-4 py-4">Delete Project</h3>
            <div className="bg-white p-6 rounded-lg">
              <p className="mb-6">
                Are you sure you want to delete <span>{projectToDelete.name}</span>? This action cannot be undone.
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
                  className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;