/**
 * Table progress bar
 * 
 */

import React from "react";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";

import { CostProgressBar } from "./progressbars/Cost";
import { EstimationProgressBar } from "./progressbars/Estimation";
import { LocalBufferProgressBar } from "./progressbars/LocalBuffer";
import { RowsProgressBar } from "./progressbars/Rows";
import { SharedBufferProgressBar } from "./progressbars/SharedBuffer";
import { TempBufferProgressBar } from "./progressbars/TempBuffer";
import { TimeProgressBar } from "./progressbars/Time";

export interface TableProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  plans: any[],
  viewOptions: IDiagramViewOptions,
}
export function TableProgressBar({
  index,
  node,
  plan,
  plans,
  viewOptions,
}: TableProgressBarProps) {
  return (
    <td>
      <TimeProgressBar
        index={index}
        node={node}
        plan={plan}
        viewOptions={viewOptions}
      />
      <RowsProgressBar
        index={index}
        node={node}
        plan={plan}
        viewOptions={viewOptions}
      />
      <EstimationProgressBar
        index={index}
        node={node}
        plans={plans}
        viewOptions={viewOptions}
      />
      <CostProgressBar
        index={index}
        node={node}
        plan={plan}
        viewOptions={viewOptions}
      />

      <SharedBufferProgressBar
        index={index}
        node={node}
        plan={plan}
        viewOptions={viewOptions}
      />
      <LocalBufferProgressBar
        index={index}
        node={node}
        plan={plan}
        viewOptions={viewOptions}
      />
      <TempBufferProgressBar
        index={index}
        node={node}
        plan={plan}
        viewOptions={viewOptions}
      />
    </td>
  )
}