/**
 * Plan node header
 */

import React, { useMemo } from 'react'
import Tippy from '@tippyjs/react'

import Node from '@/inode'
import { NodeProp } from '@/enums'
import { IViewOptions } from '@/iplan'
import { ViewMode } from '@/enums'

import { HelpService } from '@/services/help-service'

const helpService = new HelpService()

export interface PlanNodeHeaderProps {
  node: Node,
  showDetails: boolean,
  setShowDetails: (show: boolean) => void,
  viewOptions: IViewOptions,

  Title: React.ReactElement,
  HeaderDetail: React.ReactElement,
  HeaderProgressBar: React.ReactElement,
}

export function PlanNodeHeader({
  node,
  showDetails,
  setShowDetails,
  viewOptions,

  Title,
  HeaderDetail,
  HeaderProgressBar,
}: PlanNodeHeaderProps) {

  const allWorkersLaunched = useMemo(() => {
    return !node[NodeProp.WORKERS_LAUNCHED] ||
      node[NodeProp.WORKERS_PLANNED] === node[NodeProp.WORKERS_LAUNCHED]
  }, [node])

  const handleShowDetails = (showDetails: boolean) => () => {
    setShowDetails(!showDetails)
  }

  return (
    <div
      className='card-body header no-focus-outline'
      onClick={handleShowDetails(showDetails)}
    >
      {Title}
      {HeaderDetail}
      {
        !allWorkersLaunched && viewOptions.viewMode === ViewMode.FULL && (
          <Tippy content={helpService.getHelpMessage('workers planned not launched')}>
            <span>
              <i className="fa fa-exclamation-triangle"></i>&nbsp;
              <span>Not all workers launched</span>
            </span>
          </Tippy>
        )
      }
      <div className="clearfix"></div>
      {HeaderProgressBar}
    </div>
  )
}