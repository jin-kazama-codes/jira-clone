"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setCookie } from "@/utils/helpers";

const Login: React.FC = () => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  // Check if the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && isMounted) {
        let token = response.data.user;
        setCookie("user", token);
        // Redirect after successful login
        router.push("/project");
      } else {
        setError(response.data.error || "Login failed");
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.error || "Login failed");
      } else {
        setError("An error occurred during login");
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
          <h1 className="text-3xl font-bold tracking-tight">
            Login to Continue
          </h1>
          <p className="text-muted-foreground text-lg">
            Fill out the form below to get started.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-xl bg-white p-6 shadow-lg"
        >
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
                className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 px-3 py-2"
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
                className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 px-3 py-2"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="focus:ring-primary rounded-xl bg-black px-4 py-2 text-white hover:bg-slate-800 focus:outline-none focus:ring-2"
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
