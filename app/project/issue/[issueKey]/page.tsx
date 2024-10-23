import { IssueDetails } from "@/components/issue/issue-details";
import React from "react";

const IssueDetail = ({params}) => {
  const { issueKey } = params;
  const largeSize = true;
  return <IssueDetails issueKey={issueKey} large={largeSize}/>;
};

export default IssueDetail;
