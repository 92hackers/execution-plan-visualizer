/**
 * IOBuffer tab
 */

import React from "react";
import classNames from "classnames";
import Tippy from "@tippyjs/react";

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
  const ioReadTime = node[nodeProps.EXCLUSIVE_IO_READ_TIME]
  const ioWriteTime = node[nodeProps.EXCLUSIVE_IO_WRITE_TIME]
  return (
    <div className={classNames('tab-pane', {'show active': activeTab === PlanNodeCardTab.IOBuffer})}>
      {
        ioReadTime > 0 || ioWriteTime > 0 && (
          <div className="mb-2">
            <b>I/O Timings:</b>
            {
              ioReadTime > 0 && (
                <span className="ml-2">
                  <b className="mr-1">Read:</b>
                  {formattedProp('EXCLUSIVE_IO_READ_TIME')}
                </span>
              )
            }
            {
              ioWriteTime > 0 && (
                <span className="ml-2">
                  <b className="mr-1">Write:</b>
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
        node[nodeProps.WAL_RECORDS] > 0 || node[nodeProps.WAL_BYTES] > 0 && (
          <div className="mb-2">
            <b>
              <Tippy content="Write-Ahead Logging">
                <span>
                  <span className="more-info">WAL</span>:
                </span>
              </Tippy>
            </b>
            {formattedProp('WAL_RECORDS')} records
            <small>({formattedProp('WAL_BYTES')})</small>
            {
              node[nodeProps.WAL_FPI] && (
                <span>
                  <span>-</span>
                  <Tippy content="WAL Full Page Images">
                    <span className="more-info">FPI</span>
                  </Tippy>
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