/**
 * Plan node header
 */

import React, { useMemo } from 'react'
import { Tooltip } from 'react-tippy'

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

  return (
    <div
      className='card-body header no-focus-outline'
      onClick={() => setShowDetails(!showDetails)}
    >
      {Title}
      {HeaderDetail}
      {
        !allWorkersLaunched && viewOptions.viewMode === ViewMode.FULL && (
          <Tooltip title={helpService.getHelpMessage('workers planned not launched')}>
            <i className="fa fa-exclamation-triangle"></i>&nbsp;
            <span>Not all workers launched</span>
          </Tooltip>
        )
      }
      <div className="clearfix"></div>
      {HeaderProgressBar}
    </div>
  )
}