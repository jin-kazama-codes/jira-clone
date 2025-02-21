import {
    IssueSkeleton,
    SprintHeaderSkeleton,
    SprintSearchSkeleton,
    TitleSkeleton,
  } from "@/components/skeletons";
  
  const ProjectSkeleton = () => {
    return (
      <div role="status" className="flex animate-pulse flex-col gap-y-4 mt-5">
        <TitleSkeleton />
        <SprintSearchSkeleton />
        <SprintHeaderSkeleton />
        <div className="mt-3 flex flex-col gap-y-4 px-8">
          {[...Array(10).keys()].map((el, index) => (
            <IssueSkeleton key={index} size={index % 2 === 0 ? 300 : 400} />
          ))}
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  };
  
  export default ProjectSkeleton;
  