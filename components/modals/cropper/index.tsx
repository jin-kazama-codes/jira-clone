import { useRef, useEffect, useState } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropperModal = ({ isOpen, onClose, selectedFile, onCropComplete }) => {
  const cropperRef = useRef(null);
 

  useEffect(() => {
    if (isOpen && cropperRef.current?.cropper) {
      const cropper = cropperRef.current.cropper;
      const cropperElement = cropperRef.current.querySelector(".cropper-canvas");

      if (cropperElement) {
        cropperElement.addEventListener("ready", () => {
          cropper.reset();
          cropper.zoomTo(0); // Fully zoomed out
          cropper.center(); // Center the image
        });
      }

      // Clean up event listener on unmount
      return () => {
        if (cropperElement) {
          cropperElement.removeEventListener("ready");
        }
      };
    }
  }, [isOpen]);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper
        .getCroppedCanvas({
          width: 400,
          height: 400,
        })
        .toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], "cropped-image.jpg", {
              type: blob.type,
            });
            onCropComplete(croppedFile);
          }
        });
    }
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg overflow-hidden">
          <h2 className="text-lg text-black font-bold mb-4">Crop Image</h2>
          <div className="relative w-full max-h-[400px] overflow-hidden">
            
              <Cropper
                src={selectedFile} // Pass the object URL here
                style={{ height: "100%", width: "100%" }}
                aspectRatio={1} // Maintain a square crop
                guides={false}
                cropBoxResizable={false}
                cropBoxMovable={false}
                viewMode={1} // Allow image to be fully visible and not cropped
                dragMode="move"
                autoCropArea={1} // Ensure the full image area is shown
                background={true}
                ref={cropperRef}
              />
            
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Crop
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CropperModal;
