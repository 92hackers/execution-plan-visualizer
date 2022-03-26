/**
 * Main table of Diagram
 */

import React, { useMemo } from "react";
import _ from 'lodash'
import classNames from "classnames";
import Tippy from "@tippyjs/react";

import { IDiagramViewOptions } from "@/idiagram";
import { BufferLocation, EstimateDirection, Metric, NodeProp } from "@/enums";
import { IPlan } from "@/iplan";
import Node from "@/inode";
import * as filters from '@/filters'

import { TableProgressBar } from "./TableProgressBar";

function isCTE(planName: string): boolean {
  return _.startsWith(planName, 'CTE');
}

export interface DiagramTableProps {
  plan: IPlan,
  plans: any[],
  selected: string,
  highlightedNode: string,
  viewOptions: IDiagramViewOptions,
  onClickCTE: (subplanName: string) => void,
  onMouseOverNode: (nodeId: string) => void,
  onMouseOutNode: () => void,
}
export function DiagramTable({
  plan,
  plans,
  viewOptions,
  onClickCTE,
  selected,
  highlightedNode,
  onMouseOutNode,
  onMouseOverNode,
}: DiagramTableProps) {
  const dataAvailable: boolean = useMemo((): boolean => {
    if (viewOptions.metric === Metric.buffers) {
      return !!viewOptions.buffersMetric
    }
    return true
  }, [viewOptions])

  const handleClickCTE = (subplanName: string) => () => onClickCTE(subplanName)

  function getTooltipContent(node: Node): string {
    let content = '';
    switch (viewOptions.metric) {
      case Metric.time:
        content += timeTooltip(node);
        break;
      case Metric.rows:
        content += rowsTooltip(node);
        break;
      case Metric.estimate_factor:
        content += estimateFactorTooltip(node);
        break;
      case Metric.cost:
        content += costTooltip(node);
        break;
      case Metric.buffers:
        content += buffersTooltip(node);
        break;
    }
    if (node[NodeProp.CTE_NAME]) {
      content +=  '<br><em>CTE ' + node[NodeProp.CTE_NAME] + '</em>';
    }
    return content;
  }

  function timeTooltip(node: Node): string {
    return [
      'Duration: <br>Exclusive: ',
      filters.duration(node[NodeProp.EXCLUSIVE_DURATION]),
      ', Total: ',
      filters.duration(node[NodeProp.ACTUAL_TOTAL_TIME]),
    ].join('');
  }

  function rowsTooltip(node: Node): string {
    return [
      'Rows: ',
      filters.rows(node[NodeProp.ACTUAL_ROWS_REVISED]),
    ].join('');
  }

  function estimateFactorTooltip(node: Node): string {
    const estimateFactor = node[NodeProp.PLANNER_ESTIMATE_FACTOR];
    const estimateDirection = node[NodeProp.PLANNER_ESTIMATE_DIRECTION];
    let text = '';
    if (estimateFactor === undefined || estimateDirection === undefined) {
      return 'N/A';
    }
    switch (estimateDirection) {
      case EstimateDirection.over:
        text += '<i class="fa fa-arrow-up"></i> over';
        break;
      case EstimateDirection.under:
        text += '<i class="fa fa-arrow-down"></i> under';
        break;
      default:
        text += 'Correctly';
    }
    text += ' estimated';
    text += (estimateFactor !== 1) ? ' by <b>' + filters.factor(estimateFactor) + '</b>' : '';
    text += '<br>';
    text += 'Planned: ' + node[NodeProp.PLAN_ROWS_REVISED];
    text += ' 🡒 Actual: ' + node[NodeProp.ACTUAL_ROWS_REVISED];
    return text;
  }

  function costTooltip(node: Node): string {
    return [
      'Cost: ',
      filters.rows(node[NodeProp.EXCLUSIVE_COST]),
    ].join('');
  }

  function buffersTooltip(node: Node): string {
    let text = '';
    let hit;
    let read;
    let written;
    let dirtied;
    switch (viewOptions.buffersMetric) {
      case BufferLocation.shared:
        hit = node[NodeProp.EXCLUSIVE_SHARED_HIT_BLOCKS];
        read = node[NodeProp.EXCLUSIVE_SHARED_READ_BLOCKS];
        dirtied = node[NodeProp.EXCLUSIVE_SHARED_DIRTIED_BLOCKS];
        written = node[NodeProp.EXCLUSIVE_SHARED_WRITTEN_BLOCKS];
        break;
      case BufferLocation.temp:
        read = node[NodeProp.EXCLUSIVE_TEMP_READ_BLOCKS];
        written = node[NodeProp.EXCLUSIVE_TEMP_WRITTEN_BLOCKS];
        break;
      case BufferLocation.local:
        hit = node[NodeProp.EXCLUSIVE_LOCAL_HIT_BLOCKS];
        read = node[NodeProp.EXCLUSIVE_LOCAL_READ_BLOCKS];
        dirtied = node[NodeProp.EXCLUSIVE_LOCAL_DIRTIED_BLOCKS];
        written = node[NodeProp.EXCLUSIVE_LOCAL_WRITTEN_BLOCKS];
        break;
    }

    text += '<table class="table text-white table-sm table-borderless mb-0">';
    text += hit ? '<tr><td>Hit:</td><td class="text-right">' + filters.blocks(hit) + '</td></tr>' : '';
    text += read ? '<tr><td>Read:</td><td class="text-right">' + filters.blocks(read) + '</td></tr>' : '';
    text += dirtied ? '<tr><td>Dirtied:</td><td class="text-right">' + filters.blocks(dirtied) + '</td></tr>' : '';
    text += written ? '<tr><td>Written:</td><td class="text-right">' + filters.blocks(written) + '</td></tr>' : '';
    text += '</table>';

    if (!hit && !read && !dirtied && ! written) {
      text = ' N/A';
    }

    switch (viewOptions.buffersMetric) {
      case BufferLocation.shared:
        text = 'Shared Blocks:' + text;
        break;
      case BufferLocation.temp:
        text = 'Temp Blocks:' + text;
        break;
      case BufferLocation.local:
        text = 'Local Blocks:' + text;
        break;
    }
    return text;
  }

  return (
    <div className="overflow-auto flex-grow-1">
      {
        !dataAvailable && (
          <div className="p-2 text-center text-muted">
            <em>
              No data available
            </em>
          </div>
        )
      }
      {
        dataAvailable && (
          <table className="m-1">
            {
              plans.map((flat: any[], index: number) => (
                <tbody key={index}>
                  {
                    index === 0 && plans.length > 1 && (
                      <tr><th colSpan={3} className="subplan">Main Query Plan</th></tr>
                    )
                  }
                  {
                    flat.map((row, index) => {
                      const subPlanName: string = row[1][NodeProp.SUBPLAN_NAME] || ''
                      // Render subPlan
                      if (subPlanName.length > 0) {
                        const isCTEPlan = isCTE(row[1])
                        return (
                          <tr key={index}>
                            { !isCTEPlan && <td></td> }
                            <td
                              className={classNames('subplan pr-2', {'font-weight-bold': isCTEPlan})}
                              colSpan={isCTEPlan ? 3 : 2}
                            >
                              <span className="three-lines">
                                {
                                  _.range(row[0]).map((i, innerIndex: number) => (
                                    <span key={innerIndex}>
                                      <span>
                                        {
                                          _.indexOf(row[3], i) !== -1 && <span>|</span>
                                        }
                                        {
                                          _.indexOf(row[3], i) === -1 && i !== 0 && <span>&nbsp;</span>
                                        }
                                      </span>
                                    </span>
                                  ))
                                }
                                <span>
                                  { index !== 0 && <span>{ row[2] ? '└' : '├' }</span> }
                                </span>
                              </span>
                              <a
                                href="#"
                                className="font-italic text-reset"
                                onClick={handleClickCTE(subPlanName)}
                              >
                                {subPlanName}
                              </a>
                            </td>
                          </tr>
                        )
                      }

                      const node = row[1]
                      return (
                        <Tippy
                          content={<span dangerouslySetInnerHTML={{ __html: getTooltipContent(node)}} />}
                          key={index}
                        >
                          <tr
                            key={index}
                            className={classNames('no-focus-outline node', {
                              'selected': node.nodeId.toString() === selected,
                              'highlight': node.nodeId === highlightedNode,
                            })}
                            onMouseEnter={() => onMouseOverNode(node.nodeId)}
                            onMouseLeave={onMouseOutNode}
                          >
                            <td className="node-index">
                              <a
                                className="font-weight-normal small"
                                href={`#plan/node/${node.nodeId}`}
                              >
                                #{node.nodeId}
                              </a>
                            </td>
                            <td className="node-type pr-2">
                              <span className="tree-lines">
                                {
                                  _.range(row[0]).map((i, innerIndex: number) => (
                                    <span key={innerIndex}>
                                      <span>
                                        {
                                          _.indexOf(row[3], i) !== -1 && <span>|</span>
                                        }
                                        {
                                          _.indexOf(row[3], i) === -1 && i !== 0 && <span>&nbsp;</span>
                                        }
                                      </span>
                                    </span>
                                  ))
                                }
                                <span>
                                  {
                                    index !== 0 && (
                                      <span>
                                        {
                                          !node[NodeProp.SUBPLAN_NAME] ? <span>{row[2] ? '└' : '├'}</span> : (
                                            <span>
                                              {
                                                !row[2] ? <span>|</span> : <span>&nbsp;</span>
                                              }
                                            </span>
                                          )
                                        }
                                      </span>
                                    )
                                  }
                                </span>
                              </span>
                              {node[NodeProp.NODE_TYPE]}
                            </td>
                            <TableProgressBar
                              index={index}
                              node={node}
                              plan={plan}
                              plans={plans}
                              viewOptions={viewOptions}
                            />
                          </tr>
                        </Tippy>
                      )
                    })
                  }
                </tbody>
              ))
            }
          </table>
        )
      }
    </div>
  )
}