import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { MdDriveFolderUpload } from "react-icons/md";
import axios from "axios";
import "cropperjs/dist/cropper.css";
import { Cropper } from "react-cropper";

const AccountSettingsModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedFileName, setCroppedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const cropperRef = useRef(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("/api/account");
        if (response.ok) {
          const result = await response.json();
          const account = result.account;
          setName(account?.name);
          setContactNumber(account?.contact);
        } else {
          console.error("Failed to fetch account data");
        }
      } catch (err) {
        console.error("Error fetching account data:", err);
      }
    };

    fetchAccountData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setCroppedFileName(file.name); // Save the original file name
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      });

      croppedCanvas.toBlob((blob) => {
        const croppedFile = new File(
          [blob],
          croppedFileName || "cropped-image.jpg",
          {
            type: "image/jpeg",
          }
        );
        setCroppedImage(croppedFile);
        setSelectedFile(null); // Hide Cropper
      });
    }
  };

  const uploadFileToS3 = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/attachment", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = logoUrl;

      if (croppedImage) {
        fileUrl = await uploadFileToS3(croppedImage);
        setLogoUrl(fileUrl);
      }

      const accountData = {
        name,
        contactNumber,
        logo: fileUrl,
      };

      await axios.post("/api/account", accountData);

      setIsOpen(false);
      setCroppedImage(null);
      setName("");
      setContactNumber("");
      setLogoUrl("");
    } catch (error) {
      console.error("Error updating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="max-h-screen overflow-y-auto">
          <ModalTitle>Account Settings</ModalTitle>
          <ModalDescription className="mt-1">
            Provide the information about your organization below
          </ModalDescription>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Logo
              </label>
              {selectedFile ? (
                <div className="mt-2">
                  <Cropper
                    src={selectedFile}
                    style={{ height: "300px", width: "100%" }}
                    aspectRatio={1}
                    guides={false}
                    ref={cropperRef}
                  />
                  <Button
                    type="button"
                    onClick={handleCrop}
                    className="mt-4 !bg-black text-white"
                  >
                    Crop & Save
                  </Button>
                </div>
              ) : croppedImage ? (
                <div className="mt-2">
                  <span className="block text-sm text-gray-600">
                    Selected image:{" "}
                    <strong>{croppedFileName.substring(0, 15)}...</strong>
                  </span>
                  <img
                    src={URL.createObjectURL(croppedImage)}
                    alt="Cropped"
                    className="mt-3 h-24 w-24 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-1 flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      className="relative flex items-center space-x-2 border border-gray-300 bg-white"
                      onClick={() => document.getElementById("logo").click()}
                    >
                      <MdDriveFolderUpload className="h-4 w-4" />
                      <span>Upload Logo</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-md bg-slate-100 px-2 py-1"
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Contact Number
              </label>
              <input
                type="number"
                id="contact"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="mb-3 mt-1 w-full rounded-md bg-slate-100 px-2 py-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-xl ${
                loading ? "!bg-white" : "!bg-black"
              }  text-white`}
            >
              {loading ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export default AccountSettingsModal;
