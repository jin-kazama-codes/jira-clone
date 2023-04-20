import { useState } from "react";
import clsx from "clsx";
import { type IssueType } from "@/components/backlog/issue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { IssueIcon } from "./issue-icon";

const IssueTypeSelect: React.FC<{ currentType: IssueType["type"] }> = ({
  currentType,
}) => {
  const types: { value: IssueType["type"]; color: string }[] = [
    { value: "STORY", color: "#84cc16" },
    { value: "TASK", color: "#4bade8" },
    { value: "BUG", color: "#ef4444" },
  ];
  const [selected, setSelected] = useState(currentType);
  return (
    <Select
      onValueChange={
        setSelected as React.Dispatch<React.SetStateAction<string>>
      }
    >
      <SelectTrigger className="flex items-center gap-x-1 rounded-md bg-opacity-30 p-1.5 text-xs font-semibold text-white hover:bg-zinc-200 focus:ring-2">
        <SelectValue>
          <IssueIcon issueType={selected} />
        </SelectValue>
      </SelectTrigger>
      <SelectPortal className="z-10">
        <SelectContent className="">
          <SelectViewport className="top-10 w-52 rounded-md border border-gray-300 bg-white py-2 shadow-md">
            <span className="pl-3 text-xs text-zinc-500">
              CHANGE ISSUE TYPE
            </span>
            <SelectGroup>
              {types.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className={clsx(
                    "border-transparent py-2 pl-3 text-sm hover:cursor-default hover:bg-zinc-50"
                  )}
                >
                  <div className="flex">
                    <IssueIcon issueType={status.value} />
                    <span className={clsx("px-2 text-xs")}>{status.value}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueTypeSelect };