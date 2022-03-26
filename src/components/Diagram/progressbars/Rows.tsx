/**
 * Rows progressbar
 */

import React from "react";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { Metric, NodeProp } from "@/enums";

export interface RowsProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
}
export function RowsProgressBar({
  index,
  node,
  plan,
  viewOptions,
}: RowsProgressBarProps) {
  if (viewOptions.metric !== Metric.rows) return null
  return (
    <div
      className="progress rounded-0 align-items-center bg-transparent"
      style={{ height: 5 }}
      key={'node' + index + 'rows'}
    >
      <div
        className="bg-secondary"
        role="progressbar"
        style={{
          width: Math.round(node[NodeProp.ACTUAL_ROWS_REVISED] / (plan.planStats.maxRows || 0) * 100) + '%',
          height: 5,
        }}
      />
    </div >
  )
}