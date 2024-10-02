import { useFiltersContext } from "@/context/use-filters-context";
import { useProject } from "@/hooks/query-hooks/use-project";
import { Button } from "./ui/button";
import { Avatar } from "./avatar";
import { UserModal } from './modals/add-people/index'
import { AddPeopleIcon } from "./svgs";
import { useCookie } from "@/hooks/use-cookie";
import { TooltipWrapper } from "./ui/tooltip";

const colorPalette = [
  "#4A9D8E", "#6A9AB8", "#8F7BAE", "#D5A8A1", "#C28C86", "#A0C9C4",
  "#6BB9A6", "#9BBF98", "#8E94C7", "#C18B91", "#7A8F97", "#B19EB1",
  "#6D9DC5", "#A8C9A6", "#89A9B4"
];

const Members = () => {
  const { members } = useProject();
  const { assignees, setAssignees } = useFiltersContext();
  const unassigned = {
    id: "unassigned",
    name: "Unassigned",
    avatar: undefined,
    email: "",
  };
  const user = useCookie('user');

  function handleAssigneeFilter(id: string) {
    setAssignees((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      return [...prev, id];
    });
  }

  function getInitials(name: string) {
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.toUpperCase();
  }

  function getColorForInitial(index: number) {
    return colorPalette[index % colorPalette.length];
  }

  if (!members) return <div />;

  return (
    <div className="flex items-center">
      {[...members, unassigned].map((member, index) => {
        const initials = getInitials(member.name);
        const bgColor = getColorForInitial(index); // Use color palette based on index
        return (
          <div
            key={member.id}
            style={{ zIndex: members.length - index }}
            className="hover:!z-10"
          >
            <Button
              onClick={() => handleAssigneeFilter(member.id)}
              customColors
              customPadding
              data-state={
                assignees.includes(member.id) ? "selected" : "not-selected"
              }
              className="-mx-1 flex border-spacing-2 rounded-full border-2 border-transparent bg-white p-0.5 transition-all duration-75 hover:-mt-1.5 [&[data-state=selected]]:border-inprogress"
            >
              {member.avatar ? (
                <Avatar src={member.avatar} alt={`${member.name}`} />
              ) : (
                <TooltipWrapper text={member.name}>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="text-white font-bold">{initials}</span>
                </div>
                </TooltipWrapper>
              )}
            </Button>
          </div>
        );
      })}

      {/* <NotImplemented feature="add people"> */}
      {(user?.role === "admin" ||
        user?.role === "manager") && (
          <UserModal>
            <button>
              <AddPeopleIcon
                className="ml-3 rounded-full bg-gray-200 p-1 text-gray-500"
                size={35}
              />
            </button>
          </UserModal>)}
      {/* </NotImplemented> */}
    </div>
  );
};

export { Members };
