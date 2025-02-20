import { calculatePercentage, calculateTimeRemaining } from "@/utils/helpers";

const ProgressBar = ({ timeSpent, estimateTime }) => {
  const percentage = calculatePercentage(timeSpent, estimateTime);
  const remainingTime = calculateTimeRemaining(timeSpent, estimateTime);

  const progressBarColor = percentage > 100 ? "bg-orange-500" : "bg-green-500";

  return (
    <div className=" cursor-pointer">
      {/* Progress Bar */}
      <div className="w-[150px] bg-gray-200 dark:bg-darkSprint-20 rounded-lg h-2">
        <div
          className={`${progressBarColor} h-full rounded-lg`}
          style={{ width: `${Math.min(percentage, 100)}%`, transition: 'width 0.5s ease-in-out' }}
        ></div>
      </div>

      {/* Time Logging Information */}
      <div className="mt-2">
        {timeSpent === '0' || !timeSpent ? (
          <>
            <p className="text-sm text-gray-700 dark:text-dark-50">No time logged</p>
            <p className="text-sm text-gray-700 dark:text-dark-50">{estimateTime}</p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700 dark:text-dark-50">Time Spent : {timeSpent}</p>
            <p className="text-sm text-gray-700 whitespace-nowrap dark:text-dark-50">Remaining Time : {remainingTime}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;