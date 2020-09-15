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

import * as React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { RouteComponentProps } from 'react-router-dom'

import LoginForm from './LoginForm'
import { Icon } from 'antd'

import { compose } from 'redux'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
// import reducer from '../App/reducer'
// import saga from '../App/sagas'

import { login, logged, getLoginUser } from '../App/actions'
import { makeSelectLoginLoading } from '../App/selectors'
import checkLogin from 'utils/checkLogin'
import { setToken } from 'utils/request'
import { statistic } from 'utils/statistic/statistic.dv'
import ExternalLogin from '../ExternalLogin'
import request from 'utils/request'

const styles = require('./Login.less')

interface ILoginProps {
  loginLoading: boolean
  onLogin: (username: string, password: string, resolve: () => any) => any
  onLogged: (user) => void
  onGetLoginUser: (token: string, id: string, resolve: (res: any) => any) => any
}

interface ILoginStates {
  username: string
  password: string
  isJump: boolean
}

export class Login extends React.PureComponent<ILoginProps & RouteComponentProps, ILoginStates> {
  constructor (props) {
    super(props)
    // debugger
    const qs = location.href.split('?')[1]
    if (qs || sessionStorage.getItem('username')) {
      if (qs) {
        const username = qs.split('=')[1] ? qs.split('=')[1] : ''
        this.state = {
          username,
          password: 'Aa123456',
          isJump: true
        }
        sessionStorage.setItem('username', username)
      } else {
        const username = sessionStorage.getItem('username')
        this.state = {
          username,
          password: 'Aa123456',
          isJump: true
        }
      }
    } else {
      this.state = {
        username: '',
        password: '',
        isJump: false
      }
    }

  }

  public componentWillMount () {
    this.checkNormalLogin()
    if (this.state.isJump) {
      this.doLogin()
    }
  }

  private checkNormalLogin = () => {
    if (checkLogin()) {
      const token = localStorage.getItem('TOKEN')
      const loginUser = localStorage.getItem('loginUser')
      setToken(token)
      this.props.onLogged(JSON.parse(loginUser))
      this.props.history.replace('/')
    }
  }

  private changeUsername = (e) => {
    this.setState({
      username: e.target.value.trim()
    })
  }

  private changePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  private toSignUp = () => {
    const { history } = this.props
    history.replace('/register')
  }

  private doLogin = () => {
    const { onLogin, history } = this.props
    const { username, password } = this.state
    console.log(username, password)
    if (username && password) {
      onLogin(username, password, () => {
        history.replace('/')
        statistic.whenSendTerminal()
        statistic.setOperations({
            create_time:  statistic.getCurrentDateTime()
          }, (data) => {
            const loginRecord = {
              ...data,
              action: 'login'
            }
            statistic.sendOperation(loginRecord)
        })
      })
    }
  }

  public render () {
    const { loginLoading } = this.props
    const { username, password } = this.state
    return (
      <div className={styles.window}>
        <Helmet title="Login" />
        <LoginForm
          username={username}
          password={password}
          onChangeUsername={this.changeUsername}
          onChangePassword={this.changePassword}
          onLogin={this.doLogin}
        />
        <button
          disabled={loginLoading}
          onClick={this.doLogin}
        >
          {
            loginLoading
              ? <Icon type="loading" />
              : ''
          }
          登 录
        </button>
        <p className={styles.tips}>
          <span>还没有账号？ </span>
          <a href="javascript:;" onClick={this.toSignUp}>注册davinci账号</a>
        </p>
        <ExternalLogin />
        正在登陆...
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  loginLoading: makeSelectLoginLoading()
})

export function mapDispatchToProps (dispatch) {
  return {
    onLogin: (username, password, resolve) => dispatch(login(username, password, resolve)),
    onLogged: (user) => dispatch(logged(user)),
    onGetLoginUser: (resolve) => dispatch(getLoginUser(resolve)),
  }
}

const withConnect = connect<{}, {}, ILoginProps>(mapStateToProps, mapDispatchToProps)
// const withReducer = injectReducer({ key: 'global', reducer })
// const withSaga = injectSaga({ key: 'global', saga })

export default compose(
//  withReducer,
//  withSaga,
 withConnect
)(Login)




