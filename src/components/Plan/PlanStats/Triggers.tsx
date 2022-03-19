/**
 * Triggers for plan stats
 */

import React, { useMemo, useState } from 'react'
import _ from 'lodash'

import { IPlanStats, ITrigger } from '@/iplan'
import * as filters from '@/filters';


function triggerDurationPercent(planStats: IPlanStats, trigger: ITrigger) {
  const executionTime = planStats.executionTime || 0;
  const time = trigger.Time;
  return _.round(time / executionTime * 100);
}

export interface TriggersProps {
  planStats: IPlanStats,
  triggers: ITrigger[],
}

export function Triggers({ planStats, triggers }: TriggersProps) {
  const [showTriggers, setShowTriggers] = useState(false)

  const triggersTotalDuration = useMemo(() => {
    return _.sumBy(triggers, (o: any) => o.Time)
  }, [triggers])

  const totalTriggerDurationPercent = useMemo(() => {
    const executionTime = planStats.executionTime || 0;
    return _.round(triggersTotalDuration / executionTime * 100);
  }, [planStats, triggersTotalDuration])

  return (
    <div className="d-inline-block border-left px-2 position-relative">
      <span className="stat-label">Triggers: </span>
      {
        triggers.length ? (
          <span className="stat-value">
            <span
              className={`mb-0 p-0 px-1 alert ${filters.durationClass(totalTriggerDurationPercent)}`}
              dangerouslySetInnerHTML={{ __html: filters.duration(triggersTotalDuration) }}
            ></span>
            <button
              onClick={() => setShowTriggers(!showTriggers)}
              className="bg-transparent border-0 p-0 m-0 pl-1"
            >
              <i className="fa fa-caret-down text-muted"></i>
            </button>
            {
              showTriggers && (
                <div className="stat-dropdown-container text-left">
                  <button className="btn btn-close float-right" onClick={() => setShowTriggers(false)}>
                    <i className="fa fa-times"></i>
                  </button>
                  <h3>Triggers</h3>
                  {
                    triggers.map((trigger: any, index: number) => {
                      return (
                        <div key={index}>
                          <span>{trigger['Trigger Name']}</span>
                          <br />
                          <span className="text-muted">Called</span>{trigger['Calls']}<span className="text-muted">&times</span>
                          <span className="float-right">
                            <span
                              className={`p-0 px-1 alert ${filters.durationClass(triggerDurationPercent(planStats, trigger))}`}
                              dangerouslySetInnerHTML={{ __html: filters.duration(trigger.Time) }}
                            ></span>
                            | {triggerDurationPercent(planStats, trigger)}
                            <span className="text-muted">%</span>
                          </span>
                          <br />
                          {trigger.Relation && <span className="text-muted">on</span>}
                          {trigger.Relation}
                          <div className="clearfix"></div>
                          {index !== triggers.length - 1 && <hr className='my-2' />}
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </span>
        ) : (
          <span className="text-muted">
            N/A
          </span>
        )
      }
    </div>
  )
}