"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { calculatePercentage, calculateTimeRemaining } from "@/utils/helpers";
import { combineTimeSpent } from "@/utils/helpers";
import { useCookie } from "@/hooks/use-cookie";
import WorklogDlt from "../worklogdelete";
import { useWorklog } from "@/hooks/query-hooks/use-worklog";

interface EditWorklogProps {
  isOpen: boolean;
  onClose: () => void; // Function to handle closing the modal
  issue: {
    id: string;
    timeSpent: string;
    estimateTime: string;
  };
  worklog;
  children: ReactNode;
}

const EditWorklog: React.FC<EditWorklogProps> = ({
  issue,
  worklog,
  children,
}) => {
  const [timeSpent, setTimeSpent] = useState(issue.timeSpent || ""); // Initially empty when modal opens
  const [percentage, setPercentage] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [newTimeSpent, setNewTimeSpent] = useState("");
  const [workDescription, setWorkDescription] = useState(
    worklog.workDescription
  );
  const [isOpen, setIsOpen] = useState(false);
  const { updateIssue } = useIssues();
  const { updateWorklog } = useWorklog(issue?.id);

  useEffect(() => {
    // Calculate percentage and remaining time based on the already logged time
    const totalTimeSpent = combineTimeSpent(
      issue.timeSpent || "0m",
      newTimeSpent || "0m"
    );
    const newRemainingTime = calculateTimeRemaining(
      totalTimeSpent || "0m",
      issue.estimateTime
    );
    const newPercentage = calculatePercentage(
      totalTimeSpent || "0m",
      issue.estimateTime
    );

    setTimeSpent(totalTimeSpent);
    setRemainingTime(newRemainingTime);
    setPercentage(newPercentage);
  }, [newTimeSpent, issue.timeSpent, issue.estimateTime]);

  const progressBarColor = percentage > 100 ? "bg-orange-500" : "bg-green-500";

  // Handle input edit

  const onSave = async (worklogId: string) => {
    let worklogData = JSON.stringify({
      timeLogged: timeSpent,
      workDescription: workDescription,
      issueId: issue.id,
    });
    try {
      updateWorklog({
        worklogId: worklogId,
        worklog: worklogData,
      });
      updateIssue({ issueId: issue.id, timeSpent: timeSpent });
      setIsOpen(false);
    } catch (error) {
      setIsOpen(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="flex items-center justify-center ">
          <div className="h-96 w-full max-w-sm overflow-y-scroll rounded-xl bg-header dark:bg-darkSprint-10">
            <div className="mb-3 flex items-center justify-between p-5  align-middle">
              <ModalTitle className="text-2xl font-bold text-white">
                Edit Worklog
              </ModalTitle>
              <button className="text-white" onClick={() => setIsOpen(false)}>
                <IoClose size={20} />
              </button>
            </div>

            <div className="rounded-xl bg-white p-5 dark:bg-darkSprint-20">
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="h-2 w-full cursor-pointer rounded-lg bg-gray-200">
                  <div
                    className={`h-full rounded-lg ${progressBarColor}`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`, // Limit the width to 100%
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>

                {/* Time logging information */}
                <div className="flex justify-between text-sm text-gray-600 dark:text-dark-50">
                  {timeSpent ? (
                    <span>{timeSpent} logged</span>
                  ) : (
                    <span>No time logged</span>
                  )}
                  <span>
                    {remainingTime !== "Overdue"
                      ? `${remainingTime} Remaining`
                      : "Overdue"}
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-dark-50">
                  The original estimate for this issue was{" "}
                  <span className="rounded-xl bg-slate-100 px-2 font-medium dark:text-darkSprint-0 ">
                    {issue.estimateTime}
                  </span>
                  .
                </div>

                {/* Time spent and time remaining input */}
                <div className="flex gap-x-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="currentTime"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-50"
                    >
                      Current Logged Time
                    </label>
                    <input
                      type="text"
                      id="currentTime"
                      placeholder="e.g., 2w 4d 6h 45m"
                      value={newTimeSpent}
                      onChange={(e) => setNewTimeSpent(e.target.value)} // Handle input change
                      className="w-full rounded-md border border-gray-300 bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="timeRemaining"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-50"
                    >
                      Time remaining
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="timeRemaining"
                        value={remainingTime}
                        className="w-full rounded-md border border-gray-300 bg-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Time format help */}
              <div className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50">
                <p className="mb-1 font-medium">Use the format: 2w 4d 6h 45m</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>w = weeks</li>
                  <li>d = days</li>
                  <li>h = hours</li>
                  <li>m = minutes</li>
                </ul>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 mt-2 block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Edit Description
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                  placeholder="Write your description here..."
                ></textarea>
              </div>

              {/* Modal buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-dark-50"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave(worklog.id)}
                  className="rounded-2xl !bg-button px-4 py-2 text-sm font-medium text-white hover:bg-buttonHover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:!bg-dark-0"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export default EditWorklog;
