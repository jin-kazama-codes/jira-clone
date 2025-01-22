"use client";

import { useTheme } from "@/context/theme-context";
import { useState } from "react";
import { BsMoon, BsMoonFill, BsSun, BsSunFill } from "react-icons/bs";

export default function ThemeToggle() {
  const { toggleTheme, theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-10 w-10 rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {isDark ? (
          <>
            <BsSun
              className={`absolute text-orange-500 transition-all duration-300 ${
                isHovered ? "scale-50 opacity-0" : "scale-100 opacity-100"
              }`}
              size={20}
            />
            <BsSunFill
              className={`absolute text-orange-500 transition-all duration-300 ${
                isHovered ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
              size={20}
            />
          </>
        ) : (
          <>
            
            <BsMoon
              className={`absolute text-yellow-500 transition-all duration-300 ${
                isHovered ? "scale-50 opacity-0" : "scale-100 opacity-100"
              }`}
              size={20}
            />
            <BsMoonFill
              className={`absolute text-yellow-500 transition-all duration-300 ${
                isHovered ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
              size={20}
            />
          </>
        )}
      </div>
    </button>
  );
}
