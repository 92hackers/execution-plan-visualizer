/**
 * Misc tab
 */

import React from "react";
import classNames from "classnames";

import {
  nodePropTypes, NodeProp, PlanNodeCardTab,
  PropType, NotMiscProperties,
} from "@/enums";
import * as filters from '@/filters'

export interface MiscTabProps {
  activeTab: PlanNodeCardTab,
  miscProps: any[],
}
export function MiscTab({
  activeTab,
  miscProps,
}: MiscTabProps) {
  function shouldShowProp(key: string, value: any): boolean {
    return (value || nodePropTypes[key] === PropType.increment ||
            key === NodeProp.ACTUAL_ROWS) && NotMiscProperties.indexOf(key) === -1
  }

  return (
    <div className={classNames('tab-pane', { 'show active': activeTab === PlanNodeCardTab.MISC })}>
      <table className="table table-sm prop-list">
        {
          miscProps.map((prop: any, index: number) => {
            if (!shouldShowProp(prop.key, prop.value)) {
              return null
            }
            return (
              <tr key={index}>
                <td style={{ width: '40%' }}>{prop.key}</td>
                <td dangerouslySetInnerHTML={{ __html: filters.formatNodeProp(prop.key, prop.value) }} />
              </tr>
            )
          })
        }
      </table>
      <div className="text-muted text-right"><em>* Calculated value</em></div>
    </div>
  )
}