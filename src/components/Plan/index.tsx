/**
 * Main Plan compnent
 */

import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'

// Required vendor style files
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'react-tippy/dist/tippy.css'
import 'highlight.js/styles/github.css'

// Custom style files
import '@/assets/scss/global.scss'

// Utilities
import {
  CenterMode, HighlightMode, HighlightType,
  NodeProp, Orientation, ViewMode,
} from '@/enums'

import { IViewOptions, IViewOptionsAnyOne, IPlan } from '@/iplan'
import { PlanService } from '@/services/plan-service';
import Node from '@/inode'

// Sub components
import { TopHeader } from './TopHeader'
import { TabContent } from './TabContent'


const planService = new PlanService()

const initViewOptions: IViewOptions = {
  menuHidden: true,
  showHighlightBar: false,
  showPlanStats: true,
  highlightType: HighlightType.NONE,
  viewMode: ViewMode.FULL,
  orientation: Orientation.TWOD,
  showDiagram: true,
  diagramWidth: 300,
};

const initPlan: IPlan = {
  id: '',
  name: '',
  content: null,
  query: '',
  createdOn: new Date(),
  planStats: {},
  formattedQuery: '',
  ctes: [],
  isAnalyze: false,
  isVerbose: false,
}

export interface PlanProps {
  planSource: string,
  planQuery: string,
}

function Plan({
  planSource,
  planQuery,
}: PlanProps) {
  const [activeTab, setActiveTab] = useState('plan')
  const [queryText, setQueryText] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [viewOptions, setViewOptions] = useState(initViewOptions)
  const [plan, setPlan] = useState(initPlan)
  const [rootNode, setRootNode] = useState(new Node(''))

  // Load cached view options from localStorage
  useEffect(() => {
    const savedOptions = localStorage.getItem('viewOptions');
    if (savedOptions) {
      handleViewOptionsChange({ ...JSON.parse(savedOptions)})
    }
  }, [])

  // Parse plan data
  useEffect(() => {
    let planJSON: any
    try {
      planJSON = planService.fromSource(planSource)
      setValidationMessage('')
      setActiveTab('plan')
    } catch (e) {
      setValidationMessage('Could not parse plan')
      return
    }
    setRootNode(planJSON.Plan)
    const qText = planJSON['Query Text'] || planQuery
    setQueryText(qText)
    const planData = planService.createPlan('', planJSON, qText)
    const { content } = planData
    setPlan({
      ...planData,
      planStats: {
        executionTime: content['Execution Time'] || content['Total Runtime'] || null,
        planningTime: content['Planning Time'] || null,
        maxRows: content.maxRows || null,
        maxCost: content.maxCost || null,
        maxDuration: content.maxDuration || null,
        maxBlocks: content.maxBlocks || null,
        triggers: content.Triggers || [],
        jitTime: content.JIT && content.JIT.Timing && content.JIT.Timing.Total || null,
        settings: content.Settings,
      },
    })
  }, [planSource, planQuery])

  function handleViewOptionsChange(options: IViewOptionsAnyOne): void {
    const newViewOptions = { ...viewOptions, ...options }
    localStorage.setItem('viewOptions', JSON.stringify(newViewOptions)) // Save to disk
    setViewOptions(newViewOptions) // Update state
  }

  return (
    <div className='plan-container d-flex flex-column overflow-hidden flex-grow-1 bg-light'>
      <TopHeader activeTab={activeTab} queryText={queryText} />
      <TabContent
        activeTab={activeTab}
        validationMessage={validationMessage}
        viewOptions={viewOptions}
        plan={plan}
        rootNode={rootNode}
        handleViewOptionsChange={handleViewOptionsChange}
      />
    </div>
  )
}

export default Plan