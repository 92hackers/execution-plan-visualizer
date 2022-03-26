/**
 * Cost progressbar
 */

import React from "react";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { Metric, NodeProp } from "@/enums";

export interface CostProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
}
export function CostProgressBar({
  index,
  node,
  plan,
  viewOptions,
}: CostProgressBarProps) {
  if (viewOptions.metric !== Metric.cost) return null
  return (
    <div
      className="progress rounded-0 align-items-center bg-transparent"
      style={{ height: 5 }}
      key={'node' + index + 'cost'}
    >
      <div
        className="bg-secondary"
        role="progressbar"
        style={{
          height: 5,
          width: Math.round(node[NodeProp.EXCLUSIVE_COST] / (plan.planStats.maxCost || 0) * 100) + '%',
        }}
      />
    </div>
  )
}