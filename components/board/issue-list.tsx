import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { type IssueType } from "@/utils/types";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import clsx from "clsx";
import { statusMap } from "../issue/issue-select-status";
import { type IssueStatus } from "@prisma/client";
import { getPluralEnd } from "@/utils/helpers";

const IssueList: React.FC<{ status: IssueStatus; issues: IssueType[] }> = ({
  status,
  issues,
}) => {
  const [droppableEnabled] = useStrictModeDroppable();

  if (!droppableEnabled) {
    return null;
  }

  return (
    <div
      className={clsx(
        "mb-5 h-max min-h-fit w-[350px] rounded-xl  px-1.5  pb-3 border-2"
      )}
    >
      <h2 className="sticky top-0 -mx-1.5 -mt-1.5 mb-1.5 border-b-2 rounded-t-md px-2 py-3 text-md font-semibold text-gray-500">
        {statusMap[status]}{" "}
        {issues.filter((issue) => issue.status == status).length}
        {` ISSUE${getPluralEnd(issues).toUpperCase()}`}
      </h2>

      <Droppable droppableId={status}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className=" h-fit min-h-[10px] py-2"
          >
            {issues
              .sort((a, b) => a.boardPosition - b.boardPosition)
              .map((issue, index) => (
                <Issue key={issue.id} index={index} issue={issue} />
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export { IssueList };
