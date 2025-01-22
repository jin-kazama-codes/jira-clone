"use client";
import { useEffect, useState, type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { toast } from "@/components/toast";



interface DocumentUploadProps {
  children: ReactNode;
  onUploadComplete?: () => void;
  selectedFolderId?: string | null; // New prop to specify folder
}

const DocumentPage: React.FC<DocumentUploadProps> = ({
  children,
  onUploadComplete,
  selectedFolderId = null
}) => {
  const [document, setDocument] = useState<File[] | null>([]);
  const [fileName, setFileName] = useState<string[] | null>([]);
  const [message, setMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [chosenFolderId, setChosenFolderId] = useState<string | null>(selectedFolderId);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];

    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      return fileExtension && allowedExtensions.includes(fileExtension);
    });

    if (validFiles.length === 0) {
      toast.error("Only PDF, image, and Microsoft Word files are allowed.");
      e.target.value = ""; // Clear the file input
      return;
    }

    if (validFiles.length > 5) {
      toast.error("You can upload up to 5 files.");
      e.target.value = ""; // Clear the file input
      return;
    }

    setDocument(validFiles);
    setFileName(validFiles.map((file) => file.name));
  };
  const handleFileUpload = async (files) => {
    const fileURLs = [];

    // Validate folder selection if no pre-selected folder


    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      const fileName = file.name.split('.').slice(0, -1).join('.')
      const fileExtension = file.name.split(".").pop(); // Get file extension
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        // Step 1: Upload to /api/attachment
        const attachmentResponse = await fetch("/api/attachment", {
          method: "POST",
          body: formData,
        });

        const attachmentData = await attachmentResponse.json();

        if (attachmentData.success) {
          const fileUrl = attachmentData.fileUrl;

          // Step 2: Send metadata to /api/document with selected folder
          const documentResponse = await fetch("/api/document", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "file",
              name: fileName,
              extension: fileExtension,
              link: fileUrl,
              parentId: chosenFolderId || null,
            }),
          });

          const documentData = await documentResponse.json();

          if (documentResponse.ok) {
            fileURLs.push(fileUrl);

            if (onUploadComplete) {
              onUploadComplete();
            }
          } else {
            console.error("Error saving document:", documentData.error);
          }
        } else {
          console.error("Attachment upload failed:", attachmentData.error);
        }
      } catch (error) {
        console.error("Error uploading file or saving document:", error);
      }
      finally {
        setIsOpen(false);
        setUploading(false);
      }
    }
  };

  useEffect(() => {
    // Clear the message when the modal is reopened
    if (isOpen) {
      setDocument(null);
      setFileName([]);
      setMessage("");
      setUploading(false);
      // Reset to pre-selected folder if provided
      setChosenFolderId(selectedFolderId);
    }
  }, [isOpen, selectedFolderId]);

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="flex items-center justify-center">
          <div className="w-full max-w-sm rounded-xl h-auto">
            <div className="mb-4 p-5 text-white flex items-center gap-3">
              <ModalTitle className="text-2xl font-bold dark:text-dark-50 text-white">
                Upload File
              </ModalTitle>
            </div>
            <div className="pb-3 flex rounded-t-xl p-6 dark:bg-darkSprint-20 bg-white">
              <div className="flex items-center justify-center w-full">
                <div className="flex flex-col items-center space-y-4 w-full">
                  <input
                    type="file"
                    // value={folders.id}
                    onChange={(e) => {
                      e.preventDefault();
                      const selectedFiles = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      setDocument(selectedFiles);
                      handleFileSelection(e);
                    }}
                    multiple
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {fileName && fileName.length > 0 && (
                    <div className="text-center text-sm text-gray-700 dark:text-dark-50">
                      <p className="font-medium">Selected Files:</p>
                      <ul>
                        {fileName.map((name, index) => (
                          <li key={index} className="truncate">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {message && <p className="text-center pt-4 text-sm text-gray-700">{message}</p>}
                </div>
              </div>
            </div>
            <div className="flex rounded-b-xl bg-white dark:bg-darkSprint-20 pr-3 pb-2 justify-end">
              <button
                onClick={() => {
                  if (document && document.length > 0) {
                    handleFileUpload(document);
                  } else {
                    setMessage("No files selected. Please choose files to upload.");
                  }
                }}
                className="rounded-2xl bg-button dark:!bg-dark-0 text-end px-4 py-2  text-white transition hover:bg-buttonHover disabled:bg-gray-500"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export default DocumentPage;