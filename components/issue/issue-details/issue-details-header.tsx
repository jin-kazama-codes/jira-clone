import { MdClose } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { IssueDropdownMenu } from "../issue-menu";
import { DropdownTrigger } from "../../ui/dropdown-menu";
import { IssuePath } from "../issue-path";
import { type IssueType } from "@/utils/types";
import { NotImplemented } from "@/components/not-implemented";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { useCookie } from "@/hooks/use-cookie";

const IssueDetailsHeader: React.FC<{
  issue: IssueType;
  setIssueKey: React.Dispatch<React.SetStateAction<string | null>>;
  isInViewport: boolean;
  detailPage?: boolean;
}> = ({ issue, setIssueKey, isInViewport, detailPage }) => {
  const user = useCookie("user");
  if (!issue) return <div />;
  return (
    <div
      data-state={isInViewport ? "inViewport" : "notInViewport"}
      className="sticky top-0 z-10 flex h-fit w-full items-center justify-between dark:text-dark-50 dark:bg-darkSprint-10 dark:border-darkSprint-30 border-transparent bg-white p-0.5 [&[data-state=notInViewport]]:border-b border-b-black"
    >
      <IssuePath issue={issue} setIssueKey={setIssueKey} />
      <div className="relative flex items-center gap-x-0.5">
        {/* <NotImplemented feature="watch">
          <Button customColors className="bg-transparent rounded-full hover:bg-gray-200">
            <MdRemoveRedEye className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="like">
          <Button customColors className="bg-transparent rounded-full hover:bg-gray-200">
            <AiOutlineLike className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="share">
          <Button customColors className="bg-transparent rounded-full hover:bg-gray-200">
            <MdOutlineShare className="text-xl" />
          </Button>
        </NotImplemented> */}
        {(user?.role === "admin" || user?.role === "manager") && (
          <IssueDropdownMenu issue={issue}>
            <DropdownTrigger
              asChild
              className="rounded-m flex h-fit items-center gap-x-2 bg-opacity-30 px-1.5 text-xs font-semibold focus:ring-2"
            >
              <div className="invisible rounded-full px-1.5 py-1.5 text-gray-700 group-hover:visible group-hover:bg-slate-100 group-hover:hover:bg-slate-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-slate-700 [&[data-state=open]]:text-white">
                <BsThreeDots className="text-black sm:text-xl" />
              </div>
            </DropdownTrigger>
          </IssueDropdownMenu>
        )}
        {!detailPage && (
          <Button
            customColors
            className="rounded-full dark:hover:bg-darkSprint-30 bg-transparent hover:bg-gray-200"
            onClick={() => setIssueKey(null)}
          >
            <MdClose className="text-2xl" />
          </Button>)
        }
      </div>
    </div>
  );
};

export { IssueDetailsHeader };
