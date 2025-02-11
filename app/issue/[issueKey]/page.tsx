import { IssueDetails } from "@/components/issue/issue-details";
import React from "react";

const IssueDetail = ({ params }) => {
  const { issueKey } = params;
  const issueDetailPage = true;
  return <IssueDetails issueKey={issueKey} detailPage={issueDetailPage}/>;
};

export default IssueDetail;
