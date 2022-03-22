/**
 * Progress bar for header component
 */

import React, { useMemo } from 'react'

import { IViewOptions } from '@/iplan'
import { HighlightType, ViewMode } from '@/enums'
import { ColorService } from '@/services/color-service'

const colorService = new ColorService()

function getBarColor(percent: number) {
  return colorService.numberToColorHsl(percent)
}

export interface HeaderProgressbarProps {
  viewOptions: IViewOptions,
  highlightValue: string,
  barWidth: number,
  collapsed: boolean,
}
export function HeaderProgressbar({
  viewOptions,
  highlightValue,
  barWidth,
  collapsed,
}: HeaderProgressbarProps) {
  const shouldShowNodeBarLabel = useMemo(() => {
    if (collapsed || viewOptions.viewMode === ViewMode.DOT) {
      return false
    }
    return true
  }, [collapsed, viewOptions])

  if (viewOptions.highlightType === HighlightType.NONE || !highlightValue) {
    return null
  }

  const progressBarStyle = {
    width: `${barWidth}%`,
    backgroundColor: getBarColor(barWidth),
  }

  return (
    <div>
      <div className="progress node-bar-container" style={{ height: 5 }}>
        <div className="progress-bar" role="progressbar" style={progressBarStyle}></div>
      </div>
      {
        shouldShowNodeBarLabel && (
          <span className="node-bar-label">
            <span className="text-muted">{viewOptions.highlightType}:</span>&nbsp;
            <span dangerouslySetInnerHTML={{ __html: highlightValue }}></span>
          </span>
        )
      }
    </div>
  )
}