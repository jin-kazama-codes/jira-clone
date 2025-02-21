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
import { useMembers } from "@/hooks/query-hooks/use-members";

interface EditUserModalProps {
  children: ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  onClose?: () => void;
  onEditSuccess?: () => void; // Callback to refresh parent data
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  children,
  user,
  onClose,
  onEditSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string | null>(null);
  const { updateMember, memberUpdating } = useMembers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let body = JSON.stringify({
      id: user.id,
      name: name,
    });

    updateMember(body);
    onClose?.();
    setIsOpen(false);
    setName("");
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="p-5 text-white">
            <ModalTitle>Edit User</ModalTitle>
            <ModalDescription className="mt-1 !text-white">
              Enter the name of the user.
            </ModalDescription>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4 rounded-xl bg-white p-6 dark:bg-darkSprint-20"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-dark-50"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 rounded-md bg-slate-100 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                autoComplete="off"
              />
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <Button
              type="submit"
              className="flex w-full justify-center rounded-xl !bg-black text-white dark:!bg-dark-0"
            >
              {memberUpdating ? "Updating Member..." : "Update member"}
            </Button>
          </form>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { EditUserModal };
