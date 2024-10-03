"use client";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { FiltersProvider } from "@/context/use-filters-context";
import { Fragment } from "react";
import { usePathname } from "next/navigation";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const hideSidebar = pathname === "/project/create" || pathname === "/project";

  return (
    <Fragment>
      <TopNavbar />
      <main className="flex h-[calc(100vh_-_3rem)] w-full">
        {!hideSidebar && <Sidebar />}
        <FiltersProvider>
          <div
            className={`w-full ${
              !hideSidebar ? "max-w-[calc(100vw_-_16rem)]" : "max-w-full"
            }`}
          >
            {children}
          </div>
        </FiltersProvider>
      </main>
    </Fragment>
  );
};

export default ProjectLayout;
