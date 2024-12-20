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




interface WorklogDltProps {
  worklog;
  children: ReactNode;

}

const WorklogDlt: React.FC<WorklogDltProps> = ({
  worklog,
  children,
}) => {
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const [isOpen, setIsOpen] = useState(false);


  // Delete worklog
  async function handleDelete(worklogId: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    try {
      const response = await fetch(`/api/worklog/${worklogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worklogId,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete worklog entry');
      }
      setIsOpen(false)
    } catch (error) {
      console.error('Error updating worklog:', error)

    }
  }


  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="flex items-center  justify-center">
          <div className="w-full max-w-sm rounded-xl  h-70">
            <div className="mb-4   p-5 text-white flex items-center gap-3">
              <CgDanger className="text-red-600 text-3xl" />
              <ModalTitle className="text-2xl font-bold text-white">
                Delete worklog entry?
              </ModalTitle>
            </div>
            <div className=" pb-3 rounded-xl p-6 bg-white">
              <div className="mb-5 flex items-center">
                <p> Once you delete, it's gone for good </p>
              </div>

              <div>
                <div className="flex gap-4   p-6  pt-10 justify-end ">
                  <button
                    className="bg-red-500 text-white text-sm font-medium py-2 px-3 rounded-xl hover:bg-red-600 transition-colors duration-200"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={() => handleDelete(worklog.id)}
                  >
                    Delete
                  </button>

                  <button
                    className=" text-black  text-sm font-medium py-2 px-3 rounded-xl hover:bg-gray-200 transition-colors duration-200"
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
