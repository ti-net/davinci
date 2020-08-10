/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import { IChartProps } from '../../components/Chart'
import { EChartOption } from 'echarts'
import * as echarts from 'echarts/lib/echarts'
import geoData from 'assets/js/geo.js'
import {
  decodeMetricName
} from '../../components/util'

import {
  DEFAULT_ECHARTS_THEME
} from 'app/globalConstants'
import { getFormattedValue } from '../../components/Config/Format'

export default function (chartProps: IChartProps, drillOptions?: any) {
  const {
    chartStyles,
    data,
    cols,
    metrics
  } = chartProps

  const {
    label,
    spec
  } = chartStyles

  const {
    labelColor,
    labelFontFamily,
    labelFontSize,
    labelPosition,
    showLabel
  } = label

  const {
    layerType,
    mapinfo,
    roam,
    is3D
  } = spec

  const { instance } = drillOptions

  const tooltip: EChartOption.Tooltip = {
    trigger: 'item',
    formatter: (params: EChartOption.Tooltip.Format) => {
      const { name, data, color } = params
      const tooltipLabels = []
      if (color) {
        tooltipLabels.push(`<span class="widget-tooltip-circle" style="background: ${color}"></span>`)
      }
      tooltipLabels.push(name)
      if (data) {
        tooltipLabels.push(': ')
        tooltipLabels.push(getFormattedValue(data.value, metrics[0].format))
      }
      return tooltipLabels.join('')
    }
  }

  const labelOption = {
    label: {
      normal: {
        formatter: '{b}',
        position: labelPosition,
        show: showLabel,
        color: labelColor,
        fontFamily: labelFontFamily,
        fontSize: labelFontSize
      }
    }
  }

  let metricOptions
  let visualMapOptions

  const dataTree = {}
  let min = 0
  let max = 0

  const agg = metrics[0].agg
  const metricName = decodeMetricName(metrics[0].name)

  data.forEach((record) => {
    let areaVal

    const value = record[`${agg}(${metricName})`]
    min = Math.min(min, value)
    max = Math.max(max, value)

    cols.forEach((col) => {
      areaVal = record[col.name]
      if (areaVal) {
        if (!dataTree[areaVal]) {
          dataTree[areaVal] = value
        } else {
          dataTree[areaVal] += value
        }
      }
    })
  })

  // series 数据项
  const metricArr = []

  if (mapinfo != null && mapinfo !== '') {
    echarts.registerMap('test', require('../../../../assets/json/map/' + mapinfo + '.json'))
  } else {
    echarts.registerMap('test', require('../../../../assets/json/map/0.json'))
  }

  let serieObj
  if (is3D) {
    serieObj = {
        map: 'test',
        type: 'map3D',
        roam,
        // geoIndex: 0,
        light: {
            main: {
                intensity: 1,
                shadow: true,
                alpha: 150,
                beta: 70
            },
            ambient: {
                intensity: 0
            }
        },
        itemStyle: {
            areaColor: 'red',
            opacity: 1,
            borderWidth: 0.8,
            borderColor: 'rgb(62,215,213)'
        },
        data: Object.keys(dataTree).map((key, index) => {
            const value = dataTree[key]
            return {
            name: key,
            value
            }
        }),
        ...labelOption
    }
  } else {
    serieObj = {
        name: 'china',
        type: 'map',
        mapType: 'test',
        roam,
        // geoIndex: 0,
        itemStyle: {
            areaColor: 'red',
            opacity: 1,
            borderWidth: 0.8,
            borderColor: 'rgb(62,215,213)'
        },
        data: Object.keys(dataTree).map((key, index) => {
            const value = dataTree[key]
            return {
            name: key,
            value
            }
        }),
        ...labelOption
      }
  }

  metricArr.push(serieObj)
  metricOptions = {
    series: metricArr
  }

  if (chartStyles.visualMap) {
    const {
      showVisualMap,
      visualMapPosition,
      fontFamily,
      fontSize,
      visualMapDirection,
      visualMapWidth,
      visualMapHeight,
      startColor,
      endColor
    } = chartStyles.visualMap

    visualMapOptions = {
      visualMap: {
        show: layerType === 'lines' ? false : showVisualMap,
        min,
        max,
        calculable: true,
        inRange: {
          color: [startColor, endColor]
        },
        ...getPosition(visualMapPosition),
        itemWidth: visualMapWidth,
        itemHeight: visualMapHeight,
        textStyle: {
          fontFamily,
          fontSize
        },
        orient: visualMapDirection
      }
    }
  } else {
    visualMapOptions = {
      visualMap: {
        show: false,
        min,
        max,
        calculable: true,
        inRange: {
          color: DEFAULT_ECHARTS_THEME.visualMapColor
        },
        left: 10,
        bottom: 20,
        itemWidth: 20,
        itemHeight: 50,
        textStyle: {
          fontFamily: 'PingFang SC',
          fontSize: 12
        },
        orient: 'vertical'
      }
    }
  }

  const mapOptions = {
    ...metricOptions,
    ...visualMapOptions,
    tooltip
  }
  if (is3D) {
    instance.off('click')
  } else {
    instance.off('click')
    instance.on('click', (params) => {
        mapClick(params, mapOptions, instance)
    })
    instance.on('contextmenu', (params) => {
        mapReturn(params, mapOptions, instance)
    })
  }

  return mapOptions
}

function getPosition (position) {
  let positionValue
  switch (position) {
    case 'leftBottom':
      positionValue = {
        left: 'left',
        top: 'bottom'
      }
      break
    case 'leftTop':
      positionValue = {
        left: 'left',
        top: 'top'
      }
      break
    case 'rightTop':
      positionValue = {
        left: 'right',
        top: 'top'
      }
      break
    case 'rightBottom':
      positionValue = {
        left: 'right',
        top: 'bottom'
      }
      break
  }
  return positionValue
}

function mapClick (params, mapOptions, instance) {
    const area = geoData.find((d) => d.name.includes(params.name))
    if (area) {
        echarts.registerMap('test', require('../../../../assets/json/map/' + area.id + '.json'))
        instance.setOption(mapOptions)
    }
}

function mapReturn (params, mapOptions, instance) {
    const area = geoData.find((d) => d.name.includes(params.name))
    const parent = geoData.find((g) => g.id === area.parent)
    if (area) {
        echarts.registerMap('test', require('../../../../assets/json/map/' + parent.parent + '.json'))
        instance.setOption(mapOptions)
    }
}
