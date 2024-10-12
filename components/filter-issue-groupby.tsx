import { FaChevronDown } from "react-icons/fa";
import { Button } from "./ui/button";
import { Dropdown, DropdownContent, DropdownItem, DropdownPortal, DropdownTrigger } from "./ui/dropdown-menu";

const IssueTypeGroupBy: React.FC = () => {
    return(
        <Dropdown>
      <DropdownTrigger className="rounded-xl border-2 transition-all duration-200 hover:bg-gray-200 border-gray-300 bg-gray-50 px-2 [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button
          customColors
          className="flex items-center  gap-x-4 "
        >
          <span className="text-sm">Group by</span>
          <FaChevronDown className="text-xs" />
        </Button>
      </DropdownTrigger>
      <DropdownPortal>
        <DropdownContent
          side="bottom"
          align="start"
          className="z-10 mt-2 w-32 rounded-[3px] border-[0.3px] bg-white py-2 shadow-md"
        >
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              className="px-3 py-1.5 text-sm hover:bg-gray-100"
            //   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //     onSelectChange(e, type)
            //   }
            >None
            </DropdownItem>
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              className="px-3 py-1.5 text-sm hover:bg-gray-100"
            //   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //     onSelectChange(e, type)
            //   }
            >Subtask
            </DropdownItem>
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
    );
}

export { IssueTypeGroupBy }