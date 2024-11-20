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
import { StartSprintForm } from "./form";

const StartSprintModal: React.FC<{
  children: ReactNode;
  issueCount: number;
  sprint: Sprint;
}> = ({ children, issueCount, sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="p-5 text-white">
            <ModalTitle>Start Sprint</ModalTitle>
            <ModalDescription>
              <span className="font-bold text-white">{issueCount}
                {issueCount > 1 ? " issues" : " issue"} will be included in this
                sprint.</span>
            </ModalDescription>
          </div>
          <div className="rounded-xl bg-white p-6">
            <StartSprintForm sprint={sprint} setModalIsOpen={setIsOpen} />
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { StartSprintModal };
