"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { setCookie } from "@/utils/helpers";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Image from "next/image";
"public/images/karya-io-logo.png"

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

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const redirectPath = searchParams.get("redirect");

  useEffect(() => {
    setIsMounted(true);
    // Verify token on component mount if token is present
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch("/api/auth/verify-login-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
          const data = await response.json();

          if (response.ok) {
            setCookie("Invited Project", data.projectId);
          } else {
            setError("This reset link is invalid or has expired");
          }
        } catch (err) {
          setError("Error verifying reset link");
        }
      }
    };

    verifyToken();
    if (redirectPath) {
      router.push(redirectPath || "/");
    }
  }, [token]);

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
        console.log("token", token)
        if(token.role === "superAdmin"){
          router.push('/admin')
        }else{
          router.push("/project");
        }
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
    <div className="flex min-h-screen items-center dark:bg-darkSprint-0 justify-center p-4">
      <div
        style={{
          boxShadow: "0px 0px 35px 0px rgba(113,114,122,1)",
        }}
        className="w-full max-w-md overflow-hidden rounded-2xl dark:bg-darkSprint-20 bg-header"
      >
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="min-w-screen relative  flex items-center justify-center dark:bg-darkSprint-10 p-8 text-center">
            {/* Content */}

            <div className="relative z-10 ">
              <div className="flex items-center gap-x-2">
                <Image
                  src="/images/karya-io-logo.png"
                  alt="Karya logo"
                  width={30}
                  height={40}
                  style={{ width: '40px', height: '40px' }}
                />
                <h1 className="text-3xl font-bold text-white">Karya.io</h1>
              </div>
              <p className="text-base text-white opacity-90 mt-2">
                Login to Continue
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="  space-y-6 rounded-t-3xl dark:bg-darkSprint-20 bg-white px-8 pb-8 pt-10"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium dark:text-dark-50 text-gray-800"
              >
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
                className="w-full px-4 py-3 dark:bg-darkSprint-30 dark:border-darkSprint-20 dark:placeholder:text-darkSprint-50 dark:text-white bg-gray-200 rounded-xl border border-blue-300 border-opacity-50  text-black placeholder-gray-600 focus:outline-none  focus:ring-blue-300 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-dark-50"
              >
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
                  className="w-full px-4 py-3 dark:bg-darkSprint-30 dark:border-darkSprint-20 dark:placeholder:text-darkSprint-50 dark:text-white bg-gray-200 rounded-xl border border-blue-300 border-opacity-50  text-black placeholder-gray-700 focus:outline-none  focus:ring-blue-300 focus:border-transparent transition duration-200 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
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
              className="mt-2 cursor-pointer dark:text-dark-50 text-gray-800 hover:text-gray-900 hover:underline"
              onClick={() => {
                router.push("/forgot-password");
              }}
            >
              Forgot Password ?
            </p>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit Button */}
            <div className="mt-4 flex justify-center">
              {Loading ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
              ) : (
                <button
                  type="submit"
                  disabled={Loading}
                  className="w-full rounded-xl border border-transparent dark:bg-dark-0 bg-button py-3 text-lg  font-medium text-white shadow-sm transition duration-200 ease-in-out hover:bg-buttonHover focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
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
