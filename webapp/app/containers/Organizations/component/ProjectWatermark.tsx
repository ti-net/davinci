import React from 'react'
import { connect } from 'react-redux'
import { Icon, Col, Checkbox, Row, Radio, Form, Button, Input, Divider, Select } from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const styles = require('../Project.less')
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { SketchPicker } from 'react-color'
import Watermark from 'components/Watermark'
import {makeSelectCurrentOrganizationProject} from 'containers/Organizations/selectors'
import {ProjectActions} from 'containers/Projects/actions'

interface IProjectWatermarkProps {
  form: any
  onSaved: () => any
  type: string
  projectDetail: any
  onEditProject: (project: any, resolve: () => any) => any
}

interface IColorProp {
  color: string
}

export class ProjectWatermark extends React.PureComponent<IProjectWatermarkProps, {selected: IColorProp}> {

  constructor (props) {
    super(props)

    this.state = {
      selected: {
        color: '#C5CBCF'
      }
    }
  }

  private submit = () => {
    const { onEditProject, projectDetail } = this.props
    const { selected } = this.state
    const values = this.props.form.getFieldsValue()
    const {watermarkEnable, watermarkContent, watermarkDateFormat, watermarkColor, watermarkIsProject, watermarkIsUsername} = values

    onEditProject({
      id: projectDetail.id,
      name: projectDetail.name,
      description: projectDetail.description,
      config: Object.assign(projectDetail.config, {watermark: {'enable': watermarkEnable, 'isProject': watermarkIsProject, 'isUsername': watermarkIsUsername, 'content': watermarkContent, 'dateFormat': watermarkDateFormat, 'color': selected.color}})
    }, () => {
      this.props.onSaved()
    })

  }

  public componentWillReceiveProps (nextProps) {
    const {projectDetail: {id, config: {watermark}}} = nextProps
    if (id !== this.props.projectDetail.id) {
      this.setState ({
        selected: {
          color: nextProps.projectDetail.config.watermark.color
        }
      })
      const watermarkEnable = watermark.enable
      const watermarkIsProject = watermark.isProject
      const watermarkIsUsername = watermark.isUsername
      const watermarkContent = watermark.content
      const watermarkDateFormat = watermark.dateFormat
      this.props.form.setFieldsValue({ watermarkEnable, watermarkIsProject, watermarkIsUsername, watermarkContent, watermarkDateFormat }, null)
    }
  }

  public componentDidMount () {
    const {projectDetail: {config: {watermark}}} = this.props
    const { selected } = this.state
    selected.color = watermark.color

    const watermarkEnable = watermark.enable
    const watermarkIsProject = watermark.isProject
    const watermarkIsUsername = watermark.isUsername
    const watermarkContent = watermark.content
    const watermarkDateFormat = watermark.dateFormat
    this.props.form.setFieldsValue({ watermarkEnable, watermarkIsProject, watermarkIsUsername, watermarkContent, watermarkDateFormat }, null)
  }

  public handleColorChange = (watermarkEnable) => (color) => {
    if (watermarkEnable) {
      this.setState({
        selected: {
          color: color.hex
        }
      })
    }
  }

  public render () {
    const {getFieldDecorator} = this.props.form
    const { projectDetail } = this.props
    const { selected } = this.state
    const values = this.props.form.getFieldsValue()
    const {watermarkEnable, watermarkContent, watermarkDateFormat, watermarkIsProject, watermarkIsUsername} = values
    const { Option } = Select
    const watermarkTextArray = []
    if (watermarkIsProject) {
      watermarkTextArray.push(projectDetail ? projectDetail.name : '')
    }

    return (
      <div className={styles.basic}>
        <div>
          <Form>

            <Row gutter={24}>
              <Col span={24}>
                <FormItem label="水印启用">
                  {getFieldDecorator('watermarkEnable', {})(
                    <RadioGroup>
                      <RadioButton value={true}>开启</RadioButton>
                      <RadioButton value={false}>关闭</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={4}>
                <FormItem label="项目">
                  {getFieldDecorator('watermarkIsProject', {})(
                    <Checkbox checked={watermarkIsProject} disabled={!watermarkEnable}>
                    项目名称
                  </Checkbox>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="用户">
                  {getFieldDecorator('watermarkIsUsername', {})(
                    <Checkbox checked={watermarkIsUsername} disabled={!watermarkEnable}>
                    用户名
                  </Checkbox>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="水印文本">
                  {getFieldDecorator('watermarkContent', {})(
                    <Input placeholder="水印文本" value={watermarkContent} disabled={!watermarkEnable}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="水印日期"
                >
                  {getFieldDecorator('watermarkDateFormat', {})(
                    <Select style={{ width: 220 }} disabled={!watermarkEnable}>
                      <Option value="yyyy-MM-dd">年-月-日</Option>
                      <Option value="yyyy/MM/dd">年/月/日</Option>
                      <Option value="yyyy.MM.dd">年.月.日</Option>
                      <Option value="yyyy-MM-dd hh:mm:ss">年-月-日 时:分:秒</Option>
                      <Option value="yyyy/MM/dd hh:mm:ss">年/月/日 时:分:秒</Option>
                      <Option value="yyyy.MM.dd hh:mm:ss">年.月.日 时:分:秒</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem>
                  <Divider orientation="left">水印颜色</Divider>
                  <SketchPicker
                    color={selected.color}
                    onChangeComplete={this.handleColorChange(watermarkEnable)}
                    disableAlpha
                  />
                </FormItem>
              </Col>
              <Col span={16}>
                <Divider orientation="left">水印预览</Divider>
                <div className={'Watermark-target'} style={{height: 340, width: '100%', border: '1px solid #e5e5e5'}}>
                <Watermark
                    selector={'.Watermark-target'}
                    color={selected.color}
                    textArray={watermarkTextArray}
                    isProject={watermarkIsProject}
                    isUsername={watermarkIsUsername}
                    content={watermarkContent}
                    enable={true}
                    dateFormat={watermarkDateFormat}
                />
                </div>
              </Col>
            </Row>
          </Form>
          <div className={styles.save}>
            <Row>
              <Col>
                <Button size="large" type="primary" onClick={this.submit}>保存设置</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    onEditProject: (project, resolve) => dispatch(ProjectActions.editProject(project, resolve))
  }
}

const mapStateToProps = createStructuredSelector({
  projectDetail: makeSelectCurrentOrganizationProject()
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect
)(Form.create()(ProjectWatermark))
