"use client";
import React, { Fragment, useLayoutEffect } from "react";
import { useCookie } from "@/hooks/use-cookie";
import "@/styles/split.css";
import { VelocityHeader } from "./header";
import VelocityChart from "./chart";

const Velocity: React.FC = () => {
  const project = useCookie("project");
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!project) return null;
  return (
    <Fragment>
      <VelocityHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max">
        <VelocityChart />
      </div>
    </Fragment>
  );
};

export { Velocity };
