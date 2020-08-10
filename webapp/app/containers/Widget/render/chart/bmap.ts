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
import {
  decodeMetricName,
  getSizeRate
} from '../../components/util'
import {
  getLegendOption,
  getSymbolSize
} from './util'

import {
  DEFAULT_ECHARTS_THEME
} from 'app/globalConstants'
import { getFormattedValue } from '../../components/Config/Format'

export default function (chartProps: IChartProps) {
  const {
    chartStyles,
    data,
    cols,
    metrics,
    model
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
    effectType,
    bubbleValue,
    bubbleType,
    themeType,
    lonValue,
    latValue,
    zoomValue,
  } = spec

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
    },
    type: effectType === 'raindrop' ? 'scatter' : effectType,
    symbol: effectType === 'raindrop' ? 'pin' : ''
  }

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
        tooltipLabels.push(getFormattedValue(data.value[2], metrics[0].format))
      }
      return tooltipLabels.join('')
    }
  }

  let metricOptions
  let visualMapOptions
  let themeOptions

  const dataTree = {}
  let min = 0
  let max = 0

  const agg = metrics[0].agg
  const metricName = decodeMetricName(metrics[0].name)

  // 数据处理
  let viewName = ''
  let lonName = ''
  let latName = ''

  cols.forEach((col) => {
    const { visualType } = model[col.name]
    if (visualType === 'longitude') {
        lonName = col.name
    } else if (visualType === 'dimension') {
        latName = col.name
    } else {
        viewName = col.name
    }
  })

  data.forEach((record) => {
    const value = record[`${agg}(${metricName})`]

    min = Math.min(min, value)
    max = Math.max(max, value)

    if (viewName !== '' && viewName !== null) {
      if (!dataTree[record[viewName]]) {
        dataTree[record[viewName]] = {
            lon: record[lonName],
            lat: record[latName],
            value
        }
      }
    }
  })
  // 地图视觉处理
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
  // 主题设置
  switch (themeType) {
    case 'simpleWind':
      themeOptions = {
        mapStyle: {
          styleJson: [{
            featureType: 'water',
            elementType: 'all',
            stylers: {
                color: '#d1d1d1'
            }
          }, {
            featureType: 'land',
            elementType: 'all',
            stylers: {
                color: '#f3f3f3'
            }
          }, {
            featureType: 'railway',
            elementType: 'all',
            stylers: {
                visibility: 'off'
            }
          }, {
            featureType: 'highway',
            elementType: 'all',
            stylers: {
                color: '#fdfdfd'
            }
          }, {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
                visibility: 'off'
            }
          }, {
            featureType: 'arterial',
            elementType: 'geometry',
            stylers: {
                color: '#fefefe'
            }
          }, {
            featureType: 'arterial',
            elementType: 'geometry.fill',
            stylers: {
                color: '#fefefe'
            }
          }, {
            featureType: 'poi',
            elementType: 'all',
            stylers: {
                visibility: 'off'
            }
          }, {
            featureType: 'green',
            elementType: 'all',
            stylers: {
                visibility: 'off'
            }
          }, {
            featureType: 'subway',
            elementType: 'all',
            stylers: {
                visibility: 'off'
            }
          }, {
            featureType: 'manmade',
            elementType: 'all',
            stylers: {
                color: '#d1d1d1'
            }
          }, {
            featureType: 'local',
            elementType: 'all',
            stylers: {
                color: '#d1d1d1'
            }
          }, {
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
                visibility: 'off'
            }
          }, {
            featureType: 'boundary',
            elementType: 'all',
            stylers: {
                color: '#fefefe'
            }
          }, {
            featureType: 'building',
            elementType: 'all',
            stylers: {
                color: '#d1d1d1'
            }
          }, {
            featureType: 'label',
            elementType: 'labels.text.fill',
            stylers: {
                color: '#999999'
            }
          }]
        }
      }
      break
    case 'naturalGreen':
        themeOptions = {
          mapStyle: {
            styleJson: [{
                featureType: 'water',
                elementType: 'all',
                stylers: {
                    color: '#72b8fe'
                }
            }, {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#ffffff'
                }
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: {
                    visibility: '#bababa'
                }
            }, {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#767676'
                }
            }, {
                featureType: 'road',
                elementType: 'labels.text.stroke',
                stylers: {
                    visibility: '#ffffff'
                }
            }, {
                featureType: 'land',
                elementType: 'all',
                stylers: {
                    color: '#b8cb93'
                }
            }]
          }
        }
        break
    case 'nightWind':
        themeOptions = {
          mapStyle: {
            styleJson: [{
                featureType: 'land',
                elementType: 'geometry',
                stylers: {
                    color: '#212121'
                }
            }, {
                featureType: 'building',
                elementType: 'geometry',
                stylers: {
                    color: '#2b2b2b'
                }
            }, {
                featureType: 'highway',
                elementType: 'all',
                stylers: {
                    lightness: -42,
                    saturation: -91
                }
            }, {
                featureType: 'arterial',
                elementType: 'geometry',
                stylers: {
                    lightness: -77,
                    saturation: -94
                }
            }, {
                featureType: 'green',
                elementType: 'geometry',
                stylers: {
                    visibility: '#1b1b1b'
                }
            }, {
                featureType: 'water',
                elementType: 'geometry',
                stylers: {
                    color: '#181818'
                }
            }, {
                featureType: 'subway',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#181818'
                }
            }, {
                featureType: 'railway',
                elementType: 'geometry',
                stylers: {
                    lightness: -52
                }
            }, {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: {
                    visibility: '#313131'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: {
                    visibility: '#8b8787'
                }
            }, {
                featureType: 'manmade',
                elementType: 'geometry',
                stylers: {
                    color: '#1b1b1b'
                }
            }, {
                featureType: 'local',
                elementType: 'geometry',
                stylers: {
                    lightness: -75,
                    saturation: -91
                }
            }, {
                featureType: 'subway',
                elementType: 'geometry',
                stylers: {
                    lightness: -65
                }
            }, {
                featureType: 'railway',
                elementType: 'all',
                stylers: {
                    lightness: -40
                }
            }, {
                featureType: 'boundary',
                elementType: 'geometry',
                stylers: {
                    color: '#8b8787',
                    weight: '1',
                    lightness: -29
                }
            }]
          }
        }
        break
    case 'midnightBlue':
        themeOptions = {
          mapStyle: {
            styleJson: [{
                featureType: 'water',
                elementType: 'all',
                stylers: {
                    color: '#021019'
                }
            }, {
                featureType: 'highway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#000000'
                }
            }, {
                featureType: 'highway',
                elementType: 'geometry.stroke',
                stylers: {
                    visibility: '#147a92'
                }
            }, {
                featureType: 'arterial',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#000000'
                }
            }, {
                featureType: 'arterial',
                elementType: 'geometry.stroke',
                stylers: {
                    visibility: '#0b3d51'
                }
            }, {
                featureType: 'local',
                elementType: 'geometry',
                stylers: {
                    color: '#000000'
                }
            }, {
                featureType: 'land',
                elementType: 'all',
                stylers: {
                    color: '#08304b'
                }
            }, {
                featureType: 'railway',
                elementType: 'geometry.fill',
                stylers: {
                    visibility: '#000000'
                }
            }, {
                featureType: 'railway',
                elementType: 'geometry.stroke',
                stylers: {
                    visibility: '#08304b'
                }
            }, {
                featureType: 'subway',
                elementType: 'geometry',
                stylers: {
                    lightness: -70
                }
            }, {
                featureType: 'building',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#000000'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#857f7f'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: {
                    visibility: '#000000'
                }
            }, {
                featureType: 'building',
                elementType: 'geometry',
                stylers: {
                    color: '#022338'
                }
            }, {
                featureType: 'green',
                elementType: 'geometry',
                stylers: {
                    color: '#062032'
                }
            }, {
                featureType: 'boundary',
                elementType: 'all',
                stylers: {
                    color: '#1e1c1c'
                }
            }, {
                featureType: 'manmade',
                elementType: 'geometry',
                stylers: {
                    color: '#022338'
                }
            }, {
                featureType: 'poi',
                elementType: 'all',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#2da0c6',
                    visibility: 'on'
                }
            }]
          }
        }
        break
  }
  // 主题设置 end
  // series 数据项
  const metricArr = []
  const sizeRate = getSizeRate(min, max)

  const serieObj = {
    coordinateSystem: 'bmap',
    data: Object.keys(dataTree).map((key, index) => {
        const { lon, lat, value } = dataTree[key]
        return {
          name: key,
          value: [lon, lat, value]
        }
    }),
    symbolSize: bubbleType === 'fixed' ? bubbleValue : (val) => {
        if (bubbleType === 'enlarge') {
            return val[2] * bubbleValue
        } else if (bubbleType === 'reduce') {
            return val[2] / bubbleValue
        } else {
            return getSymbolSize(sizeRate, val[2]) / 2
        }
    },
    pointSize: bubbleValue > 0 ? bubbleValue : 1, // 设置 热力图点的大小
    blurSize: bubbleValue > 0 ? bubbleValue : 1, // 设置 热力图点的阴影半径
    rippleEffect: {
        brushType: 'stroke'
    },
    ...labelOption
  }

  metricArr.push(serieObj)
  metricOptions = {
    bmap: {
        center: [lonValue > 0 ? lonValue : 1 , latValue > 0 ? latValue : 1],
        zoom: zoomValue > 0 ? zoomValue : 1,
        roam: true,
        ...themeOptions
      },
    series: metricArr
  }

  const legendData = []

  let legendOption
  if (chartStyles.legend) {
    legendOption = {
      legend: getLegendOption(chartStyles.legend, legendData)
    }
  } else {
    legendOption = null
  }

  const mapOptions = {
    ...metricOptions,
    ...visualMapOptions,
    tooltip
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
