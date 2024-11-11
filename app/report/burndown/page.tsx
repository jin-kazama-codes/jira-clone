import { Burndown } from '@/components/burndown'
import withProjectLayout from "@/app/project-layout/withProjectLayout";
import React from 'react'

const BurndownReport = () => {
  return (
    <div className='max-w-9xl mx-auto px-4 sm:px-6 sm:py-4 lg:px-8 h-full'>
    <Burndown />
    </div>
  )
}

export default withProjectLayout(BurndownReport)