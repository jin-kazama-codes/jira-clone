import { useIssueDetails } from "@/hooks/query-hooks/use-issue-details";
import { type GetIssueCommentResponse } from "@/app/api/issues/[issueId]/comments/route";
import {
  Editor,
  type EditorContentType,
} from "@/components/text-editor/editor";
import { useKeydownListener } from "@/hooks/use-keydown-listener";
import { Fragment, useEffect, useRef, useState } from "react";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { type SerializedEditorState } from "lexical";
import { type IssueType } from "@/utils/types";
import { Avatar } from "@/components/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { EditorPreview } from "@/components/text-editor/preview";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { DefaultUser } from "@prisma/client";
import { useCookie } from "@/hooks/use-cookie";
import { CgAttachment } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
dayjs.extend(relativeTime);

const Comments: React.FC<{ issue: IssueType }> = ({ issue }) => {
  const scrollRef = useRef(null);
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [isInViewport, ref] = useIsInViewport();
  const { comments, addComment } = useIssueDetails();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const user = useCookie("user");

  const [image, setImage] = useState<File[] | null>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<String[] | null>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0 || files.length > 5) {
      alert("You can upload up to 5 files.");
      setImage(null)
      return;
    }

    const fileURLs: string[] = [];

    // Loop through each file and upload to S3
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Prepare formData for the API request
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      // Upload to the backend (S3) and get the file URL
      try {
        const response = await fetch("/api/attachment", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          fileURLs.push(data.fileUrl);
        } else {
          console.error("Upload failed:", data.error);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setUploading(false);

    // After all files are uploaded, update the state with the file URLs
    if (fileURLs.length > 0) {
      setImageUrl(fileURLs);
    } else {
      console.error("No file URLs returned.");
    }
  };

  useKeydownListener(scrollRef, ["m", "M"], handleEdit);
  function handleEdit(ref: React.RefObject<HTMLElement>) {
    setIsWritingComment(true);
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }

  function handleSave(state: SerializedEditorState | undefined) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!state) {
      setIsWritingComment(false);
      return;
    }

    const stringifiedImageUrl = imageUrl?.join(", ");

    // Create the comment data object
    const commentData = {
      issueId: issue.id,
      content: JSON.stringify(state),
      authorId: user!.id,
      imageURL: stringifiedImageUrl,
    };

    addComment(commentData);
    setImage(null);
    setImageUrl([]);
    setIsWritingComment(false);
  }

  function handleDelete(index: number) {
    const updatedImages = [...image];
    updatedImages.splice(index, 1);

    const updatedImageUrls = [...imageUrl];
    updatedImageUrls.splice(index, 1);

    setImage(updatedImages);
    setImageUrl(updatedImageUrls);
  }

  function handleCancel() {
    setIsWritingComment(false);
  }
  return (
    <Fragment>
      <h2>Comments</h2>
      <div className="sticky bottom-0 mb-5 w-full bg-white">
        <div ref={scrollRef} id="dummy-scroll-div" />
        {isWritingComment ? (
          <Editor
            action="comment"
            content={undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="">
            <AddComment
              user={user}
              onAddComment={() => handleEdit(scrollRef)}
              commentsInViewport={isInViewport}
            />
            <form encType="multipart/form-data" className="ml-10">
              <input
                type="file"
                onChange={(e) => {
                  e.preventDefault();
                  const selectedFiles = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  setImage(selectedFiles); // Set the selected files in state
                  handleImageUpload(e);
                }}
                multiple
                accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain"
                ref={fileInputRef} // Attach the ref to the input
                style={{ display: "none" }} // Hide the file input
              />
              <div className="">
                {uploading && !image ? (
                  <div className="loader"></div>
                ) : (
                  <Button
                    type="button"
                    customColors
                    className="flex gap-2 whitespace-nowrap rounded-lg  hover:bg-gray-100"
                    onClick={handleButtonClick} // Handle button click
                  >
                    <CgAttachment className="rotate-45 text-xl" />
                    <span className="">Attach</span>
                  </Button>
                )}
                {image && (
                  <div className="flex items-center flex-wrap mt-2 gap-2">
                    {image.map((img, index) => (
                      <div key={index} className="flex items-center gap-2 ">
                        <div className="whitespace-nowrap font-mono text-sm">
                          {img?.name}{" "}
                        </div>
                        <span
                          onClick={() => handleDelete(index)}
                          className="cursor-pointer"
                        >
                          <MdDelete className="text-lg text-red-600" />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      <div ref={ref} className="flex flex-col gap-y-5 pb-5">
        {comments?.map((comment) => (
          <CommentPreview key={comment.id} comment={comment} user={user} />
        ))}
      </div>
    </Fragment>
  );
};

const CommentPreview: React.FC<{
  comment: GetIssueCommentResponse["comment"];
  user: DefaultUser | undefined | null;
}> = ({ comment, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { updateComment, deleteComment } = useIssueDetails();

  function handleSave(state: SerializedEditorState | undefined) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateComment({
      issueId: comment.issueId,
      commentId: comment.id,
      content: JSON.stringify(state),
    });
    setIsEditing(false);
  }

  function handleDelete() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    // Call deleteComment from useIssueDetails hook
    deleteComment.mutate({
      issueId: comment.issueId,
      commentId: comment.id,
    });
  }

  return (
    <div className="flex bg-transparent w-full gap-x-2">
      <Avatar
        src={comment.author?.avatar ?? ""}
        alt={`${comment.author?.name ?? "Guest"}`}
      />
      <div className="w-full rounded-xl  p-2 px-3">
        <div className="flex items-center gap-x-3 text-xs">
          <span className="font-bold text-black ">
            {comment.author?.name}
          </span>
          <span className="text-gray-800">
            {dayjs(comment.createdAt).fromNow()}
          </span>

          <span
            data-state={comment.isEdited ? "edited" : "not-edited"}
            className="hidden text-gray-700 [&[data-state=edited]]:block"
          >
            (Edited)
          </span>
        </div>
        {isEditing ? (
          <Editor
            action="comment"
            content={
              comment.content
                ? (JSON.parse(comment.content) as EditorContentType)
                : undefined
            }
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            className="mt-2"
          />
        ) : (
          <EditorPreview
            action="comment"
            content={
              comment.content
                ? (JSON.parse(comment.content) as EditorContentType)
                : undefined
            }
            imageURL={comment.imageURL}
          />
        )}
        {comment.authorId == user?.id ? (
          <div className="mb-1">
            <Button
              onClick={() => setIsEditing(true)}
              customColors
              className="bg-transparent text-xs font-medium text-gray-800 underline-offset-2 hover:underline"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              customColors
              className="bg-transparent text-xs font-medium text-gray-800 underline-offset-2 hover:underline"
            >
              Delete
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const AddComment: React.FC<{
  onAddComment: () => void;
  user: DefaultUser | undefined | null;
  commentsInViewport: boolean;
}> = ({ onAddComment, user, commentsInViewport }) => {
  function handleAddComment(event: React.MouseEvent<HTMLInputElement>) {
    event.preventDefault();
    onAddComment();
  }
  return (
    <div
      data-state={commentsInViewport ? "inViewport" : "notInViewport"}
      className="flex w-full gap-x-2  border-transparent py-3 [&[data-state=notInViewport]]:border-gray-200"
    >
      <div className="mt-2">
        <Avatar src={user?.avatar} alt={user ? user.name : "Guest"} />
      </div>
      <div className="w-11/12">
        <label htmlFor="add-comment" className="sr-only">
          Add Comment
        </label>
        <input
          onMouseDown={handleAddComment}
          type="text"
          id="add-comment"
          placeholder="Add a comment..."
          className="w-full rounded-xl border border-gray-300 px-4 py-2 placeholder:text-sm"
        />
        {/* <p className="my-2 text-xs text-gray-500">
          <span className="font-bold">Pro tip:</span>
          <span> press </span>
          <span className="rounded-full bg-gray-300 px-1 py-0.5 font-bold">
            M
          </span>
          <span> to comment </span>
        </p> */}
      </div>
    </div>
  );
};

export { Comments };
