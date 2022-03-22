/**
 * IOBuffer tab
 */

import React from "react";
import classNames from "classnames";
import { Tooltip } from "react-tippy";

import { PlanNodeCardTab } from "@/enums";
import Node from "@/inode";
import { NodeProp } from "@/enums";

export interface IOBufferTabProps {
  node: Node,
  activeTab: PlanNodeCardTab,
  formattedProp: (prop: keyof typeof NodeProp) => string,
}
export function IOBufferTab({
  node,
  activeTab,
  formattedProp,
}: IOBufferTabProps) {
  const nodeProps = NodeProp
  return (
    <div className={classNames('tab-pane', {'show active': activeTab === PlanNodeCardTab.IOBuffer})}>
      {
        node[nodeProps.EXCLUSIVE_IO_READ_TIME] || node[nodeProps.EXCLUSIVE_IO_WRITE_TIME] && (
          <div className="mb-2">
            <b>I/O Timings:</b>
            {
              node[nodeProps.EXCLUSIVE_IO_READ_TIME] && (
                <span className="ml-2">
                  <b>Read:&nbsp;</b>
                  {formattedProp('EXCLUSIVE_IO_READ_TIME')}
                </span>
              )
            }
            {
              node[nodeProps.EXCLUSIVE_IO_WRITE_TIME] && (
                <span className="ml-2">
                  <b>Write:&nbsp;</b>
                  {formattedProp('EXCLUSIVE_IO_WRITE_TIME')}
                </span>
              )
            }
          </div>
        )
      }
      <b>Blocks:</b>
      <table className="table table-sm">
        <tbody>
          <tr>
            <td></td>
            <th className="text-right" style={{ width: '25%' }}>Hit</th>
            <th className="text-right" style={{ width: '25%' }}>Read</th>
            <th className="text-right" style={{ width: '25%' }}>Dirtied</th>
            <th className="text-right" style={{ width: '25%' }}>Written</th>
          </tr>
          <tr>
            <th>Shared</th>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_SHARED_HIT_BLOCKS') || '-' }}></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_SHARED_READ_BLOCKS') || '-' }}></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_SHARED_DIRTIED_BLOCKS') || '-'}}></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_SHARED_WRITTEN_BLOCKS') || '-'}}></td>
          </tr>
          <tr>
            <th>Temp</th>
            <td className="text-right bg-hatched"></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_TEMP_READ_BLOCKS') || '-'}}></td>
            <td className="text-right bg-hatched"></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_TEMP_WRITTEN_BLOCKS') || '-'}}></td>
          </tr>
          <tr>
            <th>Local</th>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_LOCAL_HIT_BLOCKS') || '-'}}></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_LOCAL_READ_BLOCKS') || '-'}}></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_LOCAL_DIRTIED_BLOCKS') || '-'}}></td>
            <td className="text-right" dangerouslySetInnerHTML={{ __html: formattedProp('EXCLUSIVE_LOCAL_WRITTEN_BLOCKS') || '-'}}></td>
          </tr>
        </tbody>
      </table>
      {
        node[nodeProps.WAL_RECORDS] || node[nodeProps.WAL_BYTES] && (
          <div className="mb-2">
            <b>
              <Tooltip title="Write-Ahead Logging">
                <span className="more-info">WAL</span>:
              </Tooltip>
            </b>
            {formattedProp('WAL_RECORDS')} records
            <small>({formattedProp('WAL_BYTES')})</small>
            {
              node[nodeProps.WAL_FPI] && (
                <span>
                  <span>-</span>
                  <Tooltip title="WAL Full Page Images">
                    <span className="more-info">FPI</span>
                  </Tooltip>
                  <span>:</span>
                  {formattedProp('WAL_FPI')}
                </span>
              )
            }
          </div>
        )
      }
    </div>
  )
}