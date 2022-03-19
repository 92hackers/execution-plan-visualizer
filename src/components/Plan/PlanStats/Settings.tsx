/**
 * Settings of plan stats
 */

import React, { useState } from 'react'
import _ from 'lodash'

export interface PlanStatsSettingsProps {
  settings?: { [key: string]: string };
}

export function PlanStatsSettings({
  settings,
}: PlanStatsSettingsProps) {
  const [showSettings, setShowSettings] = useState(false)

  if (!settings) {
    return null
  }

  return (
    <div className="d-inline-block border-left px-2 position-relative">
      <span className="stat-label">Settings: <span className="badge badge-secondary">{ _.keys(settings).length }</span></span>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="bg-transparent border-0 p-0 m-0 pl-1"
      >
        <i className="fa fa-caret-down text-muted"></i>
      </button>
      {
        showSettings && (
          <div className="stat-dropdown-container text-left">
            <button
              className="btn btn-close float-right"
              onClick={() => setShowSettings(false)}
            >
              <i className="fa fa-times"></i>
            </button>
            <h3>PG Settings</h3>
            <em className="text-muted d-block pb-2">
              Configuration parameters affecting query planning with value different from the built-in default value.
            </em>
            <table className="table table-sm table-striped mb-0">
              <tbody>
                {
                  Object.keys(settings).map((key: string) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{settings[key]}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}