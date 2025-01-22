import { type Metadata } from "next";
import { Backlog } from "@/components/backlog";
import { getQueryClient } from "@/utils/get-query-client";
import { dehydrate } from "@tanstack/query-core";
import { Hydrate } from "@/utils/hydrate";
import {
  getInitialIssuesFromServer,
  getInitialProjectFromServer,
  getInitialSprintsFromServer,
} from "@/server/functions";
import { parsePageCookies } from "@/utils/cookies";

export const metadata: Metadata = {
  title: "Backlog",
};

const BacklogPage = async () => {
  const PROJECT = parsePageCookies("project");

  const queryClient = getQueryClient();

  // await Promise.all([
  //   await queryClient.prefetchQuery(["issues"], getInitialIssuesFromServer),

  // await queryClient.prefetchQuery(["sprints"], getInitialSprintsFromServer),

  // await queryClient.prefetchQuery(["project"], getInitialProjectFromServer),
  // ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Backlog state={dehydratedState} project={PROJECT} />
    </Hydrate>
  );
};

export default BacklogPage;
