/**
 * General tab of plan node body.
 */

import React from "react"
import classNames from "classnames"
import { Tooltip } from "react-tippy"

import { PlanNodeCardTab, NodeProp, EstimateDirection } from "@/enums"
import { IPlan } from "@/iplan"
import Node from "@/inode"

export interface GeneralTabProps {
  node: Node,
  plan: IPlan,
  activeTab: PlanNodeCardTab,
  durationClass: string,
  formattedProp: (prop: keyof typeof NodeProp) => string,

  shouldShowPlannerEstimate: boolean,
  plannerRowEstimateDirection: EstimateDirection,
  plannerRowEstimateValue: number,
  estimationClass: string,

  rowsRemoved: number,
  rowsRemovedProp: keyof typeof NodeProp,
  rowsRemovedClass: string,
  rowsRemovedPercentString: string,

  heapFetchesClass: string,
  costClass: string,
}
export function GeneralTab({
  node,
  plan,
  activeTab,
  durationClass,

  formattedProp,

  shouldShowPlannerEstimate,
  plannerRowEstimateDirection,
  plannerRowEstimateValue,
  estimationClass,

  rowsRemoved,
  rowsRemovedProp,
  rowsRemovedClass,
  rowsRemovedPercentString,

  heapFetchesClass,
  costClass,
}: GeneralTabProps) {
  const tilde = node[NodeProp.ACTUAL_LOOPS] > 1 ? '~' : ''
  return (
    <div className={classNames('tab-pane', { 'show active': activeTab === PlanNodeCardTab.GENERAL })}>
      {
        plan.isAnalyze && (
          <div>
              <i className="fa fa-fw fa-clock text-muted mr-1"></i>
              <b>Timing:</b>
              <span
                className={`p-0 px-1 rounded alert ${durationClass}`}
                dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_DURATION') }}
              />
          </div>
        )
      }
      <div>
        <i className="fa fa-fw fa-align-justify text-muted mr-1"></i>
        <b>Rows:</b>
        <span className="px-1">{tilde + formattedProp('ACTUAL_ROWS_REVISED')}</span>
        {
          node[NodeProp.PLAN_ROWS] && (
            <span className="text-muted">
              (Planned: {tilde + formattedProp('PLAN_ROWS_REVISED')})
            </span>
          )
        }
        {
          plannerRowEstimateDirection !== EstimateDirection.none && shouldShowPlannerEstimate && (
            <span>
              <span className="mx-1">|</span>
              {
                plannerRowEstimateDirection === EstimateDirection.over && (
                  <span><i className="fa fa-arrow-up"></i> over</span>
                )
              }
              {
                plannerRowEstimateDirection === EstimateDirection.under && (
                  <span><i className="fa fa-arrow-down"></i> under</span>
                )
              }
              <span className="mx-1">estimated</span>
              {
                plannerRowEstimateValue !== Infinity && (
                  <span>
                    by
                    <span
                      className={`p-0 px-1 alert ${estimationClass}`}
                      dangerouslySetInnerHTML={{ __html: formattedProp('PLANNER_ESTIMATE_FACTOR') }}
                    />
                  </span>
                )
              }
            </span>
          )
        }
        {
          rowsRemoved > 0 && (
            <div>
              <i className="fa fa-fw fa-filter text-muted mr-1"></i>
              <b>
                {NodeProp[rowsRemovedProp]}:
              </b>
              <span>
                <span className="px-1">{tilde + formattedProp(rowsRemovedProp)}</span>|
                <span className={`p-0 px-1 alert ${rowsRemovedClass}`}>{rowsRemovedPercentString}%</span>
              </span>
            </div>
          )
        }
        {
          node[NodeProp.HEAP_FETCHES] > 0 && (
            <div>
              <i className="fa fa-fw fa-exchange-alt text-muted mr-1"></i>
              <b>Heap Fetches:</b>&nbsp;
              <span
                className={`p-0 px-1 rounded alert ${heapFetchesClass}`}
                dangerouslySetInnerHTML={{ __html: formattedProp('HEAP_FETCHES') }}
              />
              &nbsp;
              {
                heapFetchesClass && (
                  <Tooltip
                    title="Visibility map may be out-of-date. Consider using VACUUM or change autovacuum settings."
                  >
                    <i className="fa fa-fw fa-info-circle text-muted" />
                  </Tooltip>
                )
              }
            </div>
          )
        }
        {
          node[NodeProp.EXCLUSIVE_COST] > 0 && (
            <div>
              <i className="fa fa-fw fa-dollar-sign text-muted mr-1"></i>
              <b>Cost:</b>
              <span className={`p-0 mx-1 px-1 mr-1 alert ${costClass}`}>{formattedProp('EXCLUSIVE_COST')}</span>
              <span className="text-muted">(Total: {formattedProp('TOTAL_COST')})</span>
            </div>
          )
        }
        {
          node[NodeProp.ACTUAL_LOOPS] > 0 && (
            <div>
              <i className="fa fa-fw fa-undo text-muted mr-1"></i>
              <b>Loops:</b>
              <span className="px-1">{formattedProp('ACTUAL_LOOPS')}</span>
            </div>
          )
        }
      </div>
    </div>
  )
}