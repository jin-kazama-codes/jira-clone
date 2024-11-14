"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCookie } from "@/hooks/use-cookie";
import React, { useState, useRef, useEffect } from 'react';

const TopNavbar: React.FC = () => {
  const user = useCookie("user");
  const router = useRouter();
  const unassigned = {
    id: "unassigned",
    name: "Unassigned",
    avatar: undefined,
    email: "",
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);



  function getInitials(name: string) {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.toUpperCase();
  }
  function getColorFromLocalStorage(memberId: string | number) {
    const savedColorMap = JSON.parse(localStorage.getItem("colorMap")) || {};
    return savedColorMap[memberId] || "#ccc";
  }


  function handleLogout() {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
    });
    router.push("/login");
    window.location.reload();
  }




  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <div className="flex h-12 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src="https://cdn.worldvectorlogo.com/logos/jira-3.svg"
          alt="Karya logo"
          width={25}
          height={25}
        />
        <span className="text-sm font-medium text-gray-600">Karya - IO</span>
      </div>

      <div className="relative flex items-center gap-x-5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
          style={{
            backgroundColor: user.id ? getColorFromLocalStorage(user.id) : getColorFromLocalStorage(unassigned.id),
          }}
          onClick={toggleDropdown}
          ref={dropdownRef}
        >
          <button className="font-bold text-white">
            {user.name ? getInitials(user.name) : getInitials(unassigned.name)}
          </button>
        </div>

        {showDropdown && (
          <div
            className="absolute right-0  top-11 w-80  bg-white rounded-md shadow-lg pt-2 z-10 border border-gray-300"
            ref={dropdownRef}
          >
            <p className="font-bold px-6  mt-4  ">Account</p>

            <div className="flex px-4  pt-3">

              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
                style={{
                  backgroundColor: user.id ? getColorFromLocalStorage(user.id) : getColorFromLocalStorage(unassigned.id),
                }}
              >
                <span className="font-bold text-white">
                  {user.name ? getInitials(user.name) : getInitials(unassigned.name)}
                </span>
              </div>
              <div className="px-4 ">
                <p className="  text-sm font-medium text-gray-700">{user.name}</p>
                <p className="  text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <hr className="mt-5" />
            <button
              className="w-full  px-5 py-3 text-sm text-left text-gray-600 hover:bg-slate-200"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export { TopNavbar };
