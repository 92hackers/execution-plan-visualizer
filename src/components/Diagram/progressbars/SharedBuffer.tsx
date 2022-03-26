/**
 * Shared buffers progressbar
 */

import React from "react";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { BufferLocation, Metric, NodeProp } from "@/enums";

export interface SharedBufferProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
}
export function SharedBufferProgressBar({
  index,
  node,
  plan,
  viewOptions,
}: SharedBufferProgressBarProps) {
  if (viewOptions.metric !== Metric.buffers || viewOptions.buffersMetric !== BufferLocation.shared) {
    return null
  }
  const { maxBlocks } = plan.planStats
  const sharedMaxBlocks = maxBlocks ? maxBlocks[BufferLocation.shared] : 0
  if (!sharedMaxBlocks) {
    return null
  }

  function getWidth(blocks: number): string {
    return Math.round(blocks / sharedMaxBlocks * 100) + '%'
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
          width: getWidth(node[NodeProp.EXCLUSIVE_SHARED_HIT_BLOCKS]),
          height: 5,
        }}
      />
      <div
        className="bg-read"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_SHARED_READ_BLOCKS]),
          height: 5,
        }}
      />
      <div
        className="bg-dirtied"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_SHARED_DIRTIED_BLOCKS]),
          height: 5,
        }}
      />
      <div
        className="bg-written"
        role="progressbar"
        style={{
          width: getWidth(node[NodeProp.EXCLUSIVE_SHARED_WRITTEN_BLOCKS]),
          height: 5,
        }}
      />
    </div>
  )
}