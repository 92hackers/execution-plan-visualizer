/**
 * Plan Tab
 */

import React, { useCallback, useEffect, useState } from 'react'
import SplitPane, { Pane } from 'react-split-pane'
import '@/splitpane.css'

import { IPlan, IViewOptionsAnyOne, IViewOptions } from '@/iplan'
import Node from '@/inode'
import Dragscroll from '@/dragscroll'

import { PlanTabSettingsPane } from './PlanTabSettingsPane'
import { PlanNode } from '../PlanNode'
import { PlanDiagram } from '../Diagram'

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
  const [highlightNode, setHighlightNode] = useState<string>('')
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')

  function onHashChange(): void {
    const reg = /#([a-zA-Z]*)(\/node\/([0-9]*))*/;
    const matches = reg.exec(window.location.hash);
    if (matches) {
      const nodeId = matches[3];
      if (nodeId !== undefined) {
        // Delayed to make sure the tab has changed before recentering
        setTimeout(() => {
          setSelectedNodeId(parseInt(nodeId, 10).toString());
        }, 1);
      }
    }
  }

  useEffect(() => {
    onHashChange()
    // Bind hash change event.
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

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
          resizerStyle={{ borderColor: '#999' }}
        >
          <Pane className="d-flex">
            <PlanDiagram
              plan={plan}
              highlightNode={highlightNode}
              setHighlightNode={setHighlightNode}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
            />
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
                  setHeighlightNodeId={setHighlightNode}
                />
              </li>
            </ul>
            {
              plan.ctes.length > 0 && (
                <ul className="init-plans p-2 mb-0">
                  {
                    plan.ctes.map((node: Node, index: number) => (
                      <li key={index}>
                        <PlanNode
                          node={node}
                          plan={plan}
                          viewOptions={viewOptions}
                          selectedNodeId={selectedNodeId}
                          setSelectedNodeId={setSelectedNodeId}
                          setHeighlightNodeId={setHighlightNode}
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