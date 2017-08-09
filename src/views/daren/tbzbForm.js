/**
 * Created by CY on 2016/6/28.
 */
import React, { PropTypes } from 'react'

import {FormateNum} from 'help/formate'

import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Alert from 'antd/lib/alert'
import DatePicker from 'antd/lib/date-picker'
import Button from 'antd/lib/button'

import { NoBalanceCode } from 'help/ajaxErrorCode'
import RechargeView from 'components/rechargeDialog'

const FormItem = Form.Item
var weekday = 7 * 24 * 60 * 60 * 1000
var endday = 14 * 24 * 60 * 60 * 1000
const disabledDate = function (current) {
  return current && current.getTime() < Date.now() + weekday
}
const disabledEndDate = function (current) {
  return current && current.getTime() < Date.now() + endday
}
class BuyItem extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    servicType: PropTypes.number
  };
  render () {
    const data = this.props.data
    let realPrice = data.price
    if (this.props.servicType === 2) {
      realPrice = data.special_price
    }
    return (
      <div style={{display: 'inline-block', margin: '0 8px'}}>
        <div className='media'>
          <div className='media-left '>
            <img className='media-object img-circle' src={data.portrait} width='60px' height='60px'/>
          </div>
          <div className='media-body' style={{padding: '10px 0 0 10px'}}>
            <h4 className='media-heading'>{data.nick}</h4>
            <div>
                发布价： ¥{FormateNum(realPrice)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

let uuid = 1

class TaoBaoZhiBoForm extends React.Component {
  constructor () {
    super()
    this.state = {
      uploading: false,
      showRechargeModal: false
    }
  }
  handleSubmit () {
    const self = this
    const select = this.props.select
    const selectId = select.map((item) => item.id)
    const { form } = this.props
    let keys = form.getFieldValue('linkkeys')
    if (this.props.service_scope === 2 && keys.length < 9) {
      Modal.error({
        title: '提示',
        content: '专场至少添加 10 个推广链接'
      })
      return
    }
    this.props.form.validateFields((errors, values) => {
      /*eslint-disable no-extra-boolean-cast */
      if (!!errors) {
        console.log('Errors in form!!!')
        return
      }
      const links = values.linkkeys.map((item) => {
        let obj = {
          link: values['links' + item]
        }
        return obj
      })
      links.push({
        link: values.links0
      })
      const sendObj = {
        title: values.title,
        m_type: 1,
        start_date: values.start_date.getFullYear() + '-' + (values.start_date.getMonth() + 1) + '-' + (values.start_date.getDate()),
        end_date: values.end_date.getFullYear() + '-' + (values.end_date.getMonth() + 1) + '-' + (values.end_date.getDate()),
        mid: selectId.join(','),
        content: JSON.stringify(links),
        service_scope: this.props.service_scope
      }
      self.setState({uploading: true})
      self.props.submit(sendObj).then((data) => {
        self.setState({uploading: false})
        if (data.msg) {
          if (data.code === NoBalanceCode) {
            self.toggleRechargeModal()
          } else {
            Modal.error({
              title: '提示',
              content: data.msg
            })
          }
          return
        }
        self.props.onClose()
      })
    })
  }
  toggleRechargeModal () {
    const isShow = this.state.showRechargeModal
    this.setState({
      showRechargeModal: !isShow
    })
  }
  removeLink (k) {
    const { form } = this.props
    let keys = form.getFieldValue('linkkeys')
    keys = keys.filter((key) => {
      return key !== k
    })
    form.setFieldsValue({
      linkkeys: keys
    })
  }
  addLink () {
    const { form } = this.props
    let keys = form.getFieldValue('linkkeys')
    if (this.props.service_scope === 1 && keys.length === 1) {
      Modal.warning({
        title: '温馨提示',
        content: '拼场直播只允许添加 2 条推广链接'
      })
      return
    } else if (this.props.service_scope === 2 && keys.length === 49) {
      Modal.warning({
        title: '温馨提示',
        content: '专场直播最多可以添加 50 条推广链接'
      })
      return
    }
    uuid++
    keys = keys.concat(uuid)
    form.setFieldsValue({
      linkkeys: keys
    })
  }
  render () {
    const { getFieldProps, getFieldValue } = this.props.form
    const titleProps = getFieldProps('title', {
      rules: [
        {
          required: true, min: 2, max: 14, message: '活动名称至少为 2 个字符'
        }
      ]
    })
    const startDateProps = getFieldProps('start_date', {
      rules: [
        {
          required: true,
          type: 'date',
          message: '请选择预计最早开始日期'
        }
      ],
      onChange: (value, dateString) => {
        return dateString[0]
      }
    })
    const endDateProps = getFieldProps('end_date', {
      rules: [
        {
          required: true,
          type: 'date',
          message: '请选择预计最晚开始日期'
        }
      ]
    })
    const linkProps = getFieldProps('links0', {
      rules: [
        {
          required: true, min: 2, message: '请添加推广宝贝链接'
        }
      ]
    })
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 }
    }
    getFieldProps('linkkeys', {
      initialValue: [1]
    })
    const linkkeys = getFieldValue('linkkeys')
    const linkItems = linkkeys.map((key, idx) => {
      return (
        <FormItem
          key={key}
          wrapperCol={{ span: 17, offset: 4 }}
        >
          <Input placeholder='请以http://开头' {...getFieldProps(`links${key}`, {
            rules: [{
              required: true,
              whitespace: true,
              message: '请添加推广宝贝链接'
            }]
          })}/>
          <Button onClick={() => this.removeLink(key)} icon='minus' style={{position: 'absolute', right: '-35px'}}/>
        </FormItem>
      )
    })
    return (
      <Modal
        width={700}
        title='创建淘宝直播推广活动'
        visible={this.props.visible}
        maskClosable={false}
        confirmLoading={this.state.uploading}
        onOk={this.handleSubmit.bind(this)}
        onCancel={() => this.props.onClose()}
      >
        <div style={{width: '100%'}} className='clearfix'>
          <div className='text-center'><h5 style={{padding: '16px 0'}}>已选择的达人</h5></div>
          <div style={{width: '500px', overflowX: 'auto', height: 80, whiteSpace: 'nowrap', overflowY: 'hidden', margin: '0 auto'}}>
          {
            this.renderListItem()
          }
          </div>
        </div>
        <hr/>
        {
          this.props.service_scope === 2
          ? <Alert message='您选择的是专场类直播，请您至少填写 10 条推广链接！' type='warning' />
          : <Alert message='您选择的是拼场类直播，只允许填写 2 条推广链接！' type='warning' />
        }
        <Form horizontal form={this.props.form}>
          <FormItem
            label='发布平台'
            {...formItemLayout}
          >
            <p className='ant-form-text' id='static' name='static'>淘宝直播</p>
          </FormItem>
          <FormItem
            label='直播类型'
            {...formItemLayout}
          >
            <p className='ant-form-text' id='type' name='type'>
              {
                this.props.service_scope === 2
                ? '专场'
                : '拼场'
              }
            </p>
          </FormItem>
          <FormItem
            label='活动名称'
            {...formItemLayout}
          >
            <Input defaultValue='' {...titleProps} placeholder='方便活动管理，请勿超过14个字' />
          </FormItem>
          <FormItem
            label='推广产品链接'
            {...formItemLayout}
          >
            <Input defaultValue='' {...linkProps} placeholder='请以http://开头' />
            <Button onClick={() => this.addLink()} icon='plus' style={{position: 'absolute', right: '-35px'}}/>
          </FormItem>

          {linkItems}

          <FormItem
            {...formItemLayout}
            label='计划发布日期'
          >
            <div style={{float: 'left'}}>
              <FormItem><DatePicker {...startDateProps} style={{width: '150px'}} format='yyyy-MM-dd' disabledDate={disabledDate}/></FormItem>
            </div>
            <div style={{float: 'left'}}>&nbsp;-&nbsp;</div>
            <div style={{float: 'left'}}>
              <FormItem><DatePicker {...endDateProps} style={{width: '150px'}} disabledDate={disabledEndDate}/></FormItem>
            </div>
          </FormItem>
          <FormItem>
              <Alert message='小编，会在您选的周期里，为您选一天做宝贝直播，具体的播放时长，欢迎骚扰沟通哟！' type='info' />
          </FormItem>
          <hr/>
          <FormItem
            label='总金额'
            {...formItemLayout}
          >
            <p className='ant-form-text' id='static' name='static'><span style={{fontSize: '18px', color: 'red'}}>{this.calculateTotalPrice()}</span> 元</p>
          </FormItem>
        </Form>
        {this.state.showRechargeModal ? <RechargeView visible={this.state.showRechargeModal} toggle={this.toggleRechargeModal.bind(this)}/> : null}
      </Modal>
    )
  }
  calculateTotalPrice () {
    const select = this.props.select
    let total = 0
    for (let i = 0; i < select.length; i++) {
      var price = parseFloat(select[i].price, 10)
      let realPrice = price
      if (this.props.service_scope === 2) {
        realPrice = parseFloat(select[i].special_price, 10)
      }
      total = total + realPrice
    }
    return FormateNum(total)
  }
  renderListItem () {
    const select = this.props.select
    return select.map((item) => <BuyItem key={'list' + item.id} data={item} servicType={this.props.service_scope}/>)
  }
}
TaoBaoZhiBoForm.propTypes = {
  form: PropTypes.object,
  visible: PropTypes.bool,
  select: PropTypes.array,
  onClose: PropTypes.func,
  service_scope: PropTypes.number,
  servicType: PropTypes.number
}
const x = Form.create({})(TaoBaoZhiBoForm)
export default x
