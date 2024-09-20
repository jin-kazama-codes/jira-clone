"use client";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";

import { useFullURL } from "@/hooks/use-full-url";
import Link from "next/link";


const TopNavbar: React.FC = () => {
  const { user } = useUser();
  const [url] = useFullURL();
  
  return (
    <div className="flex h-12 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src="https://cdn.worldvectorlogo.com/logos/jira-3.svg"
          alt="Jira logo"
          width={25}
          height={25}
        />
        <span className="text-sm font-medium text-gray-600">F2 - Fintech</span>
        <Link href={'/project/create'} className="!bg-black !text-white ml-5 rounded-xl py-1 px-2 hover:!bg-slate-700">
          <span className="whitespace-nowrap text-white text-sm">Create Project</span>
        </Link>
      </div>
      {user ? (
        <div className="flex items-center gap-x-2">
          <span className="text-sm font-medium text-gray-600">
            {user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? "Guest"}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <div className="flex items-center gap-x-3">
          <div className="rounded-sm bg-inprogress px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600">
            <SignInButton mode="modal" redirectUrl={url} />
          </div>
        </div>
      )}
    </div>
  );
};

export { TopNavbar };
