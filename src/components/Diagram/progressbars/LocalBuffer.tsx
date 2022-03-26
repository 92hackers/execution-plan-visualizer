/**
 * Local buffers progressbar
 */

import React from "react";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { Metric, BufferLocation, NodeProp } from "@/enums";

export interface LocalBufferProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
}
export function LocalBufferProgressBar({
  index,
  node,
  plan,
  viewOptions,
}: LocalBufferProgressBarProps) {
  if (viewOptions.metric !== Metric.buffers || viewOptions.buffersMetric !== BufferLocation.local) {
    return null
  }
  const { maxBlocks } = plan.planStats
  const localMaxBlocks = maxBlocks ? maxBlocks[BufferLocation.local] : 0
  if (!localMaxBlocks) {
    return null
  }

  function getWidth(blocks: number): string {
    return Math.round(blocks / localMaxBlocks * 100) + '%'
  }

  return (
    <div
      className="progress rounded-0 align-items-center bg-transparent"
      style={{ height: 5 }}
      key={'node' + index + 'buffers_shared'}
    >
      <div
        className="bg-hit"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_LOCAL_HIT_BLOCKS]),
          height: 5,
        }}
      />
      <div
        className="bg-read"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_LOCAL_READ_BLOCKS]),
          height: 5,
        }}
      />
      <div
        className="bg-dirtied"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_LOCAL_DIRTIED_BLOCKS]),
          height: 5,
        }}
      />
      <div
        className="bg-written"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_LOCAL_WRITTEN_BLOCKS]),
          height: 5,
        }}
      />
    </div>
  )
}