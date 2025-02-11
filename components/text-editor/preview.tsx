"use client";
import React, { useState } from "react";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import { EditorComposer } from "./context/lexical-composer";
import { type EditorContentType } from "./editor";
import clsx from "clsx";
import ImageModal from "../modals/image-preview";

export const EditorPreview: React.FC<{
  action: "description" | "comment";
  content: EditorContentType;
  imageURL?: string;
  className?: string;
}> = ({ action, content, imageURL, className }) => {
  const [jsonState] = useState<EditorContentType>(content);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = imageURL ? imageURL.split(",").map((url) => url.trim()) : [];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedImage(null);
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url);
  };

  const isDocument = (url: string) => {
    return /\.(pdf|doc|docx)$/i.test(url);
  };

  let documentIndex = 1;

  console.log("commentsjson", content)

  return (
    <EditorComposer readonly={true} jsonState={jsonState}>
      <div
        className={`w-full rounded-md bg-transparent relative`}
      >
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable
              className={clsx(
                "w-full resize-none overflow-hidden text-ellipsis rounded-[3px] outline-none",
                className
              )}
            />
          }
          placeholder={
            <div className="pointer-events-none absolute left-0 top-0 flex h-full select-none items-center px-1 text-sm text-gray-500 dark:text-darkSprint-10">
              Add your {action} here...
            </div>
          }
        />
        {action === "comment" && (
          <div className="flex my-2 gap-4 flex-nowrap">
            {images &&
              images.map((image, index) => (
                <div key={index} className="flex items-center gap-2">
                  {isImage(image) && (
                    <img
                      height={50}
                      width={50}
                      src={image}
                      alt={`image-preview-${index}`}
                      onClick={() => handleImageClick(image)}
                      className="cursor-pointer"
                    />
                  )}

                  {isDocument(image) && (
                    <a
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline dark:text-darkSprint-0"
                    >
                      View Document {documentIndex++}
                    </a>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      <CodeHighlightPlugin />
      <ListPlugin />

      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={selectedImage}
      />
    </EditorComposer>
  );
};
