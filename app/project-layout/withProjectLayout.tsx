// app/project-layout/withProjectLayout.tsx
import React from "react";
import ProjectLayout from "./layout";

const withProjectLayout = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return function WrappedWithLayout(props: P) {
    return (
      <ProjectLayout>
        <Component {...props} />
      </ProjectLayout>
    );
  };
};

export default withProjectLayout;
