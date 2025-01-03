import React from 'react';
import clsx from 'clsx';

const Timelist: React.FC<{ Time: Record<string, string> }> = ({ Time }) => {
  return (
    <div className="flex space-x-2">
      {Object.entries(Time)
        .filter(([_, time]) => time) 
        .map(([status, time]) => (
        <div
          key={status}
          className={clsx(
            'flex h-4 w-fit items-center justify-center rounded-full px-2 text-xs font-semibold',
            status === 'To Do' && 'bg-todo text-black',
            status === 'In Progress' && 'bg-inprogress text-white',
            status === 'Done' && 'bg-done text-white'
          )}
        >
          <span>{time}</span>
        </div>
      ))}
    </div>
  );
};

export default Timelist;
