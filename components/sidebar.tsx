"use client";
import React, { useState } from "react";
import Link from "next/link";
import { BacklogIcon, BoardIcon, BurndownIcon, DevelopmentIcon, RoadmapIcon, VelocityIcon } from "./svgs";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { usePathname } from "next/navigation";
import { FaChessPawn, FaChevronRight } from "react-icons/fa";
import { useCookie } from "@/hooks/use-cookie";

type NavItemType = {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  href: string;
};

const Sidebar: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const project = useCookie("project");
  const planningItems = [
    {
      id: "roadmap",
      label: "Roadmap",
      icon: RoadmapIcon,
      href: `/project/roadmap`,
    },
    {
      id: "backlog",
      label: "Backlog",
      icon: BacklogIcon,
      href: `/project/backlog`,
    },
    {
      id: "board",
      label: "Board",
      icon: BoardIcon,
      href: `/project/board`,
    },
  ];

  const configurationItems = [
    {
      id: "settings",
      label: "Settings",
      icon: DevelopmentIcon,
      href: `/project/settings`,
    },
  ];

  const reportingItems = [
    {
      id: "burndown",
      label: "Burndown Report",
      icon: BurndownIcon,
      href: `/project/report/burndown`,
    },
    {
      id: "velocity",
      label: "Velocity Report",
      icon: VelocityIcon,
      href: `/project/report/velocity`,
    },
  ];


  return (
    <div className="flex h-full w-64 flex-col gap-y-5 bg-gray-50 p-3 shadow-inner">
      <div className="my-5 flex items-center gap-x-2 px-3 border-b-2 pb-7">
        <div className="mt-1 flex items-center justify-center rounded-full bg-[#FF5630] p-1 text-xs font-bold text-white">
          <FaChessPawn className="aspect-square text-2xl" />
        </div>
        <div>
          <h2 className="-mb-[0.5px] text-md font-semibold text-gray-600">
            {project?.name}
          </h2>
          <p className="text-xs text-gray-500">Task Management App</p>
        </div>
      </div>
      <NavList label={"PLANNING"} items={planningItems} />
      <NavList label={"CONFIGURATION"} items={configurationItems} />
      <NavList label={"REPORTS"} items={reportingItems} />
    </div>
  );
};

const NavList: React.FC<{ items: NavItemType[]; label: string }> = ({
  items,
  label,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="flex flex-col gap-y-2">
      <NavListHeader
        label={label}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <NavigationMenu
        data-state={isVisible ? "open" : "closed"}
        className="hidden [&[data-state=open]]:block"
      >
        <NavigationMenuList>
          {items.map((item) => (
            <NavItem
              key={item.id}
              item={item}
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

const NavItem: React.FC<{ item: NavItemType; disabled?: boolean }> = ({
  item,
  disabled = false,
}) => {
  const currentPath = usePathname();
  if (disabled) {
    return (
      <div className="w-full rounded-lg text-gray-600 hover:cursor-not-allowed">
        <div className="flex w-full items-center gap-x-3 border-l-4 border-transparent px-2 py-2">
          <item.icon />
          <span className="text-sm">{item.label}</span>
        </div>
      </div>
    );
  }
  return (
    <Link
      href={item.href}
      className="w-full rounded-lg text-gray-600 "
      passHref
      legacyBehavior
    >
      <NavigationMenuLink
        active={currentPath === item.href}
        className="flex w-full rounded-sm border-transparent rounded-r-xl [&[data-active]]:rounded-r-xl py-2 [&[data-active]]:border-l-black [&[data-active]]:bg-slate-200 [&[data-active]]:text-black hover:bg-slate-100"
      >
        <div className="flex w-full items-center gap-x-3 border-l-4 border-inherit bg-inherit px-2">
          <item.icon className="[&[data-active]]:text-blue-500"/>
          <span className="text-sm">{item.label}</span>
        </div>
      </NavigationMenuLink>
    </Link>
  );
};

export { Sidebar };
