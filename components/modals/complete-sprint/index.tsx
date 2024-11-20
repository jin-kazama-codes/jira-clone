"use client";
import { useState, type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { type Sprint } from "@prisma/client";
import { CompleteSprintForm } from "./form";
import { type IssueType } from "@/utils/types";
'@/public/images/trophy.png'

const CompleteSprintModal: React.FC<{
  children: ReactNode;
  issues: IssueType[];
  sprint: Sprint;
}> = ({ children, issues, sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const completedIssues = issues.filter((issue) => issue.status === "DONE");
  const openIssues = issues.filter((issue) => issue.status !== "DONE");
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="w-96">
          <div className=" p-6 text-white">
            <div className="flex justify-center items-center  bg-transparent">
              <img
                src="/images/trophy.png"
                alt="Trophy"
                className="w-24 h-auto"
              />
            </div>
            <ModalTitle>Complete {sprint.name}</ModalTitle>
            <ModalDescription>
              <span className="text-white">This sprint contains:</span>
              <ul className="ml-6 mt-2 list-disc text-sm text-white">
                <li>
                  <span className="font-bold">{completedIssues.length} </span>
                  completed issues
                </li>
                <li>
                  <span className="font-bold">{openIssues.length} </span>
                  open issues
                </li>
              </ul>
            </ModalDescription>
          </div>
          <div className="bg-white text-black rounded-xl p-6">
            <CompleteSprintForm
              sprint={sprint}
              setModalIsOpen={setIsOpen}
              issues={issues}

            />
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { CompleteSprintModal };
