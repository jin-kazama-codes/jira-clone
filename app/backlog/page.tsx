import { type Metadata } from "next";
import { Backlog } from "@/components/backlog";
import { getQueryClient } from "@/utils/get-query-client";
import { dehydrate } from "@tanstack/query-core";
import { Hydrate } from "@/utils/hydrate";

import { parsePageCookies } from "@/utils/cookies";

export const metadata: Metadata = {
  title: "Backlog",
};

const BacklogPage = async () => {
  const PROJECT = parsePageCookies("project");

  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Backlog state={dehydratedState} project={PROJECT} />
    </Hydrate>
  );
};

export default BacklogPage;
