'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useProject } from '@/hooks/query-hooks/use-project';

const Login: React.FC = () => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);

  // Check if the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("user:", response.data.user)

      if (response.status === 200 && isMounted) {
        let token = response.data.user;
        document.cookie = `user=${JSON.stringify(token)}; path=/; secure; SameSite=Strict`;
        // document.cookie = `project=${JSON.stringify(project)}; path=/; secure; SameSite=Strict`;
        // Redirect after successful login
        console.log("redirect to backlog");
        router.push('/project/backlog');
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.error || 'Login failed');
      } else {
        setError('An error occurred during login');
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
          <h1 className="text-3xl font-bold tracking-tight">Login to Continue</h1>
          <p className="text-muted-foreground text-lg">Fill out the form below to get started.</p>
        </div>
        <form onSubmit={handleSubmit} className="shadow-lg p-6 mt-5 bg-white rounded-xl">
          <div className="grid gap-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter your email"
                className="border border-gray-300 mt-3 rounded-xl px-3 py-2 focus:border-primary focus:ring-primary"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="border border-gray-300 mt-3 rounded-xl px-3 py-2 focus:border-primary focus:ring-primary"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
