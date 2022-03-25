/**
 * Diagram header
 */

import React from "react";
import classNames from "classnames";

import { IDiagramViewOptions } from "@/idiagram";
import { Metric } from "@/enums";

const metrics = Metric

export interface DiagramHeaderProps {
  viewOptions: IDiagramViewOptions,
  setViewOptions: (metrics: IDiagramViewOptions) => void,
  BufferLocationComp: React.ReactElement,
  BufferTypeComp: React.ReactElement,
}
export function DiagramHeader({
  viewOptions,
  setViewOptions,
  BufferLocationComp,
  BufferTypeComp
}: DiagramHeaderProps) {
  function btnClassName(metric: Metric) {
    return classNames('btn btn-outline-secondary', {
      active: viewOptions.metric === metric
    })
  }

  const handleBtnClick = (metric: Metric) => () => setViewOptions({ ...viewOptions, metric })

  return (
    <div className="flex-shrink-0">
      <div className="form-group text-center my-1">
        <div className="btn-group btn-group-xs">
          <button className={btnClassName(metrics.time)} onClick={handleBtnClick(metrics.time)}>time</button>
          <button className={btnClassName(metrics.rows)} onClick={handleBtnClick(metrics.rows)}>rows</button>
          <button className={btnClassName(metrics.estimate_factor)} onClick={handleBtnClick(metrics.estimate_factor)}>estimation</button>
          <button className={btnClassName(metrics.cost)} onClick={handleBtnClick(metrics.cost)}>cost</button>
          <button className={btnClassName(metrics.buffers)} onClick={handleBtnClick(metrics.buffers)}>buffers</button>
        </div>
      </div>
      {BufferLocationComp}
      {BufferTypeComp}
    </div>
  )
}