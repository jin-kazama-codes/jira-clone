// app/reset-password/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    // Verify token on component mount
    const verifyToken = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsValidToken(true);
        } else {
          setError("This reset link is invalid or has expired");
        }
      } catch (err) {
        setError("Error verifying reset link");
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful");
        // Redirect to login page after successful reset
        router.push("/login");
      } else {
        throw new Error(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (error && !isValidToken) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(125deg, #ECFCFF 0%, #ECFCFF 40%, #B2FCFF calc(40% + 1px), #B2FCFF 60%, #3E64FF calc(60% + 1px), #3E64FF 72%, #5EDFFF calc(72% + 1px),#5EDFFF  100%)",
      }}
      className="flex min-h-screen items-center justify-center  p-4"
    >
      <div
        style={{
          background: " #3E64FF",
          boxShadow: "0px 0px 24px rgb(92, 86, 150)",
        }}
        className="w-full max-w-md  overflow-hidden rounded-2xl"
      >
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="p-8  text-center text-white">
            <div className="  absolute inset-0 -z-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight">
                Reset Password
              </h1>
              <p className="mt-2 text-lg opacity-90">
                Please enter your new password
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: " #5EDFFF",
            }}
            className=" space-y-6 rounded-t-3xl px-8 pb-8 pt-10"
          >
            {/* New Password Field */}
            <div className="relative space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-800"
              >
                New Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="w-full rounded-xl border border-blue-300 border-opacity-50 px-4 py-3  text-black placeholder-gray-600 transition  duration-200 ease-in-out focus:border-transparent focus:outline-none focus:ring-blue-300"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="relative  space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-800"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-blue-300 border-opacity-50 px-4 py-3  text-black placeholder-gray-600 transition  duration-200 ease-in-out focus:border-transparent focus:outline-none focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 pt-3 text-gray-500"
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="text-xl" />
                ) : (
                  <AiFillEye className="text-xl" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit Button */}
            <div className="mt-4 flex justify-center">
              {loading ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isValidToken}
                  className="w-full rounded-xl border border-transparent bg-blue-700 py-3 text-lg  font-medium text-white shadow-sm transition duration-200 ease-in-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                >
                  Reset Password
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
