/**
 * Header details display.
 */

import React from 'react'
import classNames from 'classnames'

import { IViewOptions } from '@/iplan'
import Node from '@/inode';
import { ViewMode, NodeProp } from '@/enums';
import * as filters from '@/filters'

export interface HeaderDetailProps {
  node: Node,
  viewOptions: IViewOptions,
  showDetails: boolean,
  onClickCTE: (cteName: string) => void,
}
export function HeaderDetail({
  node,
  viewOptions,
  showDetails,
  onClickCTE,
}: HeaderDetailProps) {
  // Don't display header details on non-full view mode.
  if (viewOptions.viewMode !== ViewMode.FULL) return null

  return (
    <div className='text-left text-monospace'>
      {
        node[NodeProp.RELATION_NAME] && (
          <div className={classNames({'line-clamp-2': !showDetails})}>
            <span className="text-muted">on&nbsp;</span>
            {node[NodeProp.SCHEMA] && <span>{node[NodeProp.SCHEMA]}.</span>}
            {node[NodeProp.RELATION_NAME]}
            {
              node[NodeProp.ALIAS] && (
                <span>
                  <span className='text-muted'>as</span>
                  {node[NodeProp.ALIAS]}
                </span>
              )
            }
          </div>
        )
      }
      {
        node[NodeProp.GROUP_KEY] && (
          <div className={classNames({'line-clamp-2': !showDetails})}>
            <span className="text-muted">by</span>&nbsp;
            <span dangerouslySetInnerHTML={{ __html: filters.keysToString(node[NodeProp.GROUP_KEY]) }}></span>
          </div>
        )
      }
      {
        node[NodeProp.SORT_KEY] && (
          <div className={classNames({'line-clamp-2': !showDetails})}>
            <span className="text-muted">by</span>&nbsp;
            <span dangerouslySetInnerHTML={{ __html: filters.sortKeys(node[NodeProp.SORT_KEY], node[NodeProp.PRESORTED_KEY]) }}></span>
          </div>
        )
      }
      {
        node[NodeProp.JOIN_TYPE] && (
          <div>
            {node[NodeProp.JOIN_TYPE]}
            <span className="text-muted">join</span>
          </div>
        )
      }
      {
        node[NodeProp.INDEX_NAME] && (
          <div className={classNames({'line-clamp-2': !showDetails})}>
            <span className="text-muted">using</span>&nbsp;
            <span dangerouslySetInnerHTML={{ __html: filters.keysToString(node[NodeProp.INDEX_NAME]) }}></span>
          </div>
        )
      }
      {
        node[NodeProp.HASH_CONDITION] && (
          <div className={classNames({'line-clamp-2': !showDetails})}>
            <span className="text-muted">on</span>&nbsp;
            <span dangerouslySetInnerHTML={{ __html: filters.keysToString(node[NodeProp.HASH_CONDITION]) }}></span>
          </div>
        )
      }
      {
        node[NodeProp.CTE_NAME] && (
              <a
                className="text-reset"
                onClick={() => onClickCTE(`CTE ${node[NodeProp.CTE_NAME]}`)}
                href="#"
              >
                <i className="fa fa-search text-muted"></i>&nbsp;
                <span className="text-muted">CTE&nbsp;</span>{ node[NodeProp.CTE_NAME] }
              </a>
        )
      }
    </div>
  )
}