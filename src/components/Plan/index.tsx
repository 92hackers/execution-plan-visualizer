/**
 * Main Plan compnent
 */

import React, { useMemo, useState } from 'react'
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

// Sub components
import { TopHeader } from './TopHeader'
import { TabContent } from './TabContent'


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

function Plan() {
  const [activeTab, setActiveTab] = useState('plan')
  const [queryText, setQueryText] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [viewOptions, setViewOptions] = useState(initViewOptions)
  const [plan, setPlan] = useState(initPlan)

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
        handleViewOptionsChange={handleViewOptionsChange}
      />
    </div>
  )
}

export default Plan