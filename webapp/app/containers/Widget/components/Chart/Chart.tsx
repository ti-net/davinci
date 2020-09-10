import * as React from 'react'
import { IChartProps } from './index'
import chartlibs from '../../config/chart'
import * as echarts from 'echarts/lib/echarts'
import { ECharts } from 'echarts'
import 'echarts/extension/bmap/bmap'
import chartOptionGenerator from '../../render/chart'
import { getTriggeringRecord } from '../util'
import geoData from 'assets/js/geo.js'
import 'echarts-gl/dist/echarts-gl'
const styles = require('./Chart.less')


export class Chart extends React.PureComponent<IChartProps> {
  private container: HTMLDivElement = null
  private instance: ECharts
  private timerProvinceClick = null
  constructor (props) {
    super(props)
  }
  public componentDidMount () {
    this.renderChart(this.props)
  }

  public componentDidUpdate () {
    this.renderChart(this.props)
  }

  private renderChart = (props: IChartProps) => {
    const { selectedChart, renderType, getDataDrillDetail, isDrilling, onSelectChartsItems, onDoInteract, onCheckTableInteract } = props

    if (renderType === 'loading') {
      return
    }
    if (!this.instance) {
      this.instance = echarts.init(this.container, 'default')
      echarts.registerMap('test', require('../../../../assets/json/map/0.json'))
    } else {
      if (renderType === 'rerender') {
        this.instance.dispose()
        this.instance = echarts.init(this.container, 'default')
      }
      if (renderType === 'clear') {
        // this.instance.clear()
        // 解决百度地图切换问题
        this.instance.dispose()
        this.instance = echarts.init(this.container, 'default')
      }
    }
    if (chartlibs.find((cl) => cl.id === selectedChart)) {

      this.instance.setOption(
        chartOptionGenerator(
          chartlibs.find((cl) => cl.id === selectedChart).name,
          props,
          {
            instance: this.instance,
            isDrilling,
            getDataDrillDetail,
            selectedItems: this.props.selectedItems
          }
        )
      )
    }

    // if (onDoInteract) {
    //   this.instance.off('click')
    //   this.instance.on('click', (params) => {
    //     const isInteractiveChart = onCheckTableInteract()
    //     if (isInteractiveChart) {
    //       const triggerData = getTriggeringRecord(params, seriesData)
    //       onDoInteract(triggerData)
    //     }
    //   })
    // }

    this.instance.off('click')
    this.instance.on('click', (params) => {
      this.collectSelectedItems(params)
    })
    this.instance.resize()
  }

//   public mapClick = (params) => {
//     const { selectedChart, getDataDrillDetail, isDrilling } = this.props
//     const area = geoData.find((d) => d.name.includes(params.name))
//     if (area) {
//         echarts.registerMap('test', require('../../../../assets/json/map/' + area.id + '.json'))
//         // this.instance.clear()
//         this.instance.setOption(
//             chartOptionGenerator(
//             chartlibs.find((cl) => cl.id === selectedChart).name,
//             this.props,
//             {
//                 instance: this.instance,
//                 isDrilling,
//                 getDataDrillDetail,
//                 selectedItems: this.props.selectedItems
//             }
//             )
//         )
//     }
//   }
//   public mapReturn = (params) => {
//     const { selectedChart, getDataDrillDetail, isDrilling } = this.props
//     const area = geoData.find((d) => d.name.includes(params.name))
//     const parent = geoData.find((g) => g.id === area.parent)
//     // console.log(area)
//     if (area) {
//         echarts.registerMap('test', require('../../../../assets/json/map/' + parent.parent + '.json'))
//         this.instance.clear()
//         this.instance.setOption(
//             chartOptionGenerator(
//             chartlibs.find((cl) => cl.id === selectedChart).name,
//             this.props,
//             {
//                 instance: this.instance,
//                 isDrilling,
//                 getDataDrillDetail,
//                 selectedItems: this.props.selectedItems
//             }
//             )
//         )
//     }
//   }
  public collectSelectedItems = (params) => {
    const { data, onSelectChartsItems, selectedChart, onDoInteract, onCheckTableInteract } = this.props
    let selectedItems = []
    if (this.props.selectedItems && this.props.selectedItems.length) {
      selectedItems = [...this.props.selectedItems]
    }
    const { getDataDrillDetail } = this.props
    let dataIndex = params.dataIndex
    if (selectedChart === 4) {
      dataIndex = params.seriesIndex
    }
    if (selectedItems.length === 0) {
      selectedItems.push(dataIndex)
    } else {
      const isb = selectedItems.some((item) => item === dataIndex)
      if (isb) {
        for (let index = 0, l = selectedItems.length; index < l; index++) {
          if (selectedItems[index] === dataIndex) {
            selectedItems.splice(index, 1)
            break
          }
        }
      } else {
        selectedItems.push(dataIndex)
      }
    }

    const resultData = selectedItems.map((item) => {
      return data[item]
    })
    const brushed = [{0: Object.values(resultData)}]
    const sourceData = Object.values(resultData)
    const isInteractiveChart = onCheckTableInteract && onCheckTableInteract()
    if (isInteractiveChart && onDoInteract) {
      const triggerData = sourceData
      onDoInteract(triggerData)
    }
    setTimeout(() => {
      if (getDataDrillDetail) {
        getDataDrillDetail(JSON.stringify({range: null, brushed, sourceData}))
      }
    }, 500)
    if (onSelectChartsItems) {
      onSelectChartsItems(selectedItems)
    }
  }

  public render () {
    return (
      <div
        className={styles.chartContainer}
        ref={(f) => this.container = f}
      />
    )
  }
}

export default Chart
