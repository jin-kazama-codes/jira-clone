import React from "react";
import Link from "next/link";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold drop-shadow-md">404</h1>
        <h2 className="mt-6 text-4xl font-semibold drop-shadow-lg">
          Uh-oh! You seem lost.
        </h2>
        <p className="mt-4 text-lg text-gray-200">
          The page you are looking for doesn’t exist or has been moved.
        </p>
      </div>

      <div className="mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-64 w-64 animate-bounce"
          fill="currentColor"
        >
          <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zM216 344c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm128 0c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm-64-56c-8.8 0-16-7.2-16-16V160c0-8.8 7.2-16 16-16s16 7.2 16 16v112c0 8.8-7.2 16-16 16z" />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;
