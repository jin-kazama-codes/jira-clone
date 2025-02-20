"use client";
import React from "react";
import { type Project } from "@prisma/client";

const VelocityHeader: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500 dark:text-dark-0">Projects / {project.name} / Velocity</div>
      <h1 className="mt-2 dark:text-dark-50">Velocity report</h1>
    </div>
  );
};

export { VelocityHeader };
