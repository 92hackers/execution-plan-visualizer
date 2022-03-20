/**
 * Collapse Handler
 */

import React from 'react'
import classNames from 'classnames'

interface CollapseHandleProps {
  childPlansCount: number,
  collapsed: boolean,
  setCollapsed: (collapsed: boolean) => void,
}

export function CollapseHandle({
  childPlansCount, collapsed, setCollapsed,
}: CollapseHandleProps) {
  if (!childPlansCount) return null
  return (
    <div className="collapse-handle">
      <i
        className={classNames('fa fa-fw', { 'fa-compress': !collapsed, 'fa-expand': collapsed })}
        onClick={() => setCollapsed(!collapsed)}
        title="Collpase or expand child nodes"
      ></i>
    </div>
  )
}
