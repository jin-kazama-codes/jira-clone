"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useCookie } from "@/hooks/use-cookie";
import { useRouter } from "next/navigation";
import { setCookie } from "@/utils/helpers";

const UpdateProject: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    projectId: "",
    name: "",
    cloneChild: false,
  });
  const router = useRouter()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const projectId = useCookie("project").id;
    const name = useCookie("project").name;
    const cloneChild = useCookie("project").cloneChild;
    if (projectId && name) {
      setFormData((prevData) => ({
        ...prevData,
        projectId,
        name,
        cloneChild,
      }));
    } else {
      setError("Project not found in cookies");
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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
        // Redirect after successful update
        const updatedProject = response.data.project;
        setCookie("project", {
          id: updatedProject.id,
          name: updatedProject.name,
          cloneChild: updatedProject.cloneChild,
          key: updatedProject.key
        });
        router.push("/project/backlog");
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
    return null; // Prevent rendering the component until fully mounted
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Update Project</h1>
          <p className="text-muted-foreground text-lg">
            Enter the new project name below.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-xl bg-white p-6 shadow-lg"
        >
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium">
                New Project Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter new project name"
                className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 px-3 py-2"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </div>

            {/* New Checkbox for cloneChild */}
            <div className="mt-2 flex items-center space-x-2">
              <input
                id="cloneChild"
                name="cloneChild"
                type="checkbox"
                className="h-5 w-5"
                checked={formData.cloneChild}
                onChange={handleChange}
              />
              <label htmlFor="cloneChild" className="text-sm font-medium">
                Clone Child Issues
              </label>
            </div>
          </div>

          {error && <p className="mt-2 text-red-500">{error}</p>}
          <div className="mt-4 flex justify-end">
            {loading ? (
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black"></div>
            ) : (
              <button
                type="submit"
                className="focus:ring-primary rounded-xl bg-black px-4 py-2 text-white hover:bg-slate-800 focus:outline-none focus:ring-2"
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

export default UpdateProject;
