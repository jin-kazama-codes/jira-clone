"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useCookie } from "@/hooks/use-cookie";
import { useFiltersContext } from "@/context/use-filters-context";

const TopNavbar: React.FC = () => {
  const user = useCookie("user");
  const router = useRouter();
  const pathname = usePathname();
  const { assignees, setAssignees } = useFiltersContext();
  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "manager");

  const isOnProjectPage = pathname === "/project";
  const isOnUsersPage = pathname === "/project/users";

  function handleLogout() {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
    });
    router.push("/login");
    window.location.reload();
  }

  const filterAssignee = () => {
    setAssignees([user.id]);
  };

  const clearFilterAssignee = () => {
    setAssignees([]);
  };

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
      </div>
      <div className="flex items-center gap-x-5">
        {user ? (
          <div className="flex items-center gap-x-2">
            <span className="text-sm font-medium text-gray-600">
              {user?.name ?? user?.email ?? "Guest"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-x-3">
            <div className="rounded-sm bg-inprogress px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600">
              {/* SignIn button placeholder */}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="focus-visible:ring-ring ring-offset-background inline-flex h-8 items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export { TopNavbar };
