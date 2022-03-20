/**
 * Workers display
 */

import React from 'react'
import classNames from 'classnames'

export interface CardWorkersProps {
  workersPlannedReversed: number[]
}

export function CardWorkers({ workersPlannedReversed }: CardWorkersProps) {
  if (!workersPlannedReversed.length) return null
  const workersCountClassName = (index: number) => classNames({ 'border-dashed': index >= workersPlannedReversed.length });
  return (
    <div className="workers text-muted py-0 px-1">
      {
        workersPlannedReversed.map((index) => (
          <div
            key={index}
            style={{ top: `${1 + index * 2}px`, left: `${1 + (index + 1) * 3}px` }}
            className={workersCountClassName(index)}
          >
            {index}
          </div>
        ))
      }
    </div>
  )
}