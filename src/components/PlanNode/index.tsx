/**
 * Plan node
 */

import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import * as _ from 'lodash';

import Node from '@/inode';
import {
  NodeProp, Orientation, PlanNodeCardTab, ViewMode,
  NotMiscProperties,
  HighlightType,
} from '@/enums';
import { IViewOptions, IPlan } from '@/iplan';
import * as filters from '@/filters'

import { CardWorkers } from './CardWorkers';
import { CollapseHandle } from './CollapseHandle';


export interface PlanNodeProps {
  plan: IPlan,
  node: Node,
  viewOptions: IViewOptions,
  selectedNodeId: number,
}

export function PlanNode({
  plan,
  node,
  viewOptions,
  selectedNodeId,
}: PlanNodeProps) {
  const [activeTab, setActiveTab] = useState(PlanNodeCardTab.GENERAL)
  const [showDetails, setShowDetails] = useState(false)
  const [collapsed, setCollapsed] = useState(true)

  const workersPlannedReversed: number[] = useMemo((): number[] => {
    let count = node[NodeProp.WORKERS_PLANNED_BY_GATHER]
    const result = []
    while(count-- > 0) {
      result.push(count)
    }
    return result
  }, [node])

  const isNeverExecuted: boolean = useMemo((): boolean => {
    return plan.planStats.executionTime !== undefined && !node[NodeProp.ACTUAL_LOOPS]
  }, [plan, node])

  const wrapperClass = classNames({
    'subplan': node[NodeProp.SUBPLAN_NAME],
    'd-flex flex-column align-items-center': viewOptions.orientation ===  Orientation.TWOD,
  })

  const planNodeClass = classNames('text-left plan-node', {
    'detailed': showDetails,
    'never-executed': isNeverExecuted,
    'parallel': workersPlannedReversed.length > 0,
    'selected': selectedNodeId === node.nodeId, // TODO: nodeId is not formatted onto node type.
  });

  const nodeName: string = useMemo((): string => {
    let nodeName: string = node[NodeProp.PARALLEL_AWARE] ? 'Parallel ' : ''
    nodeName += node[NodeProp.NODE_TYPE]
    if (viewOptions.viewMode === ViewMode.DOT && !showDetails) {
      return nodeName.replace(/[^A-Z]/g, '');
    }
    return nodeName
  }, [node, viewOptions])

  // Filter out misc properties
  const miscProps: any[] = useMemo((): any[] => {
    return _.chain(node)
      .omit(NodeProp.PLANS)
      .omit(NodeProp.WORKERS)
      .map((value, key) => {
        return { key, value };
      })
      .value();
  }, [node])

  // The execution time percentage of current node , compared to total plan execution time.
  const executionTimePercent: number = useMemo((): number => {
    // use the first node total time if plan execution time is not available
    const planExecutionTime = plan.planStats.executionTime || plan.content.Plan[NodeProp.ACTUAL_TOTAL_TIME];
    return _.round((node[NodeProp.EXCLUSIVE_DURATION] / planExecutionTime) * 100);
  }, [plan, node])

  const costPercent: number = useMemo((): number => {
    const maxTotalCost = plan.content.maxTotalCost;
    return _.round((node[NodeProp.EXCLUSIVE_COST] / maxTotalCost) * 100);
  }, [plan, node])

  const rowsRemovedProp: string = useMemo((): string => {
    const keys: string[] = [
      NodeProp.ROWS_REMOVED_BY_FILTER_REVISED,
      NodeProp.ROWS_REMOVED_BY_JOIN_FILTER_REVISED,
    ]
    const nodeKey = Object.keys(node).find((key: string) => keys.includes(key));
    type NodePropStrings = keyof typeof NodeProp;
    return Object.keys(NodeProp).find((prop) => NodeProp[prop as NodePropStrings] === nodeKey) || '';
  }, [node])

  let rowsRemoved: number = NaN
  let rowsRemovedPercent: number = NaN
  let rowsRemovedPercentString: string = ''
  if (rowsRemovedProp) {
    type NodePropStrings = keyof typeof NodeProp;
    const removed = node[NodeProp[rowsRemovedProp as NodePropStrings]];
    rowsRemoved = removed;
    const actual = node[NodeProp.ACTUAL_ROWS];
    rowsRemovedPercent = _.floor(removed / (removed + actual) * 100);
    if (rowsRemovedPercent === 100) {
      rowsRemovedPercentString = '>99';
    } else if (rowsRemovedPercent === 0) {
      rowsRemovedPercentString = '<1';
    } else {
      rowsRemovedPercentString = rowsRemovedPercent.toString();
    }
  }

  const filterTooltip: string = rowsRemovedPercentString + '% of rows removed by filter'
  
  // Calculate bar width and highlight value based on current highlight type, which chosen from right most menu pane.
  const [barWidth, highlightValue] = useMemo(() => {
    let value: number
    switch (viewOptions.highlightType) {
      case HighlightType.DURATION: {
        value = node[NodeProp.EXCLUSIVE_DURATION];
        if (value === undefined) {
          return [0, '']
        }
        return [
          Math.round(value / (plan.planStats.maxDuration || 0) * 100),
          filters.duration(value),
        ]
      }
      case HighlightType.ROWS: {
        value = node[NodeProp.ACTUAL_ROWS];
        if (value === undefined) {
          return [0, '']
        }
        return [
          Math.round(value / (plan.planStats.maxRows || 0) * 100) || 0,
          filters.rows(value),
        ]
      }
      case HighlightType.COST: {
        value = node[NodeProp.EXCLUSIVE_COST]
        if (value === undefined) {
          return [0, '']
        }
        return [
          Math.round(value / (plan.planStats.maxCost || 0) * 100),
          filters.cost(value),
        ]
      }
      default:
        return [0, '']
    }
  }, [plan, viewOptions, node])

  const childPlans = node[NodeProp.PLANS]

  const plannerRowEstimateDirection = node[NodeProp.PLANNER_ESTIMATE_DIRECTION];
  const plannerRowEstimateValue = node[NodeProp.PLANNER_ESTIMATE_FACTOR];

  return (
    <div className={wrapperClass}>
      {node[NodeProp.SUBPLAN_NAME] && <h4>{node[NodeProp.SUBPLAN_NAME]}</h4>}
      <div className={planNodeClass}>
        <CardWorkers workersPlannedReversed={workersPlannedReversed} />
        <CollapseHandle
          childPlansCount={childPlans.length}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div
          className='plan-node-body card'
          onMouseEnter={() => console.log(`enter node: ${node.nodeId}`)}
          onMouseLeave={() => console.log(`leave node: ${node.nodeId}`)}
        >

        </div>
      </div>
    </div>
  )
}