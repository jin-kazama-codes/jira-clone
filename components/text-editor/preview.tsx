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
  imageURL: string;
  className?: string;
}> = ({ action, content, imageURL, className }) => {
  const [jsonState] = useState<EditorContentType>(content);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url);
  };

  const isDocument = (url: string) => {
    return /\.(pdf|doc|docx)$/i.test(url);
  };

  return (
    <EditorComposer readonly={true} jsonState={jsonState}>
      <div className={`w-full rounded-md bg-white ${action === "comment" ? 'flex' : 'relative'}`}>
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
            <div className="pointer-events-none absolute left-0 top-0 flex h-full select-none items-center px-1 text-sm text-gray-500">
              Add your {action} here...
            </div>
          }
        />
                {action === "comment" && (
          <div className="mr-5">
            {imageURL && isImage(imageURL) && (
              <img
                height={50}
                width={50}
                src={imageURL}
                alt="image-preview"
                onClick={handleImageClick} // Open modal on click
                className="cursor-pointer"
              />
            )}
            {imageURL && isDocument(imageURL) && (
              <a
                href={imageURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Document
              </a>
            )}
          </div>
        )}

        
      </div>
      
      <CodeHighlightPlugin />
      <ListPlugin />

      <ImageModal isOpen={isModalOpen} onClose={handleCloseModal} imageUrl={imageURL} />
    </EditorComposer>
  );
};
