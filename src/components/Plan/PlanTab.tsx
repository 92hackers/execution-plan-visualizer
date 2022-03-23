/**
 * Plan Tab
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import SplitPane, { Pane } from 'react-split-pane'
import '@/splitpane.css'

import { IPlan, IViewOptionsAnyOne, IViewOptions } from '@/iplan'
import Node from '@/inode'
import Dragscroll from '@/dragscroll'

import { PlanTabSettingsPane } from './PlanTabSettingsPane'
import { PlanNode } from '../PlanNode'


export interface PlanTabProps {
  rootNode: Node,
  plan: IPlan,
  viewOptions: IViewOptions,
  handleViewOptionsChange: (options: IViewOptionsAnyOne) => void,
}

export function PlanTab({
  rootNode,
  plan,
  viewOptions,
  handleViewOptionsChange,
}: PlanTabProps) {
  const [highlightNode, setHighlightNode] = useState(new Node(''))
  const [selectedNodeId, setSelectedNodeId] = useState(0)

  function handleResize(newSize: number) {
    handleViewOptionsChange({ diagramWidth: newSize })
  }

  // Here, we use useCallback to create a ref,
  // which will call the function when the ref attached to the element.
  const planRef = useCallback((elem) => {
    // Bind drag && scroll events onto plan element.
    const scroll = new Dragscroll(elem)
  }, [])

  return (
    <div className="flex-grow-1 d-flex overflow-hidden">
      <div className="flex-grow-1 overflow-hidden">
        <SplitPane
          className='split-pane-wrap'
          split={'vertical'}
          onChange={handleResize}
          size={viewOptions.showDiagram ? viewOptions.diagramWidth : 0}
          minSize={0}
        >
          <Pane className="d-flex">
            <div>TODO: place diagram component</div>
          </Pane>
          <Pane
            eleRef={planRef}
            className="plan d-flex flex-column flex-grow-1 grab-bing overflow-auto"
          >
            <ul className="main-plan p-2 mb-0">
              <li>
                <PlanNode
                  node={rootNode}
                  plan={plan}
                  viewOptions={viewOptions}
                  selectedNodeId={selectedNodeId}
                  setSelectedNodeId={setSelectedNodeId}
                />
              </li>
            </ul>
            {
              plan.ctes.length > 0 && (
                <ul className="init-plans p-2 mb-0">
                  {
                    plan.ctes.map((node: Node) => (
                      <li>
                        <PlanNode
                          node={node}
                          plan={plan}
                          viewOptions={viewOptions}
                          selectedNodeId={selectedNodeId}
                          setSelectedNodeId={setSelectedNodeId}
                        />
                      </li>
                    ))
                  }
                </ul>
              )
            }
          </Pane>
        </SplitPane>
      </div>
      <PlanTabSettingsPane
        viewOptions={viewOptions}
        handleViewOptionsChange={handleViewOptionsChange}
      />
    </div>
  )
}