import React from "react";
import clsx from "clsx";

const Timelist: React.FC<{ Time: Record<string, string> }> = ({ Time }) => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="flex space-x-2">
      {Object.entries(Time)
        .filter(([_, time]) => time)
        .map(([status, time]) => (
          <div
            key={status}
            className={clsx(
              "flex h-4 w-fit items-center justify-center rounded-full px-2 text-xs font-semibold",
              status === "TODO" && "bg-todo text-black",
              status === "IN_PROGRESS" && "bg-inprogress text-white",
              status === "DONE" && "bg-done text-white",
              !(
                status === "TODO" ||
                status === "IN_PROGRESS" ||
                status === "DONE"
              ) && "text-white bg-button"
            )}
          >
            <span>{time}</span>
          </div>
        ))}
    </div>
  );
};

export default Timelist;
