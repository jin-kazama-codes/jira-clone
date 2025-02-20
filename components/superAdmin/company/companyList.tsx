import { EditCompanyModal } from "@/components/modals/super-admin/company/edit-company";
import React from "react";

const CompanyList = ({ companies }) => {
  return (
    <div className="rounded-xl border bg-white pb-0 dark:border-darkSprint-30 dark:bg-darkSprint-20">
      <div className="rounded-t-xl bg-header p-4 dark:bg-darkSprint-10">
        <h2 className="text-center text-2xl font-semibold text-white dark:text-dark-50">
          Company List
        </h2>
      </div>
      {companies ? (
        <div className=" mx-auto">
          <div className="h-[27rem] overflow-y-scroll rounded-lg bg-white shadow-md dark:border-darkButton-0 dark:bg-darkButton-30">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-300 sticky top-0 dark:bg-darkSprint-20">
                <tr className="dark:text-dark-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="bg-slate-100 hover:bg-gray-50 dark:bg-darkSprint-30 dark:text-darkSprint-0  dark:hover:bg-darkButton-20"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {company.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-dark-50">
                        {company.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-400 dark:text-dark-50">
                        {company.phone}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className={`text-sm font-semibold text-white `}>
                        <span
                          className={`rounded-2xl px-2 py-1 ${
                            company.status === "Active"
                              ? "bg-green-500"
                              : company.status === "Inactive"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {company.status}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <EditCompanyModal
                            company={company}
                          >
                            <button className="inline-flex items-center rounded-lg bg-button px-3 py-1.5 text-sm font-medium text-white hover:bg-buttonHover focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-dark-0">
                              Edit
                            </button>
                          </EditCompanyModal>
                          {/* <DeleteUserModal user={user}>
                            <button className="rounded-lg border border-red-500 bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:border-red-700 hover:bg-red-600 focus:z-10 focus:outline-none focus:ring-4 focus:ring-red-100">
                              Delete
                            </button>
                          </DeleteUserModal> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
