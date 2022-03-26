/**
 * Plan node body
 */

import React from 'react'

import Node from '@/inode'

export interface PlanNodeBodyProps {
  showDetails: boolean,
  GeneralTab: React.ReactElement,
  IOBufferTab: React.ReactElement,
  OutPutTab: React.ReactElement,
  WorkersTab: React.ReactElement,
  MiscTab: React.ReactElement,
}
export function PlanNodeBody({
  showDetails,
  GeneralTab,
  IOBufferTab,
  OutPutTab,
  WorkersTab,
  MiscTab,
}: PlanNodeBodyProps) {
  if (!showDetails) return null
  return (
    <div className='card-body tab-content'>
      {GeneralTab}
      {IOBufferTab}
      {OutPutTab}
      {WorkersTab}
      {MiscTab}
    </div>
  )
}