"use client";

import { useEffect, useState, type ReactNode } from "react";
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
import { WelcomeNewMemberTemplate } from "@/components/email-template";
import { toast } from "@/components/toast";

interface UserModalProps {
  children: ReactNode;
  refetch: Function;
  manager: boolean;
}

interface User {
  name: string;
  email: string;
}

const UserModal: React.FC<UserModalProps> = ({
  children,
  refetch,
  manager,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await fetch("/api/users");
          if (response.ok) {
            const result = await response.json();
            setUsers(result.users);
          } else {
            console.error("Failed to fetch users");
          }
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      };

      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (name && users) {
      const filteredSuggestions = users?.filter((user) =>
        user.name.toLowerCase().startsWith(name.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [name, users]);

  const handleSelectSuggestion = (selectedUser: User) => {
    setName(selectedUser.name);
    setEmail(selectedUser.email);
    setTimeout(() => {
      setSuggestions([]);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const userData = { name, email };

    // Conditionally append the role query parameter
    const apiUrl = manager ? "/api/users?role=manager" : "/api/users";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      const resetUrl = data.url;
      const projectUrl = data.projectUrl;

      if (response.ok) {
        refetch(); // Refresh members list
        setIsOpen(false);

        try {
          const emailHtml = WelcomeNewMemberTemplate({
            name: name,
            Url: resetUrl || projectUrl,
          });

          await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              subject: "You were Added to a Project",
              html: emailHtml,
            }),
          });

          toast.success({
            message: "Email notification sent to:",
            description: `${email}`,
          });
        } catch (error) {
          toast.error({
            message: "Failed to send email notification:",
            description: `${error}`,
          });
        }

        setName("");
        setEmail("");
      } else {
        setError(data.error || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="p-5 ">
            <ModalTitle className="text-white ">Add Member</ModalTitle>
            <ModalDescription className="mt-1 text-white dark:text-dark-50">
              Enter the name and email of the new user.
            </ModalDescription>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4 rounded-xl bg-white p-6 dark:bg-darkSprint-20"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 dark:text-dark-50"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                autoComplete="off"
              />
              {/* Render suggestions */}
              {suggestions.length > 0 && (
                <ul className="mt-1 max-h-40 overflow-y-auto rounded-md bg-white shadow-lg dark:bg-darkSprint-10">
                  {suggestions.map((user) => (
                    <li
                      key={user.email}
                      onClick={() => handleSelectSuggestion(user)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-darkSprint-20"
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-dark-50"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
              />
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <Button
              type="submit"
              className="flex w-full justify-center rounded-xl !bg-button text-white hover:!bg-buttonHover dark:!bg-dark-0"
            >
              Add
            </Button>
          </form>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { UserModal };
