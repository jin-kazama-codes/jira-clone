"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setCookie } from "@/utils/helpers";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";

const Login: React.FC = () => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);

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
    setLoading(true);
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
        setLoading(false);
        setError(response.data.error || "Login failed");
      }
    } catch (error: any) {
      setLoading(false);
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
    <div
      style={{
        background: 'linear-gradient(125deg, #ECFCFF 0%, #ECFCFF 40%, #B2FCFF calc(40% + 1px), #B2FCFF 60%, #3E64FF calc(60% + 1px), #3E64FF 72%, #5EDFFF calc(72% + 1px),#5EDFFF  100%)'
      }}
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div
        style={{
          background: " #3E64FF",
          boxShadow: '0px 0px 24px rgb(92, 86, 150)'
        }}
        className="w-full max-w-md rounded-2xl overflow-hidden">
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="relative text-center  p-8 min-w-screen flex items-center justify-center">
            {/* Content */}
            <div className="relative z-10">
              <h1
                className="text-3xl text-white font-bold tracking-tight">
                Login to Continue
              </h1>
              <p className="text-lg text-blue-100 opacity-90 mt-2">
                Fill out the form below to get started.
              </p>
            </div>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit}
            style={{
              background: " #5EDFFF"
            }}
            className="  px-8 pt-10 rounded-t-3xl pb-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-blue-300 border-opacity-50  text-black placeholder-gray-600 focus:outline-none  focus:ring-blue-300 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 border-opacity-50  text-black placeholder-gray-600 focus:outline-none  focus:ring-blue-300 focus:border-transparent transition duration-200 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute text-gray-500 right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible className="text-xl" />
                  ) : (
                    <AiFillEye className="text-xl" />
                  )}

                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <p
              className="text-gray-800 hover:text-gray-900 mt-2 hover:underline cursor-pointer"
              onClick={() => {
                router.push("/forgot-password");
              }}
            >
              Forgot Password ?
            </p>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <div className="mt-4 flex justify-center">
              {Loading ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
              ) : (
                <button
                  type="submit"
                  disabled={Loading}
                  className="w-full py-3 border border-transparent rounded-xl shadow-sm text-lg  font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition duration-200 ease-in-out"
                >
                  Log in
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
