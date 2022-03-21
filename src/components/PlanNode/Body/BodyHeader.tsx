/**
 * Header for plan node body
 */

import React from "react";
import classNames from "classnames";

import { HelpService } from "@/services/help-service";
import Node from "@/inode";
import { NodeProp, PlanNodeCardTab } from "@/enums";

const helpService = new HelpService()

export interface BodyHeaderProps {
  node: Node,
  activeTab: PlanNodeCardTab,
  showDetails: boolean,
  shouldShowIoBuffers: boolean,
  setActiveTab: (tab: PlanNodeCardTab) => void,
}
export function BodyHeader({
  node,
  activeTab,
  showDetails,
  shouldShowIoBuffers,
  setActiveTab,
}: BodyHeaderProps) {
  if (!showDetails) return null

  const nodeTypeDesc = helpService.getNodeTypeDescription(node[NodeProp.NODE_TYPE])
  return (
    <div className="card-header border-top">
      {
        nodeTypeDesc && (
          <div className="node-description">
            <span className="node-type">{ node[NodeProp.NODE_TYPE] } Node</span>&nbsp;
            <span dangerouslySetInnerHTML={{ __html: nodeTypeDesc }} />
          </div>
        )
      }
      <ul className="nav nav-tabs card-header-tabs">
        <li className="nav-item">
          <a
            href="#"
            onClick={() => setActiveTab(PlanNodeCardTab.GENERAL)}
            className={classNames('nav-link text-nowrap', { active: activeTab === PlanNodeCardTab.GENERAL })}
          >General</a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            onClick={() => setActiveTab(PlanNodeCardTab.IOBuffer)}
            className={classNames('nav-link text-nowrap', {
              active: activeTab === PlanNodeCardTab.GENERAL,
              disabled: !shouldShowIoBuffers,
            })}
          >IO & Buffers</a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            onClick={() => setActiveTab(PlanNodeCardTab.OUTPUT)}
            className={classNames('nav-link text-nowrap', {
              active: activeTab === PlanNodeCardTab.OUTPUT,
              disabled: !node[NodeProp.OUTPUT],
            })}
          >Output</a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            onClick={() => setActiveTab(PlanNodeCardTab.WORKERS)}
            className={classNames('nav-link text-nowrap', {
              active: activeTab === PlanNodeCardTab.WORKERS,
              disabled: !(node[NodeProp.WORKERS_PLANNED] || node[NodeProp.WORKERS_PLANNED_BY_GATHER]),
            })}
          >Workers</a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            onClick={() => setActiveTab(PlanNodeCardTab.MISC)}
            className={classNames('nav-link text-nowrap', {
              active: activeTab === PlanNodeCardTab.MISC,
            })}
          >Misc</a>
        </li>
      </ul>
    </div>
  )
}