import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import Workflow from "@/components/workflow";
import withProjectLayout from "../project-layout/withProjectLayout";


export const metadata: Metadata = {
  title: "Workflow",
};

const WorkflowPage = () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Workflow />
    </Hydrate>
  );
};

export default withProjectLayout(WorkflowPage);
