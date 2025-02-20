"use client";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
} from "@/components/ui/modal";
import { type Sprint } from "@prisma/client";
import { UpdateSprintForm } from "./form";

const UpdateSprintModal: React.FC<{
  sprint: Sprint;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ sprint, isOpen, setIsOpen }) => {
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="p-5 text-white dark:text-dark-50">
            <ModalTitle>Edit Sprint: {sprint.name}</ModalTitle>
          </div>
          <div className="rounded-xl bg-white p-6 dark:bg-darkSprint-20 h-96 overflow-y-scroll custom-scrollbar">
            <UpdateSprintForm sprint={sprint} setModalIsOpen={setIsOpen} />
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { UpdateSprintModal };
