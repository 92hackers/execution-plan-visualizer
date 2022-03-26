/**
 * Plan Stats
 */

import React  from 'react'
import Tippy from '@tippyjs/react'
import classNames from 'classnames'

import { IViewOptions, IViewOptionsAnyOne, IPlanStats } from '@/iplan'
import * as filters from '@/filters';
import { HelpService } from '@/services/help-service';

import { Triggers } from './Triggers'
import { PlanStatsSettings } from './Settings'

const helpService = new HelpService()

function getHelpMessage(message: string) {
  return helpService.getHelpMessage(message);
}

function planningTimeClass(percent: number) {
  let c;
  if (percent > 90) {
    c = 4;
  } else if (percent > 40) {
    c = 3;
  } else if (percent > 10) {
    c = 2;
  }
  if (c) {
    return 'c-' + c;
  }
  return false;
}


export interface PlanStatsProps {
  planStats: IPlanStats,
  viewOptions: IViewOptions,
  handleViewOptionsChange: (options: IViewOptionsAnyOne) => void,
}

export function PlanStats({
  planStats, viewOptions, handleViewOptionsChange,
}: PlanStatsProps) {
  if (!planStats) {
    return null
  }

  return (
    <div className="plan-stats flex-shrink-0 d-flex border-bottom border-top form-inline">
      <div className="d-inline-block px-2">
        Execution time:
        <span className='pl-2'>
          {
            planStats.executionTime ? (
              <span className="stat-value">{filters.duration(planStats.executionTime)}</span>
            ) : (
              <span className="text-muted">
                N/A
                <Tippy content={getHelpMessage('missing execution time')}>
                  <i className="fa fa-info-circle cursor-help"></i>
                </Tippy>
              </span>
            )
          }
        </span>
      </div>
      <div className="d-inline-block border-left px-2">
        Planning time:
        <span className='pl-2'>
          {
            planStats.planningTime ? (
              <span className="stat-value">
                <span
                  className={`mb-0 p-0 px-1 alert ${planningTimeClass(planStats.planningTime / (planStats.executionTime || 0) * 100)}`}
                  dangerouslySetInnerHTML={{ __html: filters.duration(planStats.planningTime) }}
                ></span>
              </span>
            ) : (
              <span className="text-muted">
                N/A
                <Tippy content={getHelpMessage('missing planning time')}>
                  <i className="fa fa-info-circle cursor-help"></i>
                </Tippy>
              </span>
            )
          }
        </span>
      </div>
      <div>
        {
          planStats.jitTime && (
            <div className="d-inline-block border-left px-2">
              JIT:
              <span className="stat-value pl-2">
                <span
                  className={`mb-0 p-0 px-1 alert ${planningTimeClass(planStats.jitTime / (planStats.executionTime || 0) * 100)}`}
                  dangerouslySetInnerHTML={{ __html: filters.duration(planStats.jitTime) }}
                />
              </span>
            </div>
          )
        }
      </div>
      <Triggers
        triggers={planStats.triggers || []}
        planStats={planStats}
      />
      <PlanStatsSettings settings={planStats.settings} />
      <button
        onClick={() => handleViewOptionsChange({ menuHidden: !viewOptions.menuHidden})}
        className={classNames('border-left btn btn-sm p-0 px-2 ml-auto', { 'text-primary': !viewOptions.menuHidden })}
      >
        <i className="fa fa-cog p-0"></i>
        Settings
      </button>
    </div>
  )
}
