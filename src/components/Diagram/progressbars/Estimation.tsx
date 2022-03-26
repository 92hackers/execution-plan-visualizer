/**
 * Estimation progressbar
 */

import React from "react";
import classNames from "classnames";
import _ from 'lodash'

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { EstimateDirection, Metric, NodeProp } from "@/enums";


function maxEstimateFactor(plans: any[]) {
  const max = _.max(_.map(plans, (plan) => {
    return _.max(_.map(plan, (row) => {
      const f = row[1][NodeProp.PLANNER_ESTIMATE_FACTOR];
      if (f !== Infinity) {
        return f;
      }
    }));
  }));
  return max * 2 || 1;
}

function estimateFactorPercent(node: Node, plans: any[]): number {
  if (node[NodeProp.PLANNER_ESTIMATE_FACTOR] === Infinity) {
    return 100;
  }
  return (node[NodeProp.PLANNER_ESTIMATE_FACTOR] || 0) / maxEstimateFactor(plans) * 100;
}

export interface EstimationProgressBarProps {
  index: number,
  node: Node,
  plans: any[],
  viewOptions: IDiagramViewOptions,
}
export function EstimationProgressBar({
  index,
  node,
  plans,
  viewOptions,
}: EstimationProgressBarProps) {
  if (viewOptions.metric !== Metric.estimate_factor) return null
  const isUnderDirection = node[NodeProp.PLANNER_ESTIMATE_DIRECTION] === EstimateDirection.under
  const isOverDirection = node[NodeProp.PLANNER_ESTIMATE_DIRECTION] === EstimateDirection.over
  return (
    <div
      className="progress rounded-0 align-items-center bg-transparent xxxx justify-content-center"
      style={{ height: 10 }}
      key={'node' + index + 'estimation'}
    >
      <span className="text-muted small">
        <i
          className={classNames('fa fa-fw', {
            'fa-arrow-down': isUnderDirection,
          })}
        />
      </span>
      <div
        className={classNames('progress-bar', {
          'bg-secondary': isUnderDirection,
          'bg-transparent': !isUnderDirection,
        })}
        role="progressbar"
        style={{
          height: 5,
          width: estimateFactorPercent(node, plans) + '%',
        }}
      />
      <div
        className="progress-bar border-left"
        role="progressbar"
        style={{ width: 1, height: 5 }}
      />
      <div
        className={classNames('progress-bar', {
          'bg-secondary': isOverDirection,
          'bg-transparent': !isOverDirection,
        })}
        role="progressbar"
        style={{
          height: 5,
          width: estimateFactorPercent(node, plans) + '%',
        }}
      />
      <span className="text-muted small">
        <i
          className={classNames('fa fa-fw', {
            'fa-arrow-up': node[NodeProp.PLANNER_ESTIMATE_DIRECTION] === EstimateDirection.over
          })}
        />
      </span>
    </div>
  )
}