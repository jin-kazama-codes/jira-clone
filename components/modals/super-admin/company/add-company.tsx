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

const AddCompanyModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createCompany, companyCreating, refetchCompanies } = useCompany();

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    phone: "",
    alternateNumber: "",
    billingAddress: "",
    gst: "",
    subscriptionType: "Trial",
    trialDuration: "",
    date: "",
    status: "Active",
    proMember: false,
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

  const handleToggleChange = () => {
    setFormData((prev) => ({
      ...prev,
      proMember: !prev.proMember,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCompany({
      name: formData.name,
      website: formData.website || undefined,
      email: formData.email,
      phone: formData.phone,
      alternateNumber: formData.alternateNumber || undefined,
      billingAddress: formData.billingAddress,
      gst: formData.gst,
      subscriptionType: formData.subscriptionType,
      trialDuration: formData.trialDuration || undefined,
      date: formData.date,
      status: formData.status,
      proMember: formData.proMember || false,
    });

    refetchCompanies();
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="p-5 pb-1">
            <ModalTitle className="text-white">Add Company</ModalTitle>
            <ModalDescription className="mt-1 text-white dark:text-dark-50">
              Enter the details of the Company.
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
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="alternateNumber"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Alternate Contact
                </label>
                <input
                  type="text"
                  id="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleInputChange}
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="billingAddress"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Billing Address
                </label>
                <input
                  type="text"
                  id="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="gst"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  GST Number
                </label>
                <input
                  type="text"
                  id="gst"
                  value={formData.gst}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="subscriptionType"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Subscription Type
                </label>
                <select
                  id="subscriptionType"
                  value={formData.subscriptionType}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Annually">Annually</option>
                  <option value="Trial">Trial</option>
                </select>
              </div>

              {/* <div>
                <label
                  htmlFor="trialDuration"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Trial Duration
                </label>
                <input
                  type="text"
                  id="trialDuration"
                  value={formData.trialDuration}
                  onChange={handleInputChange}
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div> */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="mb-3 mt-1 w-full rounded-md bg-slate-300 px-2 py-1 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On-Hold">On-Hold</option>
                </select>
              </div>
              <div className="flex items-center justify-center gap-4">
                <label
                  htmlFor="proMember"
                  className="text-sm font-medium text-gray-900 dark:text-dark-50"
                >
                  Pro Member
                </label>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    id="proMember"
                    className="sr-only"
                    checked={formData.proMember}
                    onChange={handleToggleChange}
                  />
                  <div
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 ease-in-out
                    ${
                      formData.proMember
                        ? "bg-indigo-600 dark:bg-indigo-500"
                        : "bg-gray-200 dark:bg-darkSprint-10"
                    }`}
                  >
                    <div
                      className={`absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                      ${
                        formData.proMember ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>
            <Button
              type="submit"
              disabled={companyCreating}
              className="flex w-full justify-center rounded-xl !bg-button text-white hover:!bg-buttonHover dark:!bg-dark-0"
            >
              {companyCreating ? "Adding..." : "Add"}
            </Button>
          </form>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { AddCompanyModal };
