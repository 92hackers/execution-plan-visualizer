/**
 * Main Plan compnent
 */

import React, { useState } from 'react'
import classNames from 'classnames'
import { Tooltip } from 'react-tippy'

// Required vendor style files
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'react-tippy/dist/tippy.css'
import 'highlight.js/styles/github.css'

// Custom style files
import '@/assets/scss/global.scss'

import {
  CenterMode, HighlightMode, HighlightType,
  NodeProp, Orientation, ViewMode,
} from '@/enums'

import { PlanService } from '@/services/plan-service';
import * as filters from '@/filters';
import { HelpService, scrollChildIntoParentView } from '@/services/help-service';

const headerNavs: string[] = ['plan', 'raw', 'query', 'stats']

const initViewOptions: any = {
  menuHidden: true,
  showHighlightBar: false,
  showPlanStats: true,
  highlightType: HighlightType.NONE,
  viewMode: ViewMode.FULL,
  orientation: Orientation.TWOD,
  showDiagram: true,
  diagramWidth: 20,
};

const initPlan: any = {
  planStats: {
    executiontime: 0,
  },
}

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

function Plan() {
  const [activeTab, setActiveTab] = useState('plan')
  const [queryText, setQueryText] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [viewOptions, setViewOptions] = useState(initViewOptions)
  const [plan, setPlan] = useState(initPlan)

  return (
    <div className='plan-container d-flex flex-column overflow-hidden flex-grow-1 bg-light'>
      <ul className='nav nav-pills'>
        {
          headerNavs.map((nav: string) => {
            const linkClass = classNames('nav-link px-2 py-0', {
              active: activeTab === nav,
              disabled: !queryText && nav === 'query',
            })
            return (
              <li className="nav-item p-1" key={nav}>
                <a className={linkClass} href={`#${nav}`}>{nav.charAt(0).toUpperCase() + nav.slice(1)}</a>
              </li>
            )
          })
        }
      </ul>
      <div className='tab-content flex-grow-1 d-flex overflow-hidden'>
        {
          validationMessage ? (
            <div className="flex-grow-1 d-flex justify-content-center">
              <div className="alert alert-danger align-self-center">{validationMessage}</div>
            </div>
          ) : (
            <div className={classNames('tab-pane flex-grow-1 overflow-hidden', {
                'show active d-flex': activeTab === 'plan',
              })}
            >
                <div className={classNames(
                  `d-flex flex-column flex-grow-1 overflow-hidden ${viewOptions.viewMode} ${viewOptions.orientation}`)}
                >
                  {
                    plan && (
                      <div className="plan-stats flex-shrink-0 d-flex border-bottom border-top form-inline">
                        <div className="d-inline-block px-2">
                          Execution time:
                          <span>
                            {
                              plan.planStats.executionTime ? (
                                <span className="stat-value">{filters.duration(plan.planStats.executionTime)}</span>
                              ) : (
                                <span className="text-muted">
                                  N/A
                                  <Tooltip title={getHelpMessage('missing execution time')}>
                                    <i className="fa fa-info-circle cursor-help"></i>
                                  </Tooltip>
                                </span>
                              )
                            }
                          </span>
                        </div>
                        <div className="d-inline-block border-left px-2">
                          Planning time:
                          <span>
                            {
                              plan.planStats.planningTime ? (
                                <span className="stat-value">
                                  <span
                                    className={`mb-0 p-0 px-1 alert ${planningTimeClass(plan.planStats.planningTime / plan.planStats.executionTime * 100)}`}
                                    dangerouslySetInnerHTML={{ __html: filters.duration(plan.planStats.planningTime) }}
                                  ></span>
                                </span>
                              ) : (
                                <Tooltip title={getHelpMessage('missing planning time')}>
                                  <i className="fa fa-info-circle cursor-help"></i>
                                </Tooltip>
                              )
                            }
                          </span>
                        </div>
                      </div>
                    )
                  }
                </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Plan
