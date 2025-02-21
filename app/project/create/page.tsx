"use client";
import { useWorkflow } from "@/hooks/query-hooks/use-workflow";
import { useCookie } from "@/hooks/use-cookie";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    key: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = String(useCookie("user").id);
    const { name, key } = formData;

    try {
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          key,
          userId,
        }),
      });

      const responseData = await response.json(); 

      if (response.ok) {
        setFormData({
          name: "",
          key: "",
        });
        setError(null);
        setSuccess("Project Created Successfully");
        router.refresh();
      } else {
        setError(responseData.error || "Failed to create project"); // Set error from backend
        setSuccess(null);
      }
    } catch (err) {
      setError("An error occurred");
      setSuccess(null);
    }
  };

  return (
    <div className="rounded-xl border bg-white dark:border-darkSprint-30 dark:bg-darkSprint-20">
      <div className="rounded-t-xl border-b bg-header p-4 dark:border-b-darkSprint-30 dark:bg-darkSprint-10 ">
        <h2 className="text-center text-2xl font-semibold text-white dark:text-dark-50">
          Create New Project
        </h2>
      </div>
      <div className="rounded-3xl bg-white p-4 dark:bg-darkSprint-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-dark-50"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-xl border border-gray-300 bg-gray-200 px-3 py-2 text-sm placeholder-gray-600 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
              placeholder="Enter a descriptive name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Project Key Field */}
          <div className="space-y-2">
            <label
              htmlFor="key"
              className="text-sm font-medium text-gray-700 dark:text-dark-50"
            >
              Key
            </label>
            <input
              id="key"
              name="key"
              type="text"
              className="w-full rounded-xl border border-gray-300 bg-gray-200 px-3 py-2 text-sm placeholder-gray-600 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
              placeholder="Enter a unique key"
              value={formData.key}
              onChange={handleChange}
              required
            />
          </div>

          {/* Display Error or Success Message */}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl border border-transparent bg-button py-3 text-lg font-medium  text-white shadow-sm transition duration-200 ease-in-out hover:bg-buttonHover focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 dark:bg-dark-0"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
