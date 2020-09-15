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

import React, { useContext, useCallback } from 'react'

import { Button, Tooltip, Col, Popconfirm, Switch } from 'antd'
const ButtonGroup = Button.Group

import { DisplayToolbarContext } from './util'
import { GraphTypes } from '../constants'

interface IToolbarDisplayProps {
  onChange: () => void
  isShow: boolean 
  // disabled: any
}

const Display: React.FC<IToolbarDisplayProps> = (props) => {
  // const { onChange, isShow, disabled } = props
  const { onChange ,isShow } = props
  return (
    <Tooltip placement="bottom" title="大屏展示">
        {/* <Switch onChange={onChange} checked={isShow} disabled={disabled}></Switch> */}
        <Switch onChange={onChange} checked={isShow}></Switch>
    </Tooltip>
  )
}
export default Display
