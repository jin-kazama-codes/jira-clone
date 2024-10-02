import { Board } from "@/components/board";
import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import {
  getInitialIssuesFromServer,
  getInitialProjectFromServer,
  getInitialSprintsFromServer,
} from "@/server/functions";

export const metadata: Metadata = {
  title: "Board",
};

const BoardPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    await queryClient.prefetchQuery(["project"], getInitialProjectFromServer),
    await queryClient.prefetchQuery(["issues"], async () => {
      const { id: projectId } = await queryClient.getQueryData(["project"]);
      return getInitialIssuesFromServer(projectId);
    }),
    await queryClient.prefetchQuery(["sprints"], async () => {
      const { id: projectId } = await queryClient.getQueryData(["project"]);
      return getInitialSprintsFromServer(projectId);
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Board />
    </Hydrate>
  );
};

export default BoardPage;
