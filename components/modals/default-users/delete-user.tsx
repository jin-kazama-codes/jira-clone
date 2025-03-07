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
import { Button } from "@/components/ui/button";

interface DeleteUserModalProps {
  children: ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  onClose?: () => void;
  onDeleteSuccess: any
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  children,
  user,
  onClose,
  onDeleteSuccess
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsOpen(false);
        onDeleteSuccess()
      } else {
        const result = await response.json();
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="p-5 text-white">
            <ModalTitle>Remove member</ModalTitle>
            <ModalDescription className="mt-1 !text-white">
              Are you sure you want to remove the member ?
            </ModalDescription>
          </div>
          <div className="mt-5 rounded-xl p-6 dark:bg-darkSprint-20 bg-white space-x-4">
            <Button
              onClick={handleDelete}
              className="flex  justify-center px-4 py-1 rounded-2xl !bg-red-600 text-white"
            >
              Delete
            </Button>
            <button className="dark:bg-dark-50 px-4 py-1 rounded-2xl" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { DeleteUserModal };
