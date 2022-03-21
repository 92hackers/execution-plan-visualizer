/**
 * Workers tab
 */

import React, { useMemo } from "react";
import classNames from "classnames";
import { Tooltip } from "react-tippy";
import lodash from 'lodash'

import Node from "@/inode";
import {
  WorkerProp, ViewMode, NodeProp, PlanNodeCardTab,
  nodePropTypes, PropType, NotMiscProperties,
} from "@/enums";
import { IViewOptions, IPlan } from "@/iplan";
import { HelpService } from "@/services/help-service";
import * as filters from '@/filters'

const helpService = new HelpService()

export interface WorkersTabProps {
  node: Node,
  plan: IPlan,
  activeTab: PlanNodeCardTab,
  formattedProp: (prop: keyof typeof NodeProp) => string,
  viewOptions: IViewOptions,
  workersLaunchedCount: number,
}
export function WorkersTab({
  node,
  plan,
  activeTab,
  formattedProp,
  viewOptions,
  workersLaunchedCount,
}: WorkersTabProps) {
  const nodeProps = NodeProp
  const viewModes = ViewMode
  const workerProps = WorkerProp

  const componentId: string = useMemo(() => Math.random().toString(32).slice(2), [node])

  function shouldShowProp(key: string, value: any): boolean {
    return (value || nodePropTypes[key] === PropType.increment ||
            key === NodeProp.ACTUAL_ROWS) && NotMiscProperties.indexOf(key) === -1
  }

  if (!node[nodeProps.WORKERS_PLANNED] && !node[nodeProps.WORKERS_PLANNED_BY_GATHER]) {
    return null
  }

  return (
    <div className={classNames('tab-pane', { 'show active': activeTab === PlanNodeCardTab.WORKERS })}>
      {
        (node[nodeProps.WORKERS_PLANNED] || node[nodeProps.WORKERS_PLANNED_BY_GATHER])
        && viewOptions.viewMode === viewModes.FULL && (
          <div>
              <b>Workers planned: </b>
              <span className="px-1">{node[nodeProps.WORKERS_PLANNED] || node[nodeProps.WORKERS_PLANNED_BY_GATHER]}</span>
              {
                !node[nodeProps.WORKERS_PLANNED] && !node[nodeProps.WORKERS] && (!plan.isVerbose || !plan.isAnalyze) && (
                  <em className="text-warning">
                    <Tooltip title={helpService.getHelpMessage('fuzzy needs verbose')}>
                      <i className="fa fa-exclamation-triangle cursor-help" />
                    </Tooltip>
                  </em>
                )
              }
          </div>
        )
      }
      {
        node[nodeProps.WORKERS_LAUNCHED] && viewOptions.viewMode === viewModes.FULL && (
          <div>
            <b>Workers launched: </b>
            <span className="px-1">{node[nodeProps.WORKERS_LAUNCHED]}</span>
          </div>
        )
      }
      {
        !workersLaunchedCount && node[nodeProps.WORKERS_PLANNED_BY_GATHER] && (
          <div className="text-muted">
            <em>
              Detailed information is not available.
              <Tooltip title={helpService.getHelpMessage('workers detailed info missing')}>
                <i className="fa fa-info-circle cursor-help" />
              </Tooltip>
            </em>
          </div>
        )
      }
      {
        lodash.isArray(node[nodeProps.WORKERS]) && (
            <div className="accordion">
              {
                node[nodeProps.WORKERS].map((worker: any, index: number) => {
                  return (
                    <div className="card" key={index}>
                      <div className="card-header p-0">
                        <button
                          type="button"
                          className="btn btn-link btn-sm text-secondary"
                          style={{ fontSize: 'inherit' }}
                          data-toggle="collapse"
                          data-target={`collapse-${componentId}-${index}`}
                        >
                          <i className="fa fa-chevron-right fa-fw"></i>
                          <i className="fa fa-chevron-down fa-fw"></i>
                          Worker {worker[workerProps.WORKER_NUMBER]}
                        </button>
                      </div>
                      <div id={`collapse-${componentId}-${index}`} className="collapse">
                        <div className="card-body p-0">
                          <table className="table table-sm prop-list mb-0">
                            {
                              worker.map((value: any, key: string) => {
                                if (!shouldShowProp(key, value)) {
                                  return null
                                }
                                return (
                                  <tr>
                                    <td style={{ width: '40%' }}>{key}</td>
                                    <td dangerouslySetInnerHTML={{ __html: filters.formatNodeProp(key, value) }} />
                                  </tr>
                                )
                              })
                            }
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
        )
      }
    </div>
  )
}