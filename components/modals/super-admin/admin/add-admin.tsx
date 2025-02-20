"use client";

import { useState } from "react";
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
import { useCompany } from "@/hooks/query-hooks/use-company";
import { useAdmin } from "@/hooks/query-hooks/use-admins";

const AddAdminModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createAdmin, adminCreating } = useAdmin(); 
  const { companies } = useCompany(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    companyId: "", // Storing selected company ID
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAdmin({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      companyId: formData.companyId,
    });
    setIsOpen(false); 
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="p-5 pb-1">
            <ModalTitle className="text-white">Add Admin</ModalTitle>
            <ModalDescription className="mt-1 text-white dark:text-dark-50">
              Enter the details of the Admin.
            </ModalDescription>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-4 rounded-xl bg-white p-6 dark:bg-darkSprint-20"
          >
            <div className="grid grid-cols-3 gap-4">
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
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                  autoComplete="off"
                />
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
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                >
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="companyId"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Company
                </label>
                <select
                  id="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              type="submit"
            //   disabled={adminCreating}
              className="flex w-full justify-center rounded-xl !bg-button text-white hover:!bg-buttonHover dark:!bg-dark-0"
            >
              {adminCreating ? "Adding..." : "Add Admin"}
            </Button>
          </form>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { AddAdminModal };
