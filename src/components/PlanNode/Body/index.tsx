/**
 * Plan node body
 */

import React from 'react'

import Node from '@/inode'
import { NodeProp } from '@/enums'
import * as filters from '@/filters'

export interface PlanNodeBodyProps {
  node: Node,
  showDetails: boolean,
}
export function PlanNodeBody({
  node,
  showDetails,
}: PlanNodeBodyProps) {
  if (!showDetails) return null

  function formattedProp(propName: keyof typeof NodeProp): string {
    const property = NodeProp[propName];
    return filters!.formatNodeProp(property, node[property]);
  }

  return (
    <div className='card-body tab-content'>

    </div>
  )
}