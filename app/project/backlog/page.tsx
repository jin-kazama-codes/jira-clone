import { Backlog } from "@/components/backlog";
import { type Metadata } from "next";
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
  const queryClient = getQueryClient();
  const user = parsePageCookies("user");
  const project = parsePageCookies("project");
  
  await Promise.all([
    await queryClient.prefetchQuery(["issues"], () =>
      getInitialIssuesFromServer(user?.id, project?.id)
    ),
    await queryClient.prefetchQuery(["sprints"], () =>
      getInitialSprintsFromServer(user?.id, project?.id)
    ),
    await queryClient.prefetchQuery(["project"], getInitialProjectFromServer),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Backlog />
    </Hydrate>
  );
};

export default BacklogPage;
