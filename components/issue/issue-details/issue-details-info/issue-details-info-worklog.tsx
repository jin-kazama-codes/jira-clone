import React, { useCallback, useEffect, useState } from 'react'
import WorklogDlt from '@/components/modals/worklogdelete';
import EditWorklog from '@/components/modals/editworklog';


interface WorklogEntry {
  issueId: string;
  userName: string;
  timeLogged: string;
  workDescription: string;
}

interface Issue {
  id: string;
}

interface WorklogProps {
  issue: Issue | null;
}

const Worklog: React.FC<WorklogProps> = ({ issue }) => {
  const [work, setWork] = useState<WorklogEntry[]>([]); // Initialize as an array
  const [loading, setLoading] = useState<boolean>(true); // Track loading state


  const getWorklog = useCallback(async (issueId: any) => {
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const response = await fetch(`/api/worklog?issueId=${issueId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: WorklogEntry[] = await response.json();
      setWork(result.worklogs); // Store the result in state
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  }, []);

  const calculateTimeLogged = (time) => {
    const now = new Date();
    const diff = now - new Date(time); // Difference in milliseconds

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };


  useEffect(() => {
    getWorklog(issue.id);
  }, []);

  return (
    <div className='mt-2'>
      {loading ? (
        <p>Loading...</p>
      ) : work.length > 0 ? (
        work.map((wrk, index) => (
          <>
            <div className='flex space-x-1.5 items-center' key={index + 1}>
              <p className="font-bold text-xm text-gray-600 "> {wrk.userName}</p>
              <p className='text-sm font-medium text-gray-500'>Logged <span className="font-bold text-black"> {wrk.timeLogged}</span> </p>
              <p className='text-sm font-medium pl-2 text-gray-500'>{calculateTimeLogged(wrk.createdAt)} Ago</p>
            </div>
            <div className='text-base p-3'> {wrk.workDescription} </div>
            <div className='flex space-x-2 items-center font-bold'>
              <EditWorklog
                issue={issue}
                worklog={wrk}
              >
                <button className="bg-transparent text-sm font-bold text-gray-500 underline-offset-2 hover:underline"
                >Edit</button>
              </EditWorklog>
              <WorklogDlt
                issue={issue}
                worklog={wrk}>
                <button
                  className='bg-transparent text-sm  font-bold text-gray-500 underline-offset-2 hover:underline'
                >Delete</button>
              </WorklogDlt>
            </div>
            <hr className='mb-4' />
          </>
        ))
      ) : (
        <p className='mb-4'>No worklog entries found.</p>
      )}

    </div>

  );
};

export default Worklog;
