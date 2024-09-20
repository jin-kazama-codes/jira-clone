'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

const CreateProject: React.FC = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormData({
      name: '',
      key: '',
      description: '',
    })
    console.log('Form data:', formData);

    
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground text-lg">Fill out the form below to get started.</p>
        </div>
        <form onSubmit={handleSubmit} className="shadow-lg p-6 bg-white rounded-xl">
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter a descriptive name"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:border-primary focus:ring-primary"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="key" className="text-sm font-medium">
                Project Key
              </label>
              <input
                id="key"
                name="key"
                type="text"
                placeholder="Enter a unique key"
                className="border border-gray-300 rounded-xl px-3 py-2 focus:border-primary focus:ring-primary"
                onChange={handleChange}
                value={formData.key}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide a brief description"
                rows={3}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:border-primary focus:ring-primary"
                onChange={handleChange}
                value={formData.description}
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-black hover:!bg-slate-800 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
