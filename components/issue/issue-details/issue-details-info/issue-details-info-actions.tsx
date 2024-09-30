import { NotImplemented } from "@/components/not-implemented";
import { ChildrenTreeIcon } from "@/components/svgs";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { useRef, useState } from "react";
import { BiLink } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";

const IssueDetailsInfoActions: React.FC<{
  onAddChildIssue: () => void;
  variant?: "sm" | "lg";
}> = ({ onAddChildIssue, variant = "sm" }) => {
  // const [image, setImage] = useState<File | null>(null);
  // const [uploading, setUploading] = useState(false);
  // const [imageUrl, setImageUrl] = useState('');
  // const fileInputRef = useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  // const handleImageUpload = async (file: File) => {
  //   const formData = new FormData();
  //   formData.append('image', file);

  //   setUploading(true);

  //   const response = await fetch('/api/attachment', {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   const result = await response.json();
  //   setUploading(false);
    
  //   if (!response.ok) {
  //     console.error('Upload failed:', result.error);
  //     return;
  //   }

  //   if (result.imageUrl) {
  //     setImageUrl(result.imageUrl);
  //   }
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files?.[0];
  //   if (selectedFile) {
  //     setImage(selectedFile);
  //     handleImageUpload(selectedFile); // Trigger the upload immediately
  //   }
  // };

  // const handleButtonClick = () => {
  //   // Trigger the file input click
  //   fileInputRef.current?.click();
  // };

  return (
    <div className="flex gap-x-2 text-gray-700">
      {/* Attachment Button 
      <form>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          ref={fileInputRef} // Attach the ref to the input
          style={{ display: 'none' }} // Hide the file input
        />
        <Button
          customColors
          className="flex items-center rounded-full whitespace-nowrap bg-gray-100 hover:bg-gray-200"
          onClick={handleButtonClick} // Handle button click
        >
          <CgAttachment className="rotate-45 text-xl" />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Attach"}
          </span>
        </Button>
      </form>
      {uploading && <span>Uploading...</span>}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" width="300px" />
        </div>
      )} */}

      <TooltipWrapper text="Add child issue">
        <Button
          onClick={onAddChildIssue}
          customColors
          className="flex items-center rounded-full whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <ChildrenTreeIcon />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Add a child issue"}
          </span>
        </Button>
      </TooltipWrapper>
      <NotImplemented feature="link">
        <Button
          customColors
          className="flex items-center rounded-full whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <BiLink className="text-xl" />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Link issue"}
          </span>
        </Button>
      </NotImplemented>
      <NotImplemented feature="add apps">
        <Button
          customColors
          className="flex items-center rounded-full whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <BsThreeDots className="text-xl" />
        </Button>
      </NotImplemented>
    </div>
  );
};

export { IssueDetailsInfoActions };
