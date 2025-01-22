"use client";
import { DeleteUserModal } from "@/components/modals/default-users/delete-user";
import { EditUserModal } from "@/components/modals/default-users/edit-user";
import { useMembers } from "@/hooks/query-hooks/use-members";
import withProjectLayout from "@/app/project-layout/withProjectLayout";
import React, { Fragment } from "react";

const Userspage = () => {
  const { members, refetch } = useMembers(); // Ensure `useMembers` provides a refetch method

  const refreshMembers = async () => {
    await refetch(); // Trigger a fresh fetch of members
  };

  return (
    <Fragment>
      <div className="p-4">
        <h2 className="mb-8 text-center text-3xl dark:text-dark-50">All Users</h2>
        {members ? (
          <div className=" mx-auto">
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:border-darkButton-0 dark:bg-darkButton-30">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-300 dark:bg-darkSprint-20">
                  <tr className="dark:text-dark-50">
                    <th className="px-6 dark:text-dark-50 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Name
                    </th>
                    <th className="px-6 dark:text-dark-50 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Email
                    </th>
                    <th className="px-6 dark:text-dark-50 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Role
                    </th>
                    <th className="px-6 dark:text-dark-50 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {members.map((user) => (
                    <tr key={user.id} className="bg-slate-100 hover:bg-gray-50 dark:text-darkSprint-0 dark:bg-darkSprint-30  dark:hover:bg-darkButton-20">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-dark-50">
                          {user.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-400 dark:text-dark-50">{user.role}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <EditUserModal
                            user={user}
                            onEditSuccess={refreshMembers}
                          >
                            <button className="inline-flex items-center rounded-lg dark:bg-dark-0 bg-button px-3 py-1.5 text-sm font-medium text-white hover:bg-buttonHover focus:outline-none focus:ring-4 focus:ring-blue-300">
                              Edit
                            </button>
                          </EditUserModal>
                          <DeleteUserModal user={user}>
                            <button className="rounded-lg border border-red-500 bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:border-red-700 hover:bg-red-600 focus:z-10 focus:outline-none focus:ring-4 focus:ring-red-100">
                              Delete
                            </button>
                          </DeleteUserModal>
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
    </Fragment>
  );
};

export default withProjectLayout(Userspage);
