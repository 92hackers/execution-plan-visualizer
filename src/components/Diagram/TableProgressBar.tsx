/**
 * Table progress bar
 * 
 */

import React from "react";
import classNames from "classnames";

import Node from "@/inode";
import { IPlan } from "@/iplan";
import { IDiagramViewOptions } from "@/idiagram";
import { NodeProp } from "@/enums";

export interface TableProgressBarProps {
  index: number,
  node: Node,
  plan: IPlan,
  viewOptions: IDiagramViewOptions,
}
export function TableProgressBar({
  index,
  node,
  plan,
  viewOptions,
}: TableProgressBarProps) {
  return (
    <td>

      {/* rows */}
      <div
        className="progress rounded-0 align-items-center bg-transparent"
      >

      </div>
    </td>
  )
}