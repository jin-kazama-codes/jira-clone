import React from 'react'
import { IssueSkeleton } from '../skeletons'

const IssueListSkeleton = ({size = 10}) => {
  return (
    <div className="mt-3 flex flex-col gap-y-4 px-8">
        {[...Array(size).keys()].map((el, index) => (
          <IssueSkeleton key={index} size={index % 2 === 0 ? 300 : 400} />
        ))}
      </div>
  )
}

export default IssueListSkeleton