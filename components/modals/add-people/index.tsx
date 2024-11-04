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

interface UserModalProps {
  children: ReactNode;
  refetch: Function;
}

interface User {
  name: string;
  email: string;
}

const UserModal: React.FC<UserModalProps> = ({ children, refetch }) => {
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

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        refetch(); // Manually trigger refetch to get the latest members list

        setIsOpen(false);
        setName("");
        setEmail("");
      } else {
        const result = await response.json();
        setError(result.error || "Failed to add user");
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
          <ModalTitle>Add Member</ModalTitle>
          <ModalDescription className="mt-1">
            Enter the name and email of the new user.
          </ModalDescription>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 rounded-md bg-slate-100 px-2 py-1"
                autoComplete="off"
              />
              {/* Render suggestions */}
              {suggestions.length > 0 && (
                <ul className="mt-1 max-h-40 overflow-y-auto rounded-md bg-white shadow-lg">
                  {suggestions.map((user) => (
                    <li
                      key={user.email}
                      onClick={() => handleSelectSuggestion(user)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
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
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-3 mt-1 rounded-md bg-slate-100 px-2 py-1"
              />
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <Button
              type="submit"
              className="flex w-full justify-center rounded-xl !bg-black text-white"
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
