import { Velocity } from '@/components/velocity'
import withProjectLayout from "@/app/project-layout/withProjectLayout";
import React from 'react'

const VelocityReport = () => {
  return (
    <div className='max-w-9xl mx-auto px-4 sm:px-6 sm:py-4 lg:px-8 h-full'>
    <Velocity/>
    </div>
  )
}

export default withProjectLayout(VelocityReport)