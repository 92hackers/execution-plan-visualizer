/**
 * Output tab
 */

import React from "react";
import classNames from "classnames";

import { PlanNodeCardTab, NodeProp } from "@/enums";

export interface OutputTabProps {
  activeTab: PlanNodeCardTab,
  formattedProp: (prop: keyof typeof NodeProp) => string,
}
export function OutputTab({
  activeTab,
  formattedProp,
}: OutputTabProps) {
  const className = classNames({
    'tab-pane overflow-auto text-monospace': true,
    'show active': activeTab === PlanNodeCardTab.OUTPUT,
  })
  return (
    <div
      className={className}
      style={{ maxHeight: 200 }}
      dangerouslySetInnerHTML={{ __html: formattedProp('OUTPUT') }}
    />
  )
}