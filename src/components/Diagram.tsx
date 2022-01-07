import React, { useState } from 'react'
import { EstimateDirection, CenterMode, BufferLocation, HighlightMode, NodeProp, Metric, nodePropTypes } from '../enums';
import { IPlan } from '../iplan';
import classNames from 'classnames'
import { PlanService } from '@/services/plan-service';

class Diagram extends React.PureComponent {
  private metrics = Metric;
  private bufferLocations = BufferLocation;

  constructor(props: any) {
    super(props)
    this.state = {
      metricViewOption: Metric.time,
      buffersMetricViewOption: BufferLocation.shared,
    }
  }

  setMetricViewOption(metric: any) {
    this.setState({
      metricViewOption: metric,
    })
  }

  setBuffersMetricViewOption(metric: any) {
    this.setState({
      buffersMetricViewOption: metric,
    })
  }

  render() {
    const navBtnClassNames = "btn btn-outline-secondary"
    const buffersClassNames = "btn btn-outline-secondary"
    const {
      metricViewOption,
      buffersMetricViewOption,
    } = this.state

    const { plan } = this.props

    return (
      <div>
    
  <div className="diagram">
    <div className="flex-shrink-0">
      <div className="form-group text-center my-1">
        <div className="btn-group btn-group-xs">
          <button className={classNames(navBtnClassNames, { active: metricViewOption === Metric.time })} onClick={() => this.setMetricViewOption(Metric.time)}>time</button>
          <button className={classNames(navBtnClassNames, { active: metricViewOption === Metric.rows })} onClick={() => this.setMetricViewOption(Metric.rows)}>rows</button>
          <button className={classNames(navBtnClassNames, { active: metricViewOption === Metric.estimate_factor })} onClick={() => this.setMetricViewOption(Metric.estimate_factor)}>estimation</button>
          <button className={classNames(navBtnClassNames, { active: metricViewOption === Metric.cost })} onClick={() => this.setMetricViewOption(Metric.cost)}>cost</button>
          <button className={classNames(navBtnClassNames, { active: metricViewOption === Metric.buffers })} onClick={() => this.setMetricViewOption(Metric.buffers)}>buffers</button>
        </div>
      </div>
      <div className="form-group text-center my-1" v-if="viewOptions.metric == metrics.buffers">
        <div className="btn-group btn-group-xs">
          <button className={classNames(buffersClassNames, { active: buffersMetricViewOption === BufferLocation.shared})}
            onClick={() => this.setBuffersMetricViewOption(BufferLocation.shared)}
            disabled={!plan.planStats.maxBlocks[BufferLocation.shared]}
          >
            shared</button>
          <button className={classNames(buffersClassNames, { active: buffersMetricViewOption === BufferLocation.temp})}
            onClick={() => this.setBuffersMetricViewOption(BufferLocation.temp)}
            disabled={!plan.planStats.maxBlocks[BufferLocation.temp]}
          >
            temp</button>
          <button className={classNames(buffersClassNames, { active: buffersMetricViewOption === BufferLocation.local})}
            onClick={() => this.setBuffersMetricViewOption(BufferLocation.local)}
            disabled={!plan.planStats.maxBlocks[BufferLocation.local]}
          >
            local</button>
        </div>
      </div>
      <div className="legend text-center">
        {
          metricViewOption === Metric.buffers && (
            <ul className="list-unstyled list-inline mb-0">
              {
                buffersMetricViewOption != BufferLocation.temp && (
                  <li className="list-inline-item">
                    <span className="bg-hit rounded"></span>
                    Hit
                  </li>
                )
              }
              <li className="list-inline-item">
                <span className="bg-read"></span>
                Read
              </li>
              {
                buffersMetricViewOption != BufferLocation.temp && (
                  <li className="list-inline-item">
                    <span className="bg-dirtied"></span>
                    Dirtied
                  </li>
                )
              }
              <li className="list-inline-item">
                <span className="bg-written"></span>
                Written
              </li>
            </ul>
          )
        }
      </div>
    </div>
    <div className="overflow-auto flex-grow-1" ref="container">
      <table className="m-1" v-if="dataAvailable">
        <tbody>
          {
            plans.forEach((flat, index) => {
              if (index === 0 && plans.length > 1) {
                return (
                  <tr>
                    <th colSpan={3} className="subplan">
                      Main Query Plan
                    </th>
                  </tr>
                )
              }
              flat.forEach((row, index) => {
                if (row[1][nodeProps.SUBPLAN_NAME]) {
                  return (
                    <tr>
                      <td className="subplan pr-1"></td>
                    </tr>
                  )
                }
              })
              return (

              )
            });
          }
        </tbody>
        <tbody v-for="flat, index in plans">
          <tr v-if="index === 0 && plans.length > 1">
            <th colspan="3" className="subplan">
              Main Query Plan
            </th>
          </tr>
          <template v-for="row, index in flat">
            <tr v-if="row[1][nodeProps.SUBPLAN_NAME]">
              <td v-if="!isCTE(row[1])"></td>
              <td
                className="subplan pr-2"
                :className="{'font-weight-bold': isCTE(row[1])}"
                :colspan="isCTE(row[1]) ? 3 : 2"
                >
                <span className="tree-lines">
                  <template v-for="i in lodash.range(row[0])">
                    <template v-if="lodash.indexOf(row[3], i) != -1">│</template><template v-else-if="i !== 0">&nbsp;</template>
                  </template><template v-if="index !== 0">{{ row[2] ? '└' : '├' }}</template>
                </span>
                <a className="font-italic text-reset"
                  href
                  @click.prevent="eventBus.$emit('clickcte', row[1][nodeProps.SUBPLAN_NAME])"
                >
                  {{ row[1][nodeProps.SUBPLAN_NAME] }}
                </a>
              </td>
            </tr>
            <tr
              className="no-focus-outline node"
              :className="{'selected': row[1].nodeId === selected, 'highlight': row[1].nodeId === highlightedNode}"
              :data-tippy-content="getTooltipContent(row[1])"
              @mouseenter="eventBus.$emit('mouseovernode', row[1].nodeId)"
              @mouseleave="eventBus.$emit('mouseoutnode', row[1].nodeId)"
              :ref="'node_' + row[1].nodeId"
              >

              <td className="node-index">
                <a className="font-weight-normal small" :href="'#plan/node/' + row[1].nodeId" @click>#{{row[1].nodeId}}</a>
              </td>
              <td className="node-type pr-2">
                <span className="tree-lines">
                  <template v-for="i in lodash.range(row[0])">
                    <template v-if="lodash.indexOf(row[3], i) != -1">│</template><template v-else-if="i !== 0">&nbsp;</template>
                  </template><template v-if="index !== 0">
                    <template v-if="!row[1][nodeProps.SUBPLAN_NAME]">{{ row[2] ? '└' : '├' }}</template><template v-else>
                      <template v-if="!row[2]">│</template><template v-else>&nbsp;</template>
                    </template>
                  </template>
                </span>
                {{ nodeType(row) }}
              </td>
              <td>
                <!-- time -->
                <div className="progress rounded-0 align-items-center bg-transparent" style="height: 5px;" v-if="viewOptions.metric == metrics.time" :key="'node' + index + 'time'">
                  <div className="progress-bar border-secondary bg-secondary" :className="{'border-left': row[1][nodeProps.EXCLUSIVE_DURATION] > 0}" role="progressbar" :style="'width: ' + row[1][nodeProps.EXCLUSIVE_DURATION] / (plan.planStats.executionTime || plan.content.Plan[nodeProps.ACTUAL_TOTAL_TIME]) * 100 + '%; height:5px;'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                  <div className="progress-bar bg-secondary-light" role="progressbar" :style="'width: ' + (row[1][nodeProps.ACTUAL_TOTAL_TIME] - row[1][nodeProps.EXCLUSIVE_DURATION]) / (plan.planStats.executionTime || plan.content.Plan[nodeProps.ACTUAL_TOTAL_TIME]) * 100 + '%; height:5px;'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <!-- rows -->
                <div className="progress rounded-0 align-items-center bg-transparent" style="height: 5px;" v-else-if="viewOptions.metric == metrics.rows" :key="'node' + index + 'rows'">
                  <div className="bg-secondary" role="progressbar" :style="'width: ' + Math.round(row[1][nodeProps.ACTUAL_ROWS_REVISED] / plan.planStats.maxRows * 100) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                </div>
                <!-- estimation -->
                <div className="progress rounded-0 align-items-center bg-transparent justify-content-center" style="height: 10px;" v-else-if="viewOptions.metric == metrics.estimate_factor" :key="'node' + index + 'estimation'">
                  <span className="text-muted small">
                    <i className="fa fa-fw" :className="{'fa-arrow-down': row[1][nodeProps.PLANNER_ESTIMATE_DIRECTION] === estimateDirections.under}"></i>
                  </span>
                  <div className="progress-bar" :className="[row[1][nodeProps.PLANNER_ESTIMATE_DIRECTION] === estimateDirections.under ? 'bg-secondary' : 'bg-transparent']" role="progressbar" :style="'width: ' + estimateFactorPercent(row) + '%; height:5px;'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                  <div className="progress-bar border-left" role="progressbar" style="width: 1px; height: 5px;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                  <div className="progress-bar" :className="[row[1][nodeProps.PLANNER_ESTIMATE_DIRECTION] === estimateDirections.over ? 'bg-secondary' : 'bg-transparent']" role="progressbar" :style="'width: ' + estimateFactorPercent(row) + '%; height:5px;'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                  <span className="text-muted small">
                    <i className="fa fa-fw" :className="{'fa-arrow-up': row[1][nodeProps.PLANNER_ESTIMATE_DIRECTION] === estimateDirections.over}"></i>
                  </span>
                </div>
                <!-- cost -->
                <div className="progress rounded-0 align-items-center bg-transparent" style="height: 5px;" v-else-if="viewOptions.metric == metrics.cost" :key="'node' + index + 'cost'">
                  <div className="bg-secondary" role="progressbar" :style="'width: ' + Math.round(row[1][nodeProps.EXCLUSIVE_COST] / plan.planStats.maxCost * 100) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                </div>
                <!-- buffers shared -->
                <div className="progress rounded-0 align-items-center bg-transparent" style="height: 5px;" v-else-if="viewOptions.metric == metrics.buffers && viewOptions.buffersMetric == bufferLocations.shared && plan.planStats.maxBlocks[bufferLocations.shared]" :key="'node' + index + 'buffers_shared'">
                  <div className="bg-hit" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_SHARED_HIT_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.shared] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                  <div className="bg-read" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_SHARED_READ_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.shared] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                  <div className="bg-dirtied" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_SHARED_DIRTIED_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.shared] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                  <div className="bg-written" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_SHARED_WRITTEN_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.shared] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                </div>
                <!-- buffers temp -->
                <div className="progress rounded-0 align-items-center bg-transparent" style="height: 5px;" v-else-if="viewOptions.metric == metrics.buffers && viewOptions.buffersMetric == bufferLocations.temp && plan.planStats.maxBlocks[bufferLocations.temp]" :key="'node' + index + 'buffers_temp'">
                  <div className="bg-read" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_TEMP_READ_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.temp] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                  <div className="bg-written" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_TEMP_WRITTEN_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.temp] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                </div>
                <!-- buffers local -->
                <div className="progress rounded-0 align-items-center bg-transparent" style="height: 5px;" v-else-if="viewOptions.metric == metrics.buffers && viewOptions.buffersMetric == bufferLocations.local && plan.planStats.maxBlocks[bufferLocations.local]" :key="'node' + index + 'buffers_local'">
                  <div className="bg-hit" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_LOCAL_HIT_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.local] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                  <div className="bg-read" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_LOCAL_READ_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.local] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                  <div className="bg-dirtied" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_LOCAL_DIRTIED_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.local] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                  <div className="bg-written" role="progressbar" :style="'width: ' + (Math.round(row[1][nodeProps.EXCLUSIVE_LOCAL_WRITTEN_BLOCKS] / plan.planStats.maxBlocks[bufferLocations.local] * 100) || 0) + '%'" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="height: 5px;"></div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div className="p-2 text-center text-muted" v-else>
        <em>
          No data available
        </em>
      </div>
    </div>
  </div>
    )
  }
}

export default Diagram