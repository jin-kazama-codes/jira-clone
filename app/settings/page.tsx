"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useCookie } from "@/hooks/use-cookie";
import { useRouter } from "next/navigation";
import { setCookie } from "@/utils/helpers";
import withProjectLayout from "@/app/project-layout/withProjectLayout";
import Link from "next/link";

const UpdateProject: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    cloneChild: false,
    workingDays: 5, // Default to 5 working days, stored as an integer
    showAssignedTasks: false,
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const projectId = useCookie("project").id;
    const name = useCookie("project").name;
    const cloneChild = useCookie("project").cloneChild;
    const { showAssignedTasks } = useCookie("project");
    const workingDays = parseInt(useCookie("project").workingDays, 10) || 5;
    if (projectId && name) {
      setFormData((prevData) => ({
        ...prevData,
        projectId,
        name,
        cloneChild,
        workingDays,
        showAssignedTasks,
      }));
    } else {
      setError("Project not found in cookies");
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "workingDays"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && isMounted) {
        const updatedProject = response.data.project;
        setCookie("project", {
          id: updatedProject.id,
          name: updatedProject.name,
          cloneChild: updatedProject.cloneChild,
          workingDays: updatedProject.workingDays,
          key: updatedProject.key,
          showAssignedTasks: updatedProject.showAssignedTasks,
        });
        router.push("/backlog");
      } else {
        setLoading(false);
        setError(response.data.error || "Update failed");
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.error || "Update failed");
      } else {
        setError("An error occurred during the update");
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto my-12 max-w-md rounded-xl bg-header dark:bg-darkSprint-10">
      <div className=" my-5">
        <div className="rounded-t-xl py-5 text-center ">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Update Project
          </h1>
          <p className="text-muted-foreground text-lg text-white">
            Enter the new project details below.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 pt-5 shadow-lg dark:bg-darkSprint-20"
        >
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium dark:text-dark-50"
              >
                New Project Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter new project name"
                className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 bg-gray-200 px-3 py-2 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </div>

            {/* New Checkbox for cloneChild */}
            <div className="mt-2 flex justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="cloneChild"
                  name="cloneChild"
                  type="checkbox"
                  className="h-5 w-5"
                  checked={formData.cloneChild}
                  onChange={handleChange}
                />
                <label
                  htmlFor="cloneChild"
                  className="text-sm font-medium dark:text-dark-50"
                >
                  Clone Child Issues
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="showAssignedTasks"
                  name="showAssignedTasks"
                  type="checkbox"
                  className="h-5 w-5"
                  checked={formData.showAssignedTasks}
                  onChange={handleChange}
                />
                <label
                  htmlFor="showAssignedTasks"
                  className="text-sm font-medium dark:text-dark-50"
                >
                  Show Only Assigned Tasks
                </label>
              </div>
            </div>

            {/* New Select for Working Days */}
            <div className="mt-2 flex flex-col">
              <label
                htmlFor="workingDays"
                className="text-sm font-medium dark:text-dark-50"
              >
                Working Days
              </label>
              <select
                id="workingDays"
                name="workingDays"
                className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 bg-gray-200 px-3 py-2 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                onChange={handleChange}
                value={formData.workingDays}
              >
                <option value={5}>5 Days</option>
                <option value={6}>6 Days</option>
              </select>
            </div>
          </div>

          {error && <p className="mt-2 text-red-500">{error}</p>}
          <div className="mt-4 flex gap-x-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/workflow");
              }}
              className="mt-2 flex-1 rounded-xl border border-button bg-transparent py-3 text-lg font-medium text-button shadow-sm transition duration-200 ease-in-out hover:border-buttonHover hover:text-buttonHover focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 dark:border-2 dark:border-dark-0 dark:text-dark-0"
            >
              View Workflow
            </button>

            {loading ? (
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black"></div>
            ) : (
              <button
                type="submit"
                className="flex-1 rounded-xl border border-transparent bg-button py-2 text-lg font-medium text-white shadow-sm transition duration-200 ease-in-out hover:bg-buttonHover focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 dark:!bg-dark-0"
              >
                Update Project
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default withProjectLayout(UpdateProject);
