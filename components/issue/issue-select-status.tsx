import { Fragment, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { type IssueStatus } from "@prisma/client";
import { type IssueType } from "@/utils/types";
import { NotImplemented } from "@/components/not-implemented";
import { capitalizeMany } from "@/utils/helpers";
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

export const statuses: StatusObject[] = [
  {
    value: "TODO",
    smBgColor: "#000",
    lgBgColor: "#000",
    smTextColor: "#fff",
    lgTextColor: "#fff",
  },
  {
    value: "IN_PROGRESS",
    smBgColor: "#e0ecfc",
    lgBgColor: "#0854cc",
    smTextColor: "#0854cc",
    lgTextColor: "#fff",
  },
  {
    value: "DONE",
    smBgColor: "#e8fcec",
    lgBgColor: "#08845c",
    smTextColor: "#08845c",
    lgTextColor: "#fff",
  },
];

export type StatusObject = {
  value: IssueType["status"];
  smBgColor: string;
  smTextColor: string;
  lgBgColor: string;
  lgTextColor: string;
};
type StatusMap = {
  [key in IssueStatus]: string;
};

export const statusMap: StatusMap = {
  DONE: "DONE",
  IN_PROGRESS: "IN PROGRESS",
  TODO: "TO DO",
};

const IssueSelectStatus: React.FC<{
  currentStatus: IssueType["status"];
  issueId: string;
  variant?: "sm" | "lg";
  page?: string;
}> = ({ currentStatus, issueId, variant = "sm", page = "backlog" }) => {
  const [selected, setSelected] = useState<StatusObject>(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      statuses.find((status) => status.value == currentStatus) ?? statuses[0]!
  );

  const { updateIssue, isUpdating } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleSelectChange(value: IssueType["status"]) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newStatus = statuses.find((status) => status.value == value)!;
    updateIssue({
      issueId,
      status: value,
    });
    setSelected(newStatus);
  }

  return (
    <Fragment>
      <Select disabled={page !== "backlog"} onValueChange={handleSelectChange}>
        <SelectTrigger
          onClick={(e) => e.stopPropagation()}
          disabled={isUpdating}
          // TODO: Colors could be managed with data-state?
          style={{
            backgroundColor:
              variant == "sm" ? selected.smBgColor : selected.lgBgColor,
            color:
              variant == "sm" ? selected.smTextColor : selected.lgTextColor,
          }}
          className={clsx(
            variant == "sm" && "bg-opacity-20 px-1.5 py-0.5 text-xs font-bold",
            variant == "lg" && "my-2 px-3 py-1.5 text-[16px] font-semibold",
            isUpdating && "cursor-not-allowed",
            "flex items-center gap-x-2 whitespace-nowrap rounded-xl px-2 py-1 focus:ring-2"
          )}
        >
          <SelectValue className="w-full whitespace-nowrap bg-transparent text-white">
            {variant == "sm"
              ? statusMap[selected.value]
              : capitalizeMany(statusMap[selected.value])}
          </SelectValue>
          {page === "backlog" && (
            <SelectIcon>
              <FaChevronDown className="text-xs" />
            </SelectIcon>
          )}
        </SelectTrigger>
        <SelectPortal className="z-50">
          <SelectContent position="popper">
            <SelectViewport className="w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
              <SelectGroup>
                {statuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    data-state={
                      status.value == selected.value ? "checked" : "unchecked"
                    }
                    className={clsx(
                      "border-l-[3px] border-transparent py-1 pl-2 text-sm hover:cursor-default hover:border-blue-600 hover:bg-gray-100 [&[data-state=checked]]:border-blue-600"
                    )}
                  >
                    <span
                      style={{
                        color:
                          status.value === "TODO" ? "#000" : status.smTextColor,
                      }}
                      className="rounded-md bg-opacity-30 px-2 text-xs font-semibold"
                    >
                      {statusMap[status.value]}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
              <NotImplemented feature="workflow">
                <button className="w-full border py-4 pl-5 text-left text-sm font-medium hover:cursor-default hover:bg-gray-100">
                  View Workflow
                </button>
              </NotImplemented>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>
    </Fragment>
  );
};

export { IssueSelectStatus };
