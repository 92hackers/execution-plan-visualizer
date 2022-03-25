/**
 * Buffer Location
 */

import React from "react";
import classNames from "classnames";

import { IDiagramViewOptions } from "@/idiagram";
import { Metric, BufferLocation } from "@/enums";
import { IPlan } from "@/iplan";

export interface BufferLocationCompProps {
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
  setViewOptions: (metric: IDiagramViewOptions) => void,
}
export function BufferLocationComp({
  plan,
  viewOptions,
  setViewOptions,
}: BufferLocationCompProps) {
  if (viewOptions.metric !== Metric.buffers) {
    return null
  }

  function btnClassName(metric: BufferLocation) {
    return classNames('btn btn-outline-secondary', {
      active: viewOptions.buffersMetric === metric
    })
  }

  const handleBtnClick = (metric: BufferLocation) => () => setViewOptions({
    ...viewOptions,
    buffersMetric: metric,
  })

  const { maxBlocks } = plan.planStats
  return (
    <div className="form-group text-center my-1">
      <div className="btn-group btn-group-xs">
        <button
          className={btnClassName(BufferLocation.shared)}
          onClick={handleBtnClick(BufferLocation.shared)}
          disabled={!maxBlocks || !maxBlocks[BufferLocation.shared]}
        >
          shared
        </button>
        <button
          className={btnClassName(BufferLocation.temp)}
          onClick={handleBtnClick(BufferLocation.temp)}
          disabled={!maxBlocks || !maxBlocks[BufferLocation.temp]}
        >
          temp
        </button>
        <button
          className={btnClassName(BufferLocation.local)}
          onClick={handleBtnClick(BufferLocation.local)}
          disabled={!maxBlocks || !maxBlocks[BufferLocation.local]}
        >
          local
        </button>
      </div>
    </div>
  )
}