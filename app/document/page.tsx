import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import Document from "@/components/document";


export const metadata: Metadata = {
  title: "Document",
};

const DocumentPage = async () => {
  const queryClient = getQueryClient();


  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Document />
    </Hydrate>
  );
};

export default DocumentPage;
