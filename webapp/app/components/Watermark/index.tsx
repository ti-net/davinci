import React from 'react'
import { makeSelectCurrentProject } from 'containers/Projects/selectors'
import {connect} from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { makeSelectLoginUser } from 'containers/App/selectors'


const buttonStyle = {
  display: 'none'
}

export const formatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : addZero(str))
    }
  }
  return fmt
}

function addZero (str) {
  return ('00' + str).substr(str.length)
}

interface IWatermarkProps {
  selector: string
  color: string
  textArray?: any
  enable: boolean
  isProject: boolean
  isUsername: boolean
  content: string
  dateFormat: string
  loginUser: object
  currentProject: any
}

export class Watermark extends React.PureComponent<IWatermarkProps, {}> {
  private canvas = null
  constructor (props) {
    super(props)
  }

  public componentDidMount () {
    this.watermark(this.props)
  }

  private watermark (props) {
    const { enable, loginUser, textArray, dateFormat, color, content, isUsername } = props

    if (enable) {
        if (isUsername) {
            if (loginUser) {
              textArray.push(loginUser.name)
            }
        }
        if (content) {
            textArray.push(content)
        }
        if (this.canvas) {
            // canvas.width = window.innerWidth / 4;
            // 文本宽度+间隔宽度
            this.canvas.width = 320
            this.canvas.height = (textArray.length + 3) * 44
            const ctx = this.canvas.getContext('2d')
            ctx.font = '20px microsoft-yahei'
        
            const date = formatDate(new Date(), dateFormat ? dateFormat : 'yyyy-MM-dd hh:mm:ss')
            textArray.push(date)
        
            ctx.fillStyle = color || 'rgba(197,203,207)'
            ctx.rotate(-Math.PI / 12)
            // 后面的100可以控制宽度
            let y = (textArray.length - 1) * 50 + 100
            for (let i = 0 ; i < textArray.length; i++) {
                ctx.fillText(textArray[i], 40, y)
                y = y + 20
            }
        
            const src = this.canvas.toDataURL('image/png')
            const els = document.querySelectorAll(props.selector)
            if (els && els.length > 0) {
                els.forEach(function (element) {
                element.style.backgroundImage = `url('${src}')`
                })
            }
        }
    }
  }

  public render () {
    this.watermark(this.props)
    return (
      <div>
        <canvas ref={(node) => this.canvas = node} id="canvas" height="120" style={buttonStyle}/>
      </div>
    )
  }
}


const mapStateToProps = createStructuredSelector({
  loginUser: makeSelectLoginUser(),
  currentProject: makeSelectCurrentProject()
})


export default connect(mapStateToProps, null)(Watermark)

