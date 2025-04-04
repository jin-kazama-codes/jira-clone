import { FaChevronDown, FaChevronUp, FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type IssueType } from "@/utils/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar } from "@/components/avatar";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { IssueAssigneeSelect } from "../../issue-select-assignee";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useCookie } from "@/hooks/use-cookie";
import TimeTrackingModal from "@/components/modals/time-track";
import ProgressBar from "@/components/time-progress";
import { OriginalEstimate } from "@/components/original-estimate";
import { MdPersonOutline, MdReportGmailerrorred, MdTrackChanges, MdUpdate } from "react-icons/md";
import { IoMdTimer } from "react-icons/io"
import { dateToLongString } from "@/utils/helpers";

const IssueDetailsInfoAccordion: React.FC<{ issue: IssueType }> = ({
  issue,
}) => {
  const { updateIssue } = useIssues(issue.sprintId);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  const user = useCookie("user");
  const [openAccordion, setOpenAccordion] = useState("details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setisEditing] = useState(false);

  function handleAutoAssign() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    updateIssue({
      issueId: issue.id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      assigneeId: user!.id,
    });
  }

  // Handler to open the modal when the progress bar is clicked
  function handleProgressBarClick() {
    setIsModalOpen(true);
  }

  return (
    <>
      <Accordion
        onValueChange={setOpenAccordion}
        value={openAccordion}
        className="my-3 w-min min-w-full rounded-xl dark:border-darkButton-0 dark:bg-darkButton-30  border-2 "
        type="single"
        collapsible
      >
        <AccordionItem value={"details"}>
          <AccordionTrigger className="flex w-full items-center justify-between p-2 rounded-t-xl font-medium hover:bg-gray-100 dark:hover:bg-darkSprint-20 dark:bg-darkSprint-30 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:border-b border-b-black">
            <div className="flex items-center gap-x-1">
              <span className="text-sm dark:text-dark-50">Details</span>
              <span className="text-xs text-gray-600 dark:text-darkSprint-0">
                (Assignee, Sprint, Reporter)
              </span>
            </div>
            <FaChevronDown
              className="mr-2 text-xs text-black transition-transform"
              aria-hidden
            />
          </AccordionTrigger>
          <AccordionContent className="flex flex-col bg-transparent px-3 [&[data-state=open]]:py-2">
            <div
              data-state={issue.assignee ? "assigned" : "unassigned"}
              className="my-2 grid grid-cols-2 [&[data-state=assigned]]:items-center"
            >
              <div className="flex justify-start gap-x-2 items-center">
              <MdPersonOutline className="dark:text-dark-50" size={20}/>
              <span className="text-sm font-semibold text-gray-800 dark:text-dark-50">
                Assignee
              </span>
              </div>
              <div className="flex flex-col">
                <IssueAssigneeSelect className="dark:text-dark-50" issue={issue} />
                <Button
                  onClick={handleAutoAssign}
                  data-state={issue.assignee ? "assigned" : "unassigned"}
                  customColors
                  customPadding
                  className="mt-1 hidden text-sm text-blue-600 dark:text-darkSprint-0 underline-offset-2 hover:underline [&[data-state=unassigned]]:flex"
                >
                  Assign to me
                </Button>
              </div>
            </div>
            <div className="my-4 grid grid-cols-2 items-center">
            <div className="flex justify-start gap-x-2 items-center">
            <MdTrackChanges className="dark:text-dark-50" size={20}/>
              <span className="text-sm font-semibold text-gray-800 dark:text-dark-50">
                Sprint
              </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-900 dark:text-dark-50">
                  {issue?.sprint?.name ?? "None"}
                </span>
              </div>
            </div>
            <div className="my-2 grid grid-cols-2 items-center">
            <div className="flex justify-start gap-x-2 items-center">
            <MdReportGmailerrorred className="dark:text-dark-50" size={20}/>
              <span className="text-sm font-semibold text-gray-800 dark:text-dark-50">
                Reporter
              </span>
              </div>
              <div className="flex items-center gap-x-3 ">
                <Avatar
                  src={issue.reporter?.avatar}
                  alt={`${issue.reporter?.name ?? "Unassigned"}`}
                />
                <span className="whitespace-nowrap text-sm">
                  {issue.reporter?.name}
                </span>
              </div>
            </div>
            <div className="my-6 grid grid-cols-2 items-center">
              <div className="flex justify-start gap-x-2 items-center">
            <FaRegClock className="dark:text-dark-50" size={17}/>
              <span className="text-sm font-semibold text-gray-800 dark:text-dark-50">
                Original Estimate
              </span>
              </div>
              <div className="flex items-center">
                <OriginalEstimate
                  isEditing={isEditing}
                  setIsEditing={setisEditing}
                  issue={issue}
                  className="text-sm bg-slate-200 dark:bg-darkSprint-20 dark:text-dark-50 p-2 rounded-xl "
                />
              </div>
            </div>
            <div className="my-6 grid grid-cols-2 items-center">
            <div className="flex justify-start gap-x-2 items-center">
            <IoMdTimer className="dark:text-dark-50" size={20}/>
              <span className="text-sm font-semibold text-gray-800 dark:text-dark-50">
                Time Tracking
              </span>
              </div>
              <div
                className="flex items-center"
                onClick={handleProgressBarClick}
              >
                <ProgressBar
                  timeSpent={issue.timeSpent}
                  estimateTime={issue.estimateTime}
                />
              </div>
            </div>
            <div className="my-4 grid grid-cols-2 items-center">
            <div className="flex justify-start gap-x-2 items-center">
            <FaRegCalendarAlt className="dark:text-dark-50" size={18}/>
              <span className="text-sm font-semibold text-gray-800 dark:text-dark-50">
                Created
              </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-900 dark:text-dark-50">
                  {dateToLongString(issue.createdAt)}
                </span>
              </div>
            </div>
            <div className="my-4 grid grid-cols-2 items-center">
            <div className="flex justify-start gap-x-2 items-center">
            <MdUpdate className="dark:text-dark-50" size={20}/>
              <span className="text-sm font-semibold text-gray-800 dark:text-dark-50">
                Updated
              </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-900 dark:text-dark-50">
                {dateToLongString(issue.updatedAt)}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Time Tracking Modal */}
      {isModalOpen && (
        <TimeTrackingModal
          issue={issue}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export { IssueDetailsInfoAccordion };
