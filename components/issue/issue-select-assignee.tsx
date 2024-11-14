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
import clsx from "clsx";
import { useMembers } from "@/hooks/query-hooks/use-members";
import { type IssueType } from "@/utils/types";
import { Fragment, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { Avatar } from "../avatar";
import { toast } from "../toast";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { type DefaultUser } from "@prisma/client";
import { TooltipWrapper } from "../ui/tooltip";
import {AssignIssueEmailTemplate} from "../email-template";

const IssueAssigneeSelect: React.FC<{
  issue: IssueType;
  avatarSize?: number;
  avatarOnly?: boolean;
}> = ({ issue, avatarSize, avatarOnly = false }) => {
  const { members } = useMembers();
  const { updateIssue, isUpdating } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const unassigned = {
    id: "unassigned",
    name: "Unassigned",
    avatar: undefined,
    email: "",
  };
  const [selected, setSelected] = useState<DefaultUser["id"] | null>(
    issue.assignee?.id ?? null
  );

  function getInitials(name: string) {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.toUpperCase();
  }
  function getColorFromLocalStorage(memberId: string | number) {
    const savedColorMap = JSON.parse(localStorage.getItem("colorMap")) || {};
    return savedColorMap[memberId] || "#ccc";
  }
  function handleSelectChange(value: DefaultUser["id"]) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setSelected(value);
    updateIssue(
      {
        issueId: issue.id,
        assigneeId: value === "unassigned" ? null : value,
      },
      {
        onSuccess: async (data) => {
          toast.success({
            message: `Issue assignee updated to ${
              data.assignee?.name ?? "Unassigned"
            }`,
            description: "Issue assignee changed",
          });
          // Send email notification to the new assignee
          if (data.assignee?.email) {
            try {
              const emailHtml = AssignIssueEmailTemplate({ name: data.assignee.name, issue: issue.name });
              await fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: data.assignee.email,
                  subject: "New Issue Assignment Notification",
                  html: emailHtml,
                }),
              });
              console.log("Email notification sent to:", data.assignee.email);
            } catch (error) {
              console.error("Failed to send email notification:", error);
            }
          }
        },
      }
    );
  }

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger
        onClick={(e) => e.stopPropagation()}
        disabled={isUpdating}
        className={clsx(
          avatarOnly
            ? "rounded-full transition-all duration-200 hover:brightness-75"
            : "-ml-2 rounded-[3px] py-1 pl-2 pr-8 hover:bg-gray-200",
          "flex w-fit items-center gap-x-1 whitespace-nowrap"
        )}
      >
        <SelectValue asChild>
          <Fragment>
            <TooltipWrapper
              text={
                issue.assignee?.name ? issue.assignee?.name : unassigned.name
              }
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
                style={{
                  backgroundColor: issue.assignee?.id
                    ? getColorFromLocalStorage(issue.assignee.id)
                    : getColorFromLocalStorage(unassigned.id),
                }}
              >
                <span className="font-bold text-white">
                  {issue.assignee?.name
                    ? getInitials(issue.assignee?.name)
                    : getInitials(unassigned.name)}
                </span>
              </div>
            </TooltipWrapper>
          </Fragment>
        </SelectValue>
      </SelectTrigger>
      <SelectPortal className="z-50 w-full">
        <SelectContent position="popper">
          <SelectViewport className="w-full rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <SelectGroup>
              {members &&
                [...members, unassigned].map((member) => {
                  const initials = getInitials(member.name);
                  return (
                    <SelectItem
                      key={member.id}
                      value={member.id}
                      data-state={
                        member.id == selected ? "checked" : "unchecked"
                      }
                      className={clsx(
                        "border-l-[3px] border-transparent py-2 pl-2 pr-8 text-sm hover:cursor-default hover:border-blue-600 hover:bg-gray-100 focus:outline-none [&[data-state=checked]]:border-blue-600"
                      )}
                    >
                      <div className="flex items-center">
                        {member.avatar ? (
                          <Avatar
                            src={member.avatar}
                            alt={`${member.name ?? "Unassigned"}`}
                          />
                        ) : (
                          <TooltipWrapper text={member.name}>
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300"
                              style={{
                                backgroundColor: member?.id
                                  ? getColorFromLocalStorage(member.id)
                                  : getColorFromLocalStorage(unassigned.id),
                              }}
                            >
                              <span className="font-bold text-white">
                                {initials}
                              </span>
                            </div>
                          </TooltipWrapper>
                        )}
                        <span className="rounded-md bg-opacity-30 px-2 text-sm">
                          {member.name}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueAssigneeSelect };
