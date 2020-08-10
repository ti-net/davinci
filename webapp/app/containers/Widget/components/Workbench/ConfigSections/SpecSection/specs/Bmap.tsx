import React from 'react'
import { Row, Col, Select, InputNumber } from 'antd'
import { onSectionChange } from './util'
import { ISpecConfig } from '../types'
import { chartBmapScaleOptions, chartBmapThemeOptions, chartBmapEffectOptions } from '../../constants'

import styles from '../../../Workbench.less'

interface ISpecSectionMapProps {
  spec: ISpecConfig
  title: string
  onChange: (value: string | number, propPath: string | string[]) => void
}

function SpecSectionBmap (props: ISpecSectionMapProps) {
  const { spec, title, onChange } = props
  const { effectType, bubbleType, bubbleValue, themeType, lonValue, latValue, zoomValue } = spec

  return (
    <div className={styles.paneBlock}>
      <h4>{title}</h4>
      <div className={styles.blockBody}>
        <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
        <Col span={4}>图形效果</Col>
          <Col span={6}>
            <Select
              placeholder="图形效果"
              className={styles.blockElm}
              value={effectType}
              onChange={onSectionChange(onChange, 'effectType')}
            >
              {chartBmapEffectOptions}
            </Select>
          </Col>
          <Col span={4}>主题</Col>
          <Col span={6}>
            <Select
              placeholder="主题"
              className={styles.blockElm}
              value={themeType}
              onChange={onSectionChange(onChange, 'themeType')}
            >
              {chartBmapThemeOptions}
            </Select>
          </Col>
        </Row>
        <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={4}>中心坐标</Col>
            <Col span={5}>
              <InputNumber
                placeholder="经度"
                className={styles.blockElm}
                value={lonValue}
                min={0}
                onChange={onSectionChange(onChange, 'lonValue')}
              />
            </Col>
            <Col span={5}>
              <InputNumber
                placeholder="纬度"
                className={styles.blockElm}
                value={latValue}
                min={0}
                onChange={onSectionChange(onChange, 'latValue')}
              />
            </Col>
            <Col span={4}>缩放级别</Col>
            <Col span={5}>
              <InputNumber
                placeholder="缩放级别"
                className={styles.blockElm}
                value={zoomValue}
                min={0}
                onChange={onSectionChange(onChange, 'zoomValue')}
              />
            </Col>
        </Row>
        <Row
            gutter={8}
            type="flex"
            align="middle"
            className={styles.blockRow}
          >
            <Col span={4}>气泡大小</Col>
            <Col span={10}>
              <Select
                placeholder="类型"
                className={styles.blockElm}
                value={bubbleType}
                onChange={onSectionChange(onChange, 'bubbleType')}
              >
                {chartBmapScaleOptions}
              </Select>
            </Col>
            {bubbleType !== 'system' ? (
            <Col span={6}>
              <InputNumber
                placeholder="bubbleValue"
                className={styles.blockElm}
                value={bubbleValue}
                min={0}
                onChange={onSectionChange(onChange, 'bubbleValue')}
              />
            </Col>
             ) : null}
        </Row>
      </div>
    </div>
  )
}

export default SpecSectionBmap
