import clsx from "clsx";
import { type ReactNode } from "react";

const Container: React.FC<{
  className?: string;
  children: ReactNode;
  screen?: boolean;
  board?: boolean;
  backlog?: boolean;
}> = ({ className, screen, children, board = false, backlog= false }) => {
  return (
    <div
      className={clsx(
        screen
          ? "item flex h-screen  w-screen items-center justify-center"
          : `${board ? 'max-w-7xl': 'max-w-9xl'} mx-auto px-4  sm:px-6 sm:py-4 lg:px-8 ${backlog ? "pr-0" : ""}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export { Container };
