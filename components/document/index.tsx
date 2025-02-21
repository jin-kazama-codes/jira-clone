"use client";
import React, { ReactNode, useEffect, useState } from "react";
import DocumentUpload from "@/components/modals/documentUpload";
import CreateFolderButton from "./createFolder";
import { useDocuments } from "@/hooks/query-hooks/use-documents";
import { FaTrashAlt, FaFolder } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { VscFilePdf } from "react-icons/vsc";
import { useCookie } from "@/hooks/use-cookie";
import DeleteDocument from "@/components/modals/deleteDocument";
import { DocumentSkeleton } from "../skeletons";

interface FileItem {
  link(link: any, arg1: string): void;
  DefaultUser: any;
  createdAt: ReactNode;
  id: string;
  name: string;
  extensions: "pdf" | "image" | "document";
  type: string;
  parentId?: string | null;
  ownerId: number;
}

const Document: React.FC = () => {
  const userId = useCookie("user").id;
  const FileIcon = ({ extensions }: { extensions: FileItem["extensions"] }) => {
    switch (extensions) {
      case "pdf":
        return <VscFilePdf className="h-5 w-5 text-red-700 dark:text-dark-0" />;
      case "image":
        return <CiImageOn className="dark:text-dark-0" />;
      default:
        return (
          <>
            {/* <VscFilePdf /> */}
            <CiImageOn className="h-5 w-5 text-blue-600" />
          </>
        );
    }
  };
  const [parentId, setParentId] = useState<string | null>(null);
  const {
    documents: allFiles,
    isLoading,
    error,
    refetch,
  } = useDocuments(parentId);
  const [folders, setFolders] = useState<FileItem[]>([]);
  const [pathStack, setPathStack] = useState<FileItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<FileItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (allFiles) {
      const sortedFiles = allFiles.slice().sort((a, b) => {
        const createdAtDiff = new Date(b.createdAt) - new Date(a.createdAt);
        return createdAtDiff !== 0
          ? createdAtDiff
          : a.name.localeCompare(b.name);
      });

      // Filter folders (items with type other than 'file')
      setFolders(sortedFiles.filter((file) => file.type !== "file"));

      // Filter files (items with type 'file')
      setFiles(sortedFiles.filter((file) => file.type === "file"));
    }
  }, [allFiles]);

  const handleFolderClick = (folder: FileItem) => {
    setParentId(folder.id);
    setSelectedFolder(folder);
    setPathStack((prevStack) => [...prevStack, folder]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setSelectedFolder(pathStack[index]);
    const newStack = pathStack.slice(0, index + 1);
    setPathStack(newStack); // Remove deeper levels
    setParentId(newStack[newStack.length - 1]?.id || null);
  };

  // Filter files based on selected folder or null parentId
  const displayedFiles = selectedFolder
    ? files.filter((file) => file.parentId === selectedFolder.id)
    : files.filter((file) => file.parentId === null);

  const displayedFolder = selectedFolder
    ? folders.filter((folder) => folder.parentId === selectedFolder.id)
    : folders.filter((folder) => folder.parentId === null);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(displayedFiles.length / itemsPerPage);
  const paginatedFiles = displayedFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderPaginationControls = () => (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="mb-4 rounded-xl bg-button px-4 py-2 text-white hover:cursor-pointer hover:bg-buttonHover dark:bg-dark-0 dark:hover:bg-darkSprint-20"
      >
        Previous
      </button>
      <span className="dark:text-dark-50">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="mb-4 rounded-xl bg-button px-4 py-2 text-white hover:cursor-pointer hover:bg-buttonHover dark:bg-dark-0 dark:hover:bg-darkSprint-20"
      >
        Next
      </button>
    </div>
  );

  if (isLoading) return <DocumentSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  const renderBreadcrumb = () => {
    return (
      <div className="mb-4 flex items-center text-sm dark:text-dark-50">
        <button
          onClick={() => {
            setSelectedFolder(null);
            setParentId(null);
            setPathStack([]);
          }}
          className="hover:underline"
        >
          Documents
        </button>
        {pathStack.map((folder, index) => (
          <span key={folder.id} className="flex items-center">
            <span className="mx-1">/</span>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className="hover:underline"
            >
              {folder.name}
            </button>
          </span>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (selectedFolder) {
      return (
        <div>
          {/* Folder Details Header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center ">{renderBreadcrumb()}</div>
            <CreateFolderButton
              onFolderCreated={refetch}
              selectedFolderId={selectedFolder.id}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-5">
            {displayedFolder.map((folder) => (
              <div
                key={folder.id}
                className={`group flex cursor-pointer justify-between rounded-lg border p-2 dark:border-darkButton-0 dark:bg-darkButton-30  
                  ${
                    selectedFolder?.id === folder.id ? "bg-blue-50" : "bg-white"
                  }
                  transition-colors hover:bg-gray-50 `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFolderClick(folder);
                }}
              >
                <div className="flex items-center ">
                  <FaFolder
                    className={`mr-2 ${
                      selectedFolder?.id === folder.id
                        ? "text-blue-500"
                        : "text-body"
                    }`}
                  />
                  <span className="font-medium dark:text-dark-50">
                    {folder.name}
                  </span>
                </div>
                {folder.ownerId === userId && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DeleteDocument Id={folder.id} folder={true}>
                      <button
                        className="rounded-full p-2 text-red-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-200 group-hover:opacity-100 dark:text-dark-50 dark:hover:bg-red-200"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FaTrashAlt className="h-4 w-4 text-red-500" />
                      </button>
                    </DeleteDocument>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <h2 className="px-4 py-2 text-lg font-bold dark:text-dark-50">
              {" "}
              Files
            </h2>
            <DocumentUpload
              onUploadComplete={refetch}
              selectedFolderId={selectedFolder.id}
            >
              <button className="mb-4 rounded-xl bg-button px-4 py-2 text-white hover:bg-buttonHover  dark:bg-dark-0">
                Add File
              </button>
            </DocumentUpload>
          </div>

          {displayedFiles.length === 0 ? (
            <div className="py-4 text-center text-gray-500 dark:text-dark-50">
              No files in this folder
            </div>
          ) : (
            <div className="h-[58vh]">
              <div className="mt-1 h-96  w-full rounded-lg border bg-white shadow dark:border-darkButton-0 dark:bg-darkButton-30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-darkSprint-20 ">
                    <tr className="dark:text-dark-50">
                      <th scope="col" className="cursor-pointer px-6 py-3">
                        File Name
                      </th>
                      <th scope="col" className="cursor-pointer px-6 py-3">
                        Uploaded By
                      </th>
                      <th scope="col" className="cursor-pointer px-6 py-3">
                        Upload Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFiles.map((file) => (
                      <tr key={file.id} className="border-b dark:border-b-darkSprint-10 hover:bg-gray-50 dark:text-dark-50 dark:hover:bg-darkButton-20">
                        <td className="flex items-center gap-2 px-6 py-4">
                          <FileIcon extensions={file.extensions} />
                          <button
                            onClick={() => window.open(file.link, "_blank")}
                            className="text-black hover:underline dark:text-dark-50"
                          >
                            {file.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 dark:text-dark-50">
                          {file.DefaultUser.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 dark:text-dark-50">
                            {new Date(file.createdAt).toLocaleDateString()}{" "}
                            {new Date(file.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {Number(userId) === Number(file.ownerId) && (
                            <DeleteDocument Id={file.id} folder={false}>
                              <button className="rounded-lg bg-red-600 px-2 py-2 text-white ">
                                Delete
                              </button>
                            </DeleteDocument>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPaginationControls()}
            </div>
          )}
        </div>
      );
    }

    // Default view: All folders and root files
    return (
      <>
        {/* Folders Section */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="px-4 py-2 text-lg font-bold dark:text-dark-50">
              Folders
            </h2>
            <CreateFolderButton onFolderCreated={refetch} />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-5">
            {displayedFolder.map((folder) => (
              <div
                key={folder.id}
                className={`group flex cursor-pointer justify-between rounded-lg border p-2 dark:border-darkButton-0 dark:bg-darkButton-30 
                  ${
                    selectedFolder?.id === folder.id ? "bg-blue-50" : "bg-white"
                  }
                  transition-colors hover:bg-gray-50`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFolderClick(folder);
                }}
              >
                <div className="flex items-center">
                  <FaFolder
                    className={`mr-2 dark:text-dark-0 ${
                      selectedFolder?.id === folder.id
                        ? "text-blue-500"
                        : "text-body"
                    }`}
                  />
                  <span className="font-medium dark:text-dark-50">
                    {folder.name}
                  </span>
                </div>
                {Number(userId) === Number(folder.ownerId) && (
                  <DeleteDocument Id={folder.id} folder={true}>
                    <button
                      className="rounded-full p-2 text-red-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </DeleteDocument>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Root Files Section */}
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <h2 className="px-4 py-2 text-lg font-bold dark:text-dark-50">
              {" "}
              Files
            </h2>
            <DocumentUpload onUploadComplete={refetch}>
              <button className="rounded-xl bg-button px-4 py-2 text-white hover:bg-buttonHover dark:bg-dark-0 dark:hover:bg-darkSprint-20">
                Add File
              </button>
            </DocumentUpload>
          </div>

          {displayedFiles.length === 0 ? (
            <div className="py-4 text-center text-gray-500 dark:text-dark-50">
              No files uploaded
            </div>
          ) : (
            // eslint-disable-next-line react/jsx-key
            <div className=" h-[58vh] ">
              <div className="mt-1 h-70  w-full rounded-lg border bg-white shadow  dark:border-darkButton-0 dark:bg-darkButton-30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-darkSprint-20 ">
                    <tr className="dark:text-dark-50">
                      <th scope="col" className="cursor-pointer px-6 py-3">
                        File Name
                      </th>
                      <th scope="col" className="cursor-pointer px-6 py-3">
                        Uploaded By
                      </th>
                      <th scope="col" className="cursor-pointer px-6 py-3">
                        Upload Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-b dark:border-b-darkSprint-10 hover:bg-gray-50 dark:text-dark-50 dark:hover:bg-darkButton-20"
                      >
                        <td className="flex items-center gap-2 px-6 py-4">
                          <FileIcon extensions={file.extensions} />
                          <button
                            onClick={() => window.open(file.link, "_blank")}
                            className="text-black hover:underline dark:text-dark-50"
                          >
                            {file.name}
                          </button>
                        </td>
                        <td className="px-6 py-4">{file.DefaultUser.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {new Date(file.createdAt).toLocaleDateString()}{" "}
                            {new Date(file.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {Number(userId) === Number(file.ownerId) && (
                            <DeleteDocument Id={file.id} folder={false}>
                              <button className="rounded bg-red-600 px-4 py-2 text-white">
                                Delete
                              </button>
                            </DeleteDocument>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPaginationControls()}
            </div>
          )}
        </div>
      </>
    );
  };

  if (isLoading) return <DocumentSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="h-[90vh] custom-scrollbar overflow-y-scroll ">
      <div className="flex justify-between pb-2">
        <h1 className="text-2xl font-bold dark:text-dark-50">Documents</h1>
      </div>
      {renderContent()}
    </div>
  );
};

export default Document;
