"use client";
import { DeleteUserModal } from "@/components/modals/default-users/delete-user";
import { EditUserModal } from "@/components/modals/default-users/edit-user";
import { useMembers } from "@/hooks/query-hooks/use-members";
import withProjectLayout from "@/app/project-layout/withProjectLayout";
import React, { Fragment } from "react";

const Userspage = () => {
  const { members } = useMembers();

  return (
    <Fragment>
      <div className="p-4">
        <h2 className="text-3xl text-center mb-8">All Users</h2>
        {members ? (
          <div className=" mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <EditUserModal user={user}>
                            <button className="inline-flex items-center rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300">
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