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
import { useDocuments } from "@/hooks/query-hooks/use-documents";



interface DocumentDltProp {
  Id: string;
  children: ReactNode;
  folder: boolean;
}

const DeleteDocument: React.FC<DocumentDltProp> = ({
  children, Id, folder: folder = false
}) => {

  const [isOpen, setIsOpen] = useState(false);

  const { deletedocument } = useDocuments();

  const message = folder
    ? "Deleting this folder will also delete all files and folders inside it. Are you sure?"
    : "Once you delete this file, it's gone for good. Are you sure?";

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="flex items-center  justify-center">
          <div className="w-full max-w-sm rounded-xl  h-70">
            <div className="mb-4   p-5 text-white flex items-center gap-3">
              <CgDanger className="text-red-600 text-3xl" />
              <ModalTitle className="text-2xl font-bold text-white dark:text-dark-50">
                Delete Document
              </ModalTitle>
            </div>
            <div className=" pb-3 rounded-xl p-6 bg-white dark:bg-darkSprint-20">
              <div className="mb-5 flex items-center dark:text-dark-50">
                <p>{message}</p>
              </div>

              <div>
                <div className="flex gap-4   p-6  pt-10 justify-end ">
                  <button
                    className="bg-red-500 text-white text-sm font-medium py-2 px-3 rounded-xl hover:bg-red-600 transition-colors duration-200"

                    onClick={(e) => {
                      e.stopPropagation(),
                        deletedocument({ documentId: Number(Id), folder }); setIsOpen(false);
                    }}
                  >
                    Delete
                  </button>

                  <button
                    className=" text-black dark:bg-dark-50  text-sm font-medium py-2 px-3 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation(),
                        setIsOpen(false)
                    }}
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



export default DeleteDocument;
