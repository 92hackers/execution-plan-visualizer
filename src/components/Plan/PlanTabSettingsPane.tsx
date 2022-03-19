/**
 * Settings pane for plan Tab.
 * 
 */

import React from 'react'
import classNames from 'classnames'

import { IViewOptions, IViewOptionsAnyOne } from '@/iplan'
import { HighlightType, ViewMode, Orientation } from '@/enums'


const viewModes: ViewMode[] = [
  ViewMode.FULL,
  ViewMode.COMPACT,
  ViewMode.DOT,
]

const orientations: Orientation[] = [
  Orientation.TWOD,
  Orientation.CLASSIC,
]

const highlightTypes: HighlightType[] = [
  HighlightType.NONE,
  HighlightType.DURATION,
  HighlightType.ROWS,
  HighlightType.COST,
]

export interface PlanTabSettingsPaneProps {
  viewOptions: IViewOptions,
  handleViewOptionsChange: (options: IViewOptionsAnyOne) => void,
}

export function PlanTabSettingsPane({
  viewOptions,
  handleViewOptionsChange,
}: PlanTabSettingsPaneProps) {
  if (viewOptions.menuHidden) {
    return null
  }

  return (
    <div className="small p-2 border-left">
      <div className="text-right clearfix">
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={() => handleViewOptionsChange({ menuHidden: true })}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="form-check">
        <input
          id="showDiagram"
          type="checkbox"
          className="form-check-input"
          checked={viewOptions.showDiagram}
          onChange={() => handleViewOptionsChange({ showDiagram: !viewOptions.showDiagram })}
        />
        <label htmlFor="showDiagram" className="form-check-label"><i className="fa fa-align-left"></i> Diagram</label>
      </div>
      <hr />
      <label className="text-uppercase">Density</label>
      <div className="form-group">
        <div className="btn-group btn-group-sm">
          {
            viewModes.map((mode: ViewMode, index: number) => (
              <button
                key={mode.toString()}
                className={classNames('btn btn-outline-secondary', { active: viewOptions.viewMode === mode })}
                onClick={() => handleViewOptionsChange({ viewMode: mode })}
              >
                {mode}
              </button>
            ))
          }
        </div>
      </div>
      <hr />
      <label className="text-uppercase">Orientation</label>
      <div className="form-group">
        <div className="btn-group btn-group-sm">
          {
            orientations.map((orientation: Orientation) => (
              <button
                key={orientation.toString()}
                className={classNames('btn btn-outline-secondary', { active: viewOptions.orientation == orientation })}
                onClick={() => handleViewOptionsChange({ orientation })}
              >
                <i className="fa fa-sitemap"></i>
                {orientation}
              </button>
            ))
          }
        </div>
      </div>
      <hr />
      <label className="text-uppercase">Graph metric</label>
      <div className="form-group">
        <div className="btn-group btn-group-sm">
          {
            highlightTypes.map((type: HighlightType) => (
              <button
                className={classNames(`btn btn-outline-secondary`, { active: viewOptions.highlightType === type })}
                onClick={() => handleViewOptionsChange({ highlightType: type })}
              >
                {type}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  )
}