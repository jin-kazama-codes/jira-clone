'use client';
import { useWorkflow } from '@/hooks/query-hooks/use-workflow';
import { useCookie } from '@/hooks/use-cookie';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, FormEvent } from 'react';

const CreateProject: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = String(useCookie('user').id);
    const { name, key } = formData

    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          key,
          userId,
        }),
      });

      if (response.ok) {
        setFormData({
          name: '',
          key: '',
        });
        setError(null);
        setSuccess("Project Created Successfully");
        router.refresh();
      } else {
        setError('Failed to create project');
        setSuccess(null);
      }
    } catch (err) {
      setError('An error occurred');
      setSuccess(null);
    }
  };

  return (
    <div

      className="bg-white border rounded-xl">
      <div
        className="p-4 bg-header rounded-t-xl border-b">
        <h2 className="text-2xl text-white font-semibold text-center">Create New Project</h2>
      </div>
      <div className="p-4 bg-white rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-gray-700 font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full border border-gray-300 placeholder-gray-600 bg-gray-200 rounded-xl px-3 py-2 text-sm"
              placeholder="Enter a descriptive name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Project Key Field */}
          <div className="space-y-2">
            <label htmlFor="key" className="text-sm text-gray-700 font-medium">
              Key
            </label>
            <input
              id="key"
              name="key"
              type="text"
              className="w-full border border-gray-300 placeholder-gray-600 bg-gray-200 rounded-xl px-3 py-2 text-sm"
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
            className="w-full py-3 border border-transparent rounded-xl shadow-sm text-lg  font-medium text-white bg-button hover:bg-buttonHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition duration-200 ease-in-out">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
