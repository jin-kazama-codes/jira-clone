import { Fragment, useEffect, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { NotImplemented } from "@/components/not-implemented";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useWorkflow } from "@/hooks/query-hooks/use-workflow";
import { useRouter } from "next/navigation";


const IssueSelectStatus: React.FC<{
  currentStatus: string;
  issueId: string;
  variant?: "sm" | "lg";
  page?: string;
}> = ({ currentStatus, issueId, variant = "sm", page = "backlog" }) => {

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const { data: workflow, isLoading, isError } = useWorkflow()
    const [Statuses, setStatuses] = useState([])
    const router = useRouter()
    
    useEffect(() => {
      if(workflow){
        const labels = workflow.nodes.map(node => node.data.label);
        setStatuses(labels)
      }
    }, [workflow])

  const { updateIssue, isUpdating } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();


  function handleSelectChange(value: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateIssue({
      issueId,
      status: value,
    });
    setSelectedStatus(value);
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError){
    return (<div>Error: {error?.message || "Failed to load data"}</div>)}

  return (
    <Fragment>
      <Select disabled={page !== "backlog"} onValueChange={handleSelectChange}>
        <SelectTrigger
          onClick={(e) => e.stopPropagation()}
          disabled={isUpdating}
          className={clsx(
            variant == "sm" && "bg-opacity-20 px-1.5 py-0.5 border border-buttonHover dark:border-darkSprint-30 dark:text-dark-50 dark:bg-darkSprint-20 text-xs font-bold",
            variant == "lg" && "my-1 px-3 py-1.5 text-[16px] border-2 border-buttonHover dark:border-darkSprint-30 dark:text-dark-50 dark:bg-darkSprint-20 font-semibold",
            isUpdating && "cursor-no1-allowed",
            "flex items-center gap-x-2 whitespace-nowrap rounded-xl px-2 py-1"
          )}
        >
          <SelectValue className="w-full whitespace-nowrap bg-transparent text-white">
            {variant == "sm" ? selectedStatus : selectedStatus}
          </SelectValue>
          {page === "backlog" && (
            <SelectIcon>
              <FaChevronDown className="text-xs" />
            </SelectIcon>
          )}
        </SelectTrigger>
        <SelectPortal className="z-50">
          <SelectContent position="popper">
            <SelectViewport className="w-60 rounded-md border dark:bg-darkSprint-20 dark:border-darkSprint-30 border-buttonHover bg-white pt-2 shadow-md">
              <SelectGroup>
                {Statuses.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className={clsx(
                      "border-l-[3px] border-transparent py-1 pl-2 text-sm hover:cursor-default dark:hover:text-white hover:border-blue-600 dark:hover:bg-darkSprint-30 hover:bg-gray-100 "
                    )}
                  >
                    <span className="rounded-md px-2 dark:text-dark-50  text-xs font-semibold">
                      {status}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator className="mt-2 h-[1px] bg-gray-300 dark:bg-darkSprint-30" />
                <button onClick={(e) => {
                  e.stopPropagation()
                  router.push('/workflow')}} className="w-full dark:text-dark-50 dark:hover:bg-darkSprint-30 dark:bg-darkSprint-20 dark:border-darkSprint-30 border py-4 pl-5 text-left text-sm font-medium hover:cursor-default hover:bg-gray-100">
                  View Workflow
                </button>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>
    </Fragment>
  );
};

export { IssueSelectStatus };
