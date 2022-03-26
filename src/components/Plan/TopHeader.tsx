/**
 * Top Header of Plan
 */

import React, { useMemo, useState } from 'react'
import classNames from 'classnames'

const headerNavs: string[] = ['plan', 'raw', 'query', 'stats']

export interface PlanTopHeaderProps {
  activeTab: string,
  queryText: string,
}

export function TopHeader({ activeTab, queryText }: PlanTopHeaderProps) {
  return (
    <ul className='nav nav-pills'>
      {
        headerNavs.map((nav: string) => {
          const linkClass = classNames('nav-link px-2 py-0', {
            active: activeTab === nav,
            disabled: !queryText && nav === 'query',
          })
          return (
            <li className="nav-item p-1" key={nav}>
              <a className={linkClass} href={`#${nav}`}>{nav.charAt(0).toUpperCase() + nav.slice(1)}</a>
            </li>
          )
        })
      }
    </ul>
  )
}