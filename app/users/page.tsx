"use client";
import { DeleteUserModal } from "@/components/modals/default-users/delete-user";
import { EditUserModal } from "@/components/modals/default-users/edit-user";
import { useMembers } from "@/hooks/query-hooks/use-members";
import withProjectLayout from "@/app/project-layout/withProjectLayout";
import React, { Fragment, useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Userspage = () => {
  const { members, refetch } = useMembers();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const refreshMembers = async () => {
    await refetch();
  };

  // Filter users based on search query
  const filteredUsers = members?.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Fragment>
      <div className="p-4">
        <h2 className="mb-4 text-center text-3xl dark:text-dark-50">
          All Users
        </h2>

        {/* Search Bar */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border dark:border-darkButton-0 dark:bg-darkButton-30 dark:text-dark-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {members ? (
          <div className="mx-auto">
            <div className="overflow-hidden rounded-lg bg-white shadow-md dark:border-darkButton-0 dark:bg-darkButton-30">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-300 dark:bg-darkSprint-20">
                  <tr className="dark:text-dark-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-dark-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-dark-50">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="bg-slate-100 hover:bg-gray-50 dark:bg-darkSprint-30 dark:text-darkSprint-0 dark:hover:bg-darkButton-20"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-dark-50">
                            {user.name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-600 dark:text-dark-50">
                            {user.email}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-400 dark:text-dark-50">
                            {user.role}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <EditUserModal
                              user={user}
                              onEditSuccess={refreshMembers}
                            >
                              <button className="inline-flex items-center rounded-lg bg-button px-3 py-1.5 text-sm font-medium text-white hover:bg-buttonHover focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-dark-0">
                                Edit
                              </button>
                            </EditUserModal>
                            <DeleteUserModal user={user} onDeleteSuccess={refreshMembers}>
                              <button className="rounded-lg border border-red-500 bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:border-red-700 hover:bg-red-600 focus:z-10 focus:outline-none focus:ring-4 focus:ring-red-100">
                                Delete
                              </button>
                            </DeleteUserModal>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-darkButton-20 dark:text-dark-50"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-button text-white"
                        : "hover:bg-gray-100 dark:text-dark-50 dark:hover:bg-darkButton-20"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-darkButton-20 dark:text-dark-50"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
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