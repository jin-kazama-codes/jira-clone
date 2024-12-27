const IssueSkeleton: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-4">
        <div className="h-3 w-4 rounded-md bg-gray-300"></div>
        <div className="h-3 w-14 rounded-md bg-gray-300"></div>
        <div
          style={{ width: size }}
          className="h-3 rounded-md bg-gray-300"
        ></div>
      </div>
      <div className="flex items-center gap-x-4">
        <div
          style={{ width: size * 0.7 }}
          className="h-4 rounded-md bg-gray-300"
        ></div>
        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

const BreadCrumbSkeleton = () => {
  return (
    <div className="mb-3 flex items-center gap-x-4">
      <div className="h-3 w-16 rounded-full bg-gray-300 "></div>
      <div className="h-3 w-28 rounded-full bg-gray-300 "></div>
    </div>
  );
};

const TitleSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="h-4 w-40 rounded-md bg-gray-300 "></div>
      <div className="flex gap-x-2">
        {[...Array(3).keys()].map((el, index) => (
          <div key={index} className="h-8 w-8 rounded-md bg-gray-300"></div>
        ))}
      </div>
    </div>
  );
};

const SprintHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="h-4 w-48 rounded-md bg-gray-300 "></div>
      <div className="flex gap-x-2">
        <div className="h-8 w-16 rounded-md bg-gray-300"></div>
        <div className="h-8 w-8 rounded-md bg-gray-300"></div>
      </div>
    </div>
  );
};

const SprintSearchSkeleton = () => {
  return (
    <div className="mb-3 flex items-center justify-between py-2">
      <div className="flex items-center gap-x-3">
        <div className="h-10 w-32 rounded-md bg-gray-300"></div>
        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        <div className="ml-2 h-3 w-12 rounded-lg bg-gray-300"></div>
        <div className="ml-2 h-3 w-12 rounded-lg bg-gray-300"></div>
      </div>
      <div className="h-8 w-32 rounded-md bg-gray-300"></div>
    </div>
  );
};

const BoardColumnSkeleton = () => {
  return <div className="h-[550px] w-64 rounded-md bg-gray-300"></div>;
};

const RoadmapTableSkeleton = () => {
  return (
    <div className="relative h-fit rounded-md border-2 border-gray-300">
      <div className="h-12 border-b-2 border-gray-300 bg-gray-300"></div>
      <div className="flex flex-col">
        {[...Array(12).keys()].map((el, index) => (
          <div
            key={index}
            className="flex items-center gap-x-4 border-b px-6 py-2"
          >
            <IssueSkeleton size={index % 2 === 0 ? 300 : 400} />
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 h-12 border-b-2 border-gray-300 bg-gray-300"></div>
    </div>
  );
};

const SidebarSkeleton = () => {
  return (
    <div className="w-60 bg-white p-4 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center space-x-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
        <div className="h-4 w-32 animate-pulse rounded-xl bg-gray-300"></div>
      </div>

      {/* Sections */}
      {["PLANNING", "MY WORKSPACE", "CONFIGURATION", "REPORTS"].map(
        (section, index) => (
          <div key={section} className="mb-6">
            <div className="mb-3 h-4 w-24 animate-pulse rounded-xl bg-gray-300"></div>
            <div className="space-y-3">
              {[...Array(index === 3 ? 1 : 3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-4 w-4 animate-pulse rounded-xl bg-gray-300"></div>
                  <div className="h-4 w-24 animate-pulse rounded-xl bg-gray-300"></div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

const DocumentSkeleton = () => {
  return (
    <div className="space-y-6 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse h-8 bg-gray-200 group flex justify-between p-2 rounded-lg border cursor-pointer w-3/4"
          ></div>
        ))}
      </div>
      <div>
        <div className="space-y-3 mt-5">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse h-6 bg-gray-200 rounded w-full"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};


export {
  IssueSkeleton,
  BreadCrumbSkeleton,
  TitleSkeleton,
  DocumentSkeleton,
  SprintHeaderSkeleton,
  SprintSearchSkeleton,
  BoardColumnSkeleton,
  RoadmapTableSkeleton,
  SidebarSkeleton,
};
