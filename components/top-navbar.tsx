"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCookie } from "@/hooks/use-cookie";
import React, { useState, useRef, useEffect } from "react";
import AccountSettingsModal from "./modals/account-settings";
import { IoIosSettings } from "react-icons/io";

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
  const [logo, setLogo] = useState("");
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/account");
        if (response.ok) {
          const result = await response.json();
          setLogo(result.account.logo)
        } else {
          console.error("Failed to fetch Logo");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchLogo();
  }, []);

  return (
    <div className="flex  h-12 w-full items-center justify-between border-b bg-header px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src={logo ? logo : 'https://cdn.worldvectorlogo.com/logos/jira-3.svg'}
          alt="Karya logo"
          width={25}
          height={25}
        />
        <span className="text-xl font-medium text-white">Karya - IO</span>
      </div>

      <div className="relative flex items-center gap-x-5">
        {(user?.role === "admin" || user?.role === "manager") && (
          <AccountSettingsModal>
            <button>
              <IoIosSettings className="text-white" size={20} />
            </button>
          </AccountSettingsModal>
        )}
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
            className="absolute right-0  top-11 z-10  w-80 rounded-md border border-gray-300 bg-white pt-2 shadow-lg"
            ref={dropdownRef}
          >
            <p className="mt-4 px-6  font-bold  ">Account</p>

            <div className="flex px-4  pt-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
                style={{
                  backgroundColor: user.id
                    ? getColorFromLocalStorage(user.id)
                    : getColorFromLocalStorage(unassigned.id),
                }}
              >
                <span className="font-bold text-white">
                  {user.name
                    ? getInitials(user.name)
                    : getInitials(unassigned.name)}
                </span>
              </div>
              <div className="px-4 ">
                <p className="  text-sm font-medium text-gray-700">
                  {user.name}
                </p>
                <p className="  text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <hr className="mt-5" />
            <button
              className="w-full  px-5 py-3 text-left text-sm text-gray-600 hover:bg-slate-200"
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
