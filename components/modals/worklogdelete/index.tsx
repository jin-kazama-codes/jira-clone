"use client";

import { CgDanger } from "react-icons/cg";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useWorklog } from "@/hooks/query-hooks/use-worklog";

interface WorklogDltProps {
  worklog;
  children: ReactNode;
}

const WorklogDlt: React.FC<WorklogDltProps> = ({ worklog, children }) => {
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const [isOpen, setIsOpen] = useState(false);
  const { deleteWorklog } = useWorklog();

  // Delete worklog
  async function handleDelete(worklogId: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      deleteWorklog(worklog?.id)
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating worklog:", error);
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="flex items-center  justify-center">
          <div className="h-70 w-full max-w-sm  rounded-xl">
            <div className="mb-4   flex items-center gap-3 p-5 text-white">
              <CgDanger className="text-3xl text-red-600" />
              <ModalTitle className="text-2xl font-bold text-white">
                Delete worklog entry?
              </ModalTitle>
            </div>
            <div className=" rounded-xl bg-white p-6 pb-3 dark:bg-darkSprint-20">
              <div className="mb-5 flex items-center dark:text-white">
                <p> Once you delete, it's gone for good </p>
              </div>

              <div>
                <div className="flex justify-end   gap-4  p-6 pt-10 ">
                  <button
                    className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() => handleDelete(worklog.id)}
                  >
                    Delete
                  </button>

                  <button
                    className=" rounded-xl  px-3 py-2 text-sm font-medium text-black transition-colors duration-200 hover:bg-gray-200 dark:bg-dark-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export default WorklogDlt;
