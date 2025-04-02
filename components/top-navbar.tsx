"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCookie } from "@/hooks/use-cookie";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-button";
import { useCompany } from "@/hooks/query-hooks/use-company";
"public/images/karya-io-logo.png"

const TopNavbar: React.FC = () => {
  const user = useCookie("user");
  const companyId = useCookie("user").companyId;
  const { company, companyLoading } =
    useCompany(companyId);
  const router = useRouter();
  const unassigned = {
    id: "unassigned",
    name: "Unassigned",
    avatar: undefined,
    email: "",
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [companyName, setCompanyName] = useState('Karya.io');
  const [logo, setLogo] = useState("");
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const isSuperAdmin = user.role === "superAdmin"
  const isAdminOrManager =
    user && (user.role === "admin");
  const isProMember = company?.proMember
  const isOnTrial = company?.subscriptionType === "Trial"

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = () => {
    if(isSuperAdmin){
      return;
    }
    router.push('/project'); // Navigate to the home page
  };

  useEffect(() => {
    if(company){
      setLogo(company.logo)
      if(isProMember || isOnTrial){
        setCompanyName(company.name)
      }
    }
  }, [company]);

  return (
    <div className="flex bg-indigo-50 dark:bg-darkSprint-10 h-12 w-full items-center justify-between border-b dark:border-b-darkSprint-30  px-4">
      <button
        onClick={handleNavigation}
        className="flex items-center gap-x-1">
        <Image
          src={logo ? logo : "/images/karya-io-logo.png"}
          alt="Karya logo"
          width={30}
          height={30}
        />
        <span className="text-xl font-medium text-gray-700 dark:text-dark-50">{companyName}</span>
      </button>

      <div className="relative flex items-center gap-x-5">
        <div className="m-2">
        <ThemeToggle />
        </div>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
          style={{
            backgroundColor: user.id
              ? getColorFromLocalStorage(user.id)
              : getColorFromLocalStorage(unassigned.id),
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
            className="absolute right-0  top-11 z-20  w-80 rounded-md dark:bg-darkSprint-20 dark:text-dark-50  dark:border-darkSprint-30 border border-gray-300 bg-white pt-2 shadow-lg"
            ref={dropdownRef}
          >
            <p className="mt-4 px-6  font-bold">Account</p>

            <div className="flex px-4  pt-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
                style={{
                  backgroundColor: user.id
                    ? getColorFromLocalStorage(user.id)
                    : getColorFromLocalStorage(unassigned.id),
                }}
              >
                <span className="font-bold text-white ">
                  {user.name
                    ? getInitials(user.name)
                    : getInitials(unassigned.name)}
                </span>
              </div>
              <div className="px-4 ">
                <p className="  text-sm font-medium text-gray-700 dark:text-white">
                  {user.name}
                </p>
                <p className="  text-sm text-gray-500 dark:text-white ">{user.email}</p>
              </div>
            </div>
            <hr className="mt-5" />
            {!isSuperAdmin && isAdminOrManager && (<button
              className="w-full  px-5 py-3 text-left text-sm dark:text-dark-50  text-gray-600 dark:hover:text-white dark:hover:bg-darkSprint-30 hover:bg-slate-200"
            >
              <Link className="w-full " href={'/organization/profile'}>
                Organization settings
              </Link>
            </button>)}
            <button
              className="w-full  px-5 py-3 text-left text-sm dark:text-dark-50 dark:hover:bg-darkSprint-30 dark:hover:text-white  text-gray-600 hover:bg-slate-200"
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
