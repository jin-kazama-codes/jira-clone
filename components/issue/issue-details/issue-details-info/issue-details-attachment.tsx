import React, { useRef, useState, useEffect } from "react";
import { HiOutlinePaperClip } from "react-icons/hi";
import { MdClose } from "react-icons/md";

type Attachment = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export default function IssueAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newAttachments = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  // Handle paste (screenshots, copied images)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              handleFiles({ 0: file, length: 1, item: () => file } as FileList);
            }
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold dark:text-dark-50">
        Attachments
      </h2>

      {/* Upload button */}
      <button
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:border-darkButton-30 dark:bg-darkButton-20 dark:hover:bg-darkButton-30"
        onClick={() => fileInputRef.current?.click()}
      >
        <HiOutlinePaperClip />
        Add File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Preview Section */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="relative rounded-md border p-2 shadow-sm dark:border-darkButton-30"
          >
            {att.type.startsWith("image/") ? (
              <img
                src={att.url}
                alt={att.name}
                className="h-32 w-full rounded object-cover"
              />
            ) : (
              <div className="flex h-32 items-center justify-center rounded bg-gray-200 dark:bg-darkButton-20">
                <span className="text-sm">{att.name}</span>
              </div>
            )}
            <button
              onClick={() => removeAttachment(att.id)}
              className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/80"
            >
              <MdClose size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
