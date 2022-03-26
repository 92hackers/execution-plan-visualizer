/**
 * Temp buffers progressbar
 */

import React from "react";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { Metric, BufferLocation, NodeProp } from "@/enums";

export interface TempBufferProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
}
export function TempBufferProgressBar({
  index,
  node,
  plan,
  viewOptions,
}: TempBufferProgressBarProps) {
  if (viewOptions.metric !== Metric.buffers || viewOptions.buffersMetric !== BufferLocation.temp) {
    return null
  }
  const { maxBlocks } = plan.planStats
  const tempMaxBlocks = maxBlocks ? maxBlocks[BufferLocation.temp] : 0
  if (!tempMaxBlocks) {
    return null
  }

  function getWidth(blocks: number): string {
    return Math.round(blocks / tempMaxBlocks * 100) + '%'
  }

  return (
    <div
      className="progress rounded-0 align-items-center bg-transparent"
      style={{ height: 5 }}
      key={'node' + index + 'buffers_temp'}
    >
      <div
        className="bg-read"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_TEMP_READ_BLOCKS]),
          height: 5,
        }}
      />
      <div
        className="bg-written"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_TEMP_WRITTEN_BLOCKS]),
          height: 5,
        }}
      />
    </div>
  )
}