import React from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Create an anchor element
    const link = document.createElement("a");
    link.href = imageUrl;

    // Set the download attribute with a custom filename
    link.download = "image.jpg"; // Customize the filename as needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after clicking
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-10 rounded-lg max-w-2xl w-full mx-4">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        ><IoClose /></button>
        <div className="mt-8 mb-6 flex justify-center items-center">
          <Image
            src={imageUrl}
            alt={'Image'}
            width={400}
            height={300}
            className="object-cover"
          />
        </div>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
