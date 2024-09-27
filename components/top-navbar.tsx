"use client";
import Image from "next/image";

import { useFullURL } from "@/hooks/use-full-url";
import Link from "next/link";
import { useCookie } from "@/hooks/use-cookie";

const TopNavbar: React.FC = () => {
  const user = useCookie('user');
  const [url] = useFullURL();

  function handleLogout() {
    // Clear all cookies by setting their expiration date to the past
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
    });
  }

  return (
    <div className="flex h-12 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src="https://cdn.worldvectorlogo.com/logos/jira-3.svg"
          alt="Jira logo"
          width={25}
          height={25}
        />
        <span className="text-sm font-medium text-gray-600">F2 - Fintech</span>
        <Link
          href={"/project/create"}
          className="ml-5 rounded-xl !bg-black px-2 py-1 !text-white hover:!bg-slate-700"
        >
          <span className="whitespace-nowrap text-sm text-white">
            Create Project
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-x-5">
      {user ? (
        <div className="flex items-center gap-x-2">
          <span className="text-sm font-medium text-gray-600">
            {user?.name ?? user?.email ?? "Guest"}
          </span>
          {/* <UserButton afterSignOutUrl="/" /> */}
        </div>
      ) : (
        <div className="flex items-center gap-x-3">
          <div className="rounded-sm bg-inprogress px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600">
            {/* <SignInButton mode="modal" redirectUrl={url} /> */}
          </div>
        </div>
      )}
      {/* Logout Button  */}
      <button
      onClick={handleLogout}
      className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl ring-offset-background bg-red-500 text-white hover:bg-red-600 h-8 py-2 px-4"
    >
      Logout
    </button>
    </div>
    </div>
  );
};

export { TopNavbar };
