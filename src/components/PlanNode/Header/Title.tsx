/**
 * Title component of Header component
 */

import React from 'react'
import classNames from 'classnames'
import Tippy from '@tippyjs/react';

import { IViewOptions } from '@/iplan';
import Node from '@/inode';
import { ViewMode } from '@/enums';

function tipIconClassName(className: string) {
  return classNames(`p-0 d-inline-block mb-0 ml-1 text-nowrap alert ${className}`);
}

export interface HeaderTitleProps {
  node: Node,
  nodeName: string,

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
export function HeaderTitle({
  node,
  nodeName,

  durationClass,
  costClass,
  estimationClass,
  rowsRemovedClass,
  heapFetchesClass,
  rowsRemoved,
  filterTooltip,

  isNeverExecuted,
  viewOptions,
}: HeaderTitleProps) {
  return (
    <header className="mb-0">
      <h4 className="text-body">
        <a
          className="font-weight-normal small mr-1"
          href={`#plan/node/${node.nodeId}`}
        >
          #{node.nodeId}
        </a>
        {nodeName}
      </h4>
      <div className="float-right">
        {
          durationClass && (
            <Tippy content='Slow'>
              <span className={tipIconClassName(durationClass)}>
                <i className="fa fa-fw fa-clock"></i>
              </span>
            </Tippy>
          )
        }
        {
          costClass && (
            <Tippy content='Cost is high'>
              <span className={tipIconClassName(costClass)}>
                <i className="fa fa-fw fa-dollar-sign"></i>
              </span>
            </Tippy>
          )
        }
        {
          estimationClass && (
            <Tippy content='Bad estimation for number of rows'>
              <span className={tipIconClassName(estimationClass)}>
                <i className="fa fa-fw fa-thumbs-down"></i>
              </span>
            </Tippy>
          )
        }
        {
          rowsRemovedClass && (
            <Tippy content={filterTooltip}>
              <span className={tipIconClassName(rowsRemovedClass)}>
                <i className="fa fa-fw fa-filter"></i>
              </span>
            </Tippy>
          )
        }
        {
          heapFetchesClass && (
            <Tippy content='Heap Fetches number is high'>
              <span className={tipIconClassName(heapFetchesClass)}>
                <i className="fa fa-fw fa-exchange-alt"></i>
              </span>
            </Tippy>
          )
        }
        {
          rowsRemoved > 0 && !rowsRemovedClass && (
            <Tippy content={filterTooltip}>
              <span className='p-0 d-inline-block mb-0 ml-1 text-nowrap'>
                <i className="fa fa-fw fa-filter text-muted"></i>
              </span>
            </Tippy>
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
  )
}