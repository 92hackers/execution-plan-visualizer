/**
 * Plan Tab
 */

import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import { Tooltip } from 'react-tippy'
import _ from 'lodash'
import SplitPane, { Pane } from 'react-split-pane'

import '@/splitpane.css'

import { IPlan, IViewOptionsAnyOne, IViewOptions } from '@/iplan'

import { PlanTabSettingsPane } from './PlanTabSettingsPane'


export interface PlanTabProps {
  plan: IPlan,
  viewOptions: IViewOptions,
  handleViewOptionsChange: (options: IViewOptionsAnyOne) => void,
}

export function PlanTab({
  plan,
  viewOptions,
  handleViewOptionsChange,
}: PlanTabProps) {
  function handleResize(newSize: number) {
    handleViewOptionsChange({ diagramWidth: newSize })
  }

  return (
    <div className="flex-grow-1 d-flex overflow-hidden">
      <div className="flex-grow-1 overflow-hidden">
        <SplitPane
          className='default-theme'
          split={'vertical'}
          onChange={handleResize}
          size={viewOptions.diagramWidth}
        >
          {
            viewOptions.showDiagram && (
              <Pane
                className="d-flex"
                size={viewOptions.diagramWidth}
              >
                <div>TODO: place diagram component</div>
              </Pane>
            )
          }
          <Pane className="plan d-flex flex-column flex-grow-1 grab-bing overflow-auto">
            <ul className="main-plan p-2 mb-0">
              <li>plan node here</li>
            </ul>
            {
              plan.ctes.length > 0 && (
                <ul className="init-plans p-2 mb-0">
                  <li>ctes here</li>
                </ul>
              )
            }
          </Pane>
        </SplitPane>
      </div>
      <PlanTabSettingsPane
        viewOptions={viewOptions}
        handleViewOptionsChange={handleViewOptionsChange}
      />
    </div>
  )
}