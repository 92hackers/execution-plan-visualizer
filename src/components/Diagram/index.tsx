/**
 * Plan Diagram
 */

import React, { useState, useEffect } from "react";
import _ from 'lodash'

import { Metric, BufferLocation } from "@/enums";
import { IDiagramViewOptions } from "@/idiagram";
import { IPlan } from "@/iplan";
import Node from "@/inode";

import { DiagramHeader } from "./Header";
import { BufferLocationComp } from "./BufferLocation";
import { BufferTypeComp } from "./BufferType";
import { DiagramTable } from "./Table";

const initViewOptions: IDiagramViewOptions = {
  metric: Metric.time,
  buffersMetric: BufferLocation.shared,
}

function flatten(output: any[], level: number, node: any,
  isLast: boolean, branches: number[]) {
  // [level, node, isLastSibbling, branches]
  output.push([level, node, isLast, _.concat([], branches)]);
  if (!isLast) {
    branches.push(level);
  }
  _.each(node.Plans, (subnode) => {
    flatten(
      output,
      level + 1,
      subnode,
      subnode === _.last(node.Plans),
      branches,
    );
  })
  if (!isLast) {
    branches.pop();
  }
}

export interface PlanDiagramProps {
  plan: IPlan,
  highlightNode: string,
  setHighlightNode: (nodeId: string) => void,
  selectedNodeId: string,
  setSelectedNodeId: (nodeId: string) => void,
}
export function PlanDiagram({
  plan,
  highlightNode,
  setHighlightNode,
  selectedNodeId,
  setSelectedNodeId,
}: PlanDiagramProps) {
  const [viewOptions, setViewOptions] = useState(initViewOptions)
  const [allPlans, setAllPlans] = useState<any []>([])

  useEffect(() => {
    const plans: any[][] = [[]]
    const savedOptions = localStorage.getItem('diagramViewOptions');
    if (savedOptions) {
      _.assignIn(viewOptions, JSON.parse(savedOptions));
    }
    flatten(plans[0], 0, plan.content.Plan, true, []);

    _.each(plan.ctes, (cte) => {
      const flat = [] as any[];
      flatten(flat, 0, cte, true, []);
      plans.push(flat);
    })

    // All flattened plans.
    setAllPlans(plans)

    // switch to the first buffers tab if data not available for the currently
    // chosen one
    const planBufferLocations  = _.keys(plan.planStats.maxBlocks || []);
    if (_.indexOf(planBufferLocations, viewOptions.buffersMetric) === -1) {
      const minValue: string = _.min(planBufferLocations) || '';
      viewOptions.buffersMetric = minValue as BufferLocation
    }
  }, [plan])


  const handleClickCTE = (subplanName: string) => console.log(subplanName)
  const handleMouseOverNode = (nodeId: string) => setHighlightNode(nodeId)
  const handleMouseOutNode = () => setHighlightNode('')

  return (
    <div className="diagram d-flex flex-column flex-grow-1 overflow-hidden plan-diagram">
      <DiagramHeader
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        BufferLocationComp={
          <BufferLocationComp
            plan={plan}
            viewOptions={viewOptions}
            setViewOptions={setViewOptions}
          />
        }
        BufferTypeComp={
          <BufferTypeComp
            viewOptions={viewOptions}
          />
        }
      />
      <DiagramTable
        plan={plan}
        plans={allPlans}
        selected={selectedNodeId}
        highlightedNode={highlightNode}
        viewOptions={viewOptions}
        onClickCTE={handleClickCTE}
        onMouseOverNode={handleMouseOverNode}
        onMouseOutNode={handleMouseOutNode}
      />
    </div>
  )
}