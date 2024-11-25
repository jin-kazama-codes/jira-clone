// app/project-layout/layout.tsx
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
            <FiltersProvider>
                <TopNavbar />
                <main className="flex h-auto w-full">
                    {!hideSidebar && <Sidebar />}
                    <div
                        className={`w-full h-screen ${!hideSidebar ? "max-w-[calc(100vw_-_16rem)]" : "max-w-full"
                            }`}
                    >
                        {children}
                    </div>
                </main>
            </FiltersProvider>
        </Fragment>
    );
};

export default ProjectLayout;
