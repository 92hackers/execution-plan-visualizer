/**
 * Time progressbar
 */

import React from "react";
import classNames from "classnames";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { Metric, NodeProp } from "@/enums";

export interface TimeProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
}
export function TimeProgressBar({
  index,
  node,
  plan,
  viewOptions,
}: TimeProgressBarProps) {
  if (viewOptions.metric !== Metric.time) return null

  const planTime = plan.planStats.executionTime || plan.content.Plan[NodeProp.ACTUAL_TOTAL_TIME]

  return (
    <div
      className="progress rounded-0 align-items-center bg-transparent"
      style={{ height: 5 }}
      key={'node' + index + 'time'}
    >
      <div
        className={classNames('progress-bar border-secondary bg-secondary', {
          'border-left': node[NodeProp.EXCLUSIVE_DURATION] > 0
        })}
        role="progressbar"
        style={{
          width: `${node[NodeProp.EXCLUSIVE_DURATION] / planTime * 100}%`,
          height: 5,
        }}
      />
      <div
        className="progress-bar bg-secondary-light"
        role="progressbar"
        style={{
          width: `${(node[NodeProp.ACTUAL_TOTAL_TIME] - node[NodeProp.EXCLUSIVE_DURATION]) / planTime}%`,
          height: 5,
        }}
      />
    </div>
  )
}