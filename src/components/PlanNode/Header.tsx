/**
 * Plan node header
 */

import React from 'react'
import classNames from 'classnames'
import { Tooltip } from 'react-tippy'

import Node from '@/inode';
import { IViewOptions } from '@/iplan';
import { ViewMode } from '@/enums';


function tipIconClassName(className: string) {
  return classNames(`p-0 d-inline-block mb-0 ml-1 text-nowrap alert ${className}`);
}

export interface PlanNodeHeaderProps {
  node: Node,
  nodeName: string,
  showDetails: boolean,
  setShowDetails: (show: boolean) => void,

  durationClass: string,
  costClass: string,
  estimationClass: string,
  rowsRemovedClass: string,
  heapFetchesClass: string,
  rowsRemoved: number,
  filterTooltip: string,

  isNeverExecuted: boolean,
  viewOptions: IViewOptions,
}

export function PlanNodeHeader({
  node,
  nodeName,
  showDetails,
  setShowDetails,
  durationClass,
  costClass,
  estimationClass,
  rowsRemovedClass,
  heapFetchesClass,
  rowsRemoved,
  filterTooltip,

  isNeverExecuted,
  viewOptions,
}: PlanNodeHeaderProps) {
  return (
    <div
      className='card-body header no-focus-outline'
      onClick={() => setShowDetails(!showDetails)}
    >
      <header className="mb-0">
        <h4 className="text-body">
          <a className="font-weight-normal small" href={`#plan/node/${node.nodeId}`}>#{node.nodeId}</a>
          {nodeName}
        </h4>
        <div className="float-right">
          {
            durationClass && (
              <Tooltip
                className={tipIconClassName(durationClass)}
                title='Slow'
              >
                <i className="fa fa-fw fa-clock"></i>
              </Tooltip>
            )
          }
          {
            costClass && (
              <Tooltip
                className={tipIconClassName(costClass)}
                title='Cost is high'
              >
                <i className="fa fa-fw fa-dollar-sign"></i>
              </Tooltip>
            )
          }
          {
            estimationClass && (
              <Tooltip
                className={tipIconClassName(estimationClass)}
                title='Bad estimation for number of rows'
              >
                <i className="fa fa-fw fa-thumbs-down"></i>
              </Tooltip>
            )
          }
          {
            rowsRemovedClass && (
              <Tooltip
                className={tipIconClassName(rowsRemovedClass)}
                title={filterTooltip}
              >
                <i className="fa fa-fw fa-filter"></i>
              </Tooltip>
            )
          }
          {
            heapFetchesClass && (
              <Tooltip
                className={tipIconClassName(heapFetchesClass)}
                title='Heap Fetches number is high'
              >
                <i className="fa fa-fw fa-exchange-alt"></i>
              </Tooltip>
            )
          }
          {
            rowsRemoved && !rowsRemovedClass && (
              <Tooltip
                className='p-0  d-inline-block mb-0 ml-1 text-nowrap'
                title={filterTooltip}
              >
                <i className="fa fa-fw fa-filter text-muted"></i>
              </Tooltip>
            )
          }
        </div>
        {
          viewOptions.viewMode === ViewMode.FULL && isNeverExecuted && (
            <span className='node-duration text-warning'>
              Never executed
            </span>
          )
        }
      </header>
    </div>
  )
}