/**
 * Main tab content of Plan
 * 
 */

import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import _ from 'lodash'

import { IPlan, IViewOptions, IViewOptionsAnyOne } from '@/iplan'

import { PlanStats } from './PlanStats'
import { PlanTab } from './PlanTab'

export interface TabContentProps {
  validationMessage: string,
  activeTab: string,
  viewOptions: IViewOptions,
  plan: IPlan,
  handleViewOptionsChange: (options: IViewOptionsAnyOne) => void,
}

export function TabContent({
  validationMessage,
  activeTab,
  viewOptions,
  plan,
  handleViewOptionsChange,
}: TabContentProps) {
  if (validationMessage) {
    return (
      <div className='tab-content flex-grow-1 d-flex overflow-hidden'>
        <div className="flex-grow-1 d-flex justify-content-center">
          <div className="alert alert-danger align-self-center">{validationMessage}</div>
        </div>
      </div>
    )
  }

  return (
    <div className='tab-content flex-grow-1 d-flex overflow-hidden'>
      <div className={classNames('tab-pane flex-grow-1 overflow-hidden', {
        'show active d-flex': activeTab === 'plan',
        })}
      >
      <div className={classNames(
        `d-flex flex-column flex-grow-1 overflow-hidden ${viewOptions.viewMode} ${viewOptions.orientation}`)}
      >
        {
          plan && (
            <PlanStats
              viewOptions={viewOptions}
              planStats={plan.planStats}
              handleViewOptionsChange={handleViewOptionsChange}
            />
          )
        }
        <PlanTab
          plan={plan}
          viewOptions={viewOptions}
          handleViewOptionsChange={handleViewOptionsChange}
        />
      </div>
    </div>
   </div>
  )
}