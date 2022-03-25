/**
 * Buffer type component
 */

import React from "react";

import { IDiagramViewOptions } from "@/idiagram";
import { Metric, BufferLocation } from "@/enums";

export interface BufferTypeCompProps {
  viewOptions: IDiagramViewOptions,
}
export function BufferTypeComp({
  viewOptions,
}: BufferTypeCompProps) {
  return (
    <div className="legend text-center">
      {
        viewOptions.metric === Metric.buffers && (
          <ul className="list-unstyled list-inline mb-0">
            {
              viewOptions.buffersMetric !== BufferLocation.temp && (
                <li className="list-inline-item">
                  <span className="bg-hit rounded" />
                  Hit
                </li>
              )
            }
            <li className="list-inline-item">
              <span className="bg-read"></span>
              Read
            </li>
            {
              viewOptions.buffersMetric !== BufferLocation.temp && (
                <li className="list-inline-item">
                  <span className="bg-dirtied"></span>
                  Dirtied
                </li>
              )
            }
            <li className="list-inline-item">
              <span className="bg-written"></span>
              Written
            </li>
          </ul>
        )
      }
    </div>
  )
}