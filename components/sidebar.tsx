"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CgGoogleTasks } from "react-icons/cg";
import {
  BacklogIcon,
  BoardIcon,
  BurndownIcon,
  DevelopmentIcon,
  ProjectsIcon,
  RoadmapIcon,
  TaskIcon,
  DocumentIcon,
  UsersIcon,
  VelocityIcon,
} from "./svgs";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { usePathname } from "next/navigation";
import { FaChessPawn, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useCookie } from "@/hooks/use-cookie";
import { useFiltersContext } from "@/context/use-filters-context";
import { SidebarSkeleton } from "./skeletons";

const STORAGE_KEY = "sidebarCollapsed";

const Sidebar: React.FC = () => {
  const user = useCookie("user");
  const project = useCookie("project");
  const pathname = usePathname();
  const [loading, setLoading] = useState(!project);
  const { assignees, setAssignees } = useFiltersContext();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "manager");

  useEffect(() => {
    if (project) {
      setLoading(false);
    }
  }, [project]);


  const toggleAssigneeFilter = () => {
    setAssignees(assignees.length === 0 ? [user.id] : []);
  };

  const planningItems = [
    {
      id: "roadmap",
      label: "Roadmap",
      icon: RoadmapIcon,
      href: `/${project?.key}/roadmap`,
    },
    {
      id: "backlog",
      label: "Backlog",
      icon: BacklogIcon,
      href: `/${project?.key}/backlog`,
    },
    {
      id: "board",
      label: "Board",
      icon: BoardIcon,
      href: `/${project?.key}/board`,
    },
    {
      id: "document",
      label: "Documents",
      icon: DocumentIcon,
      href: `/${project?.key}/document`,
    },
  ];

  const myWorkSpaceItems = [
    {
      id: "projects",
      label: "Projects",
      icon: ProjectsIcon,
      href: `/project`,
    },
  ];

  const configurationItems = [
    {
      id: "users",
      label: "Users",
      icon: UsersIcon,
      href: `/${project?.key}/users`,
    },
    {
      id: "settings",
      label: "Settings",
      icon: DevelopmentIcon,
      href: `/${project?.key}/settings`,
    },
  ].filter(Boolean);

  const reportingItems = [
    {
      id: "burndown",
      label: "Burndown Report",
      icon: BurndownIcon,
      href: `/${project?.key}/report/burndown`,
    },
    {
      id: "velocity",
      label: "Velocity Report",
      icon: VelocityIcon,
      href: `/${project?.key}/report/velocity`,
    },
  ];

  if (loading) {
    return <SidebarSkeleton />;
  }

  const sidebarWidth = isCollapsed && !isHovered ? "w-16" : "w-64";

  return (
    <div
      className={`relative flex h-full ${sidebarWidth} z-20 flex-col gap-y-3 bg-indigo-50 p-3 shadow-inner transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: isCollapsed ? "absolute" : "relative",
        height: "100vh",
      }}
    >
      <div
        className={`my-5 flex items-center border-b-2 pb-7 ${
          isCollapsed && !isHovered ? "justify-center px-0" : "gap-x-2 px-3"
        }`}
      >
        <div className="mt-1 flex items-center justify-center rounded-full bg-[#FF5630] p-1 text-xs font-bold text-white">
          <FaChessPawn className="aspect-square text-2xl" />
        </div>
        {(!isCollapsed || isHovered) && (
          <div className="transition-all duration-300">
            <h2 className="text-md -mb-[0.5px] whitespace-nowrap font-semibold text-black">
              {project?.name}
            </h2>
          </div>
        )}
      </div>

      <NavList
        label="PLANNING"
        items={planningItems}
        isCollapsed={isCollapsed}
        isHovered={isHovered}
      />
      <NavList
        label="MY WORKSPACE"
        items={myWorkSpaceItems}
        isCollapsed={isCollapsed}
        isHovered={isHovered}
      />

      {!pathname.includes("/users") && !pathname.includes("/project") && (
        <button
          onClick={toggleAssigneeFilter}
          className="flex items-center rounded-sm rounded-r-xl border-inherit bg-inherit px-2 py-2 hover:bg-slate-200"
        >
          <CgGoogleTasks className="h-[22px] w-6" />
          {(!isCollapsed || isHovered) && (
            <span className="ml-3 text-sm transition-all duration-300">
              {assignees.length === 0 ? "My Tasks" : "All Tasks"}
            </span>
          )}
        </button>
      )}

      {isAdminOrManager && (
        <NavList
          label="CONFIGURATION"
          items={configurationItems}
          isCollapsed={isCollapsed}
          isHovered={isHovered}
        />
      )}
      <NavList
        label="REPORTS"
        items={reportingItems}
        isCollapsed={isCollapsed}
        isHovered={isHovered}
      />
    </div>
  );
};

const NavList: React.FC<{
  items: NavItemType[];
  label: string;
  isCollapsed: boolean;
  isHovered: boolean;
}> = ({ items, label, isCollapsed, isHovered }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="flex flex-col gap-y-2">
      {(!isCollapsed || isHovered) && (
        <NavListHeader
          label={label}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      )}
      <NavigationMenu
        data-state={isVisible ? "open" : "closed"}
        className="hidden [&[data-state=open]]:block"
      >
        <NavigationMenuList>
          {items.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              isHovered={isHovered}
              disabled={label === "DEVELOPMENT"}
            />
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const NavListHeader: React.FC<{
  label: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ label, isVisible, setIsVisible }) => (
  <div className="group flex items-center gap-x-1">
    <button
      data-state={isVisible ? "open" : "closed"}
      onClick={() => setIsVisible(!isVisible)}
      className="invisible group-hover:visible [&[data-state=open]>svg]:rotate-90"
    >
      <FaChevronRight className="text-xs transition-transform" />
    </button>
    <span className="text-xs font-bold text-gray-700">{label}</span>
  </div>
);

const NavItem: React.FC<{
  item: NavItemType;
  disabled?: boolean;
  isCollapsed: boolean;
  isHovered: boolean;
}> = ({ item, disabled = false, isCollapsed, isHovered }) => {
  const currentPath = usePathname();

  if (disabled) {
    return (
      <div className="w-full rounded-lg text-gray-600 hover:cursor-not-allowed">
        <div className="flex items-center gap-x-3 border-l-4 border-transparent px-2 py-2">
          <item.icon />
          {(!isCollapsed || isHovered) && (
            <span className="text-sm">{item.label}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="w-full rounded-lg text-gray-600"
      passHref
      legacyBehavior
    >
      <NavigationMenuLink
        active={currentPath === item.href}
        className={`flex rounded-sm rounded-r-xl border-transparent py-2 hover:bg-slate-200 
          [&[data-active]]:rounded-r-xl [&[data-active]]:border-l-black [&[data-active]]:bg-slate-200 [&[data-active]]:text-black`}
      >
        <div
          className={`flex items-center gap-x-3 border-l-4 border-inherit bg-inherit px-2
          ${
            isCollapsed && !isHovered ? "justify-center border-l-0" : "w-full"
          }`}
        >
          <item.icon className="[&[data-active]]:text-blue-500" />
          {(!isCollapsed || isHovered) && (
            <span className="whitespace-nowrap text-sm">{item.label}</span>
          )}
        </div>
      </NavigationMenuLink>
    </Link>
  );
};

export { Sidebar };
