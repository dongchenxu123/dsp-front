/**
 * Created by CY on 2016/2/26.
 */
import React, { PropTypes } from 'react'
import axios from 'axios'

import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'

//import {pagedata as PageData} from 'help/pagedata'
import { companySet } from 'help/companySetting'
const COMPANY = companySet[__TARGETAGENCY__]

const FormItem = Form.Item
const InputGroup = Input.Group

let Timer = null

let PhoneView = React.createClass({
  propTypes: {
    form: PropTypes.object.isRequired,
    userdata: PropTypes.object.isRequired,
    GetSmsCode: PropTypes.func.isRequired,
    sendPhone: PropTypes.func.isRequired,
    setAgreement: PropTypes.func.isRequired
  },
  mounted: false,
  getInitialState () {
    return {
      wechat: false,
      cmsloading: false,
      iconLoading: false,
      btnNumber: 60
    }
  },
  componentDidMount () {
    this.mounted = true
    const self = this
    const user = this.props.userdata
    if (user.id && user.wechat) {
      return
    }
    axios.get('/bind?do=wechat')
      .then((response) => {
        var data = response.data
        return data
      }).then((data) => {
        if (data.msg) {
          return
        }
        if (data.res && data.res.pic_url) {
          if (self.mounted) {
            self.setState({
              wechat: data.res.pic_url
            })
          }
        }
      }).catch(() => {
        console.log('error')
      })
  },
  componentWillUnmount () {
    this.mounted = false
    if (Timer) {
      clearInterval(Timer)
    }
  },
  handleSubmit (e) {
    e.preventDefault()
  },

  handleAgreeDialogCancel () {

  },
  setAgreement (event) {
    var value = event.target.checked
    this.props.setAgreement(value ? 1 : 0)
  },
  handleAgreeDialogOk () {
    const self = this
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        //console.log('Errors in form!!!')
        //return
      }
      let finalValues = self.props.form.getFieldsValue()
      if (!self.refs.agreement.checked) {
        return
      }
      self.props.sendPhone(finalValues)
    })
  },
  getPhoneCheckCode () {
    const values = this.props.form.getFieldsValue()
    const self = this
    if (!values.telephone) {
      return
    }
    this.setState({
      cmsloading: true
    })
    setTimeout(function () {
      self.setState({
        cmsloading: false
      })
    }, 60000)
    this.renderGetCodeBtnTxt()
    this.props.GetSmsCode(values.telephone)
  },
  checkAgreement (rule, value, callback) {
    if (!value) {
      callback(new Error('必须同意软件使用协议'))
    } else {
      callback()
    }
  },
  checkTelephone (rule, value, callback) {
    const form = this.props.form
    if (value && !form.getFieldValue('code')) {
      callback(new Error('请输入验证码'))
    } else {
      callback()
    }
  },
  checkTelephoneCode (rule, value, callback) {
    const form = this.props.form
    if (value && !form.getFieldValue('telephone')) {
      callback(new Error('请填写电话'))
    } else {
      callback()
    }
  },
  renderGetCodeBtnTxt () {
    const self = this
    Timer = setInterval(() => {
      if (self.state.btnNumber === 0) {
        clearInterval(Timer)
        self.setState({
          btnNumber: 60
        })
        return
      }
      self.setState({
        btnNumber: self.state.btnNumber - 1
      })
    }, 1000)
  },
  render () {
    const user = this.props.userdata
    const telephone = user.telephone
    const { getFieldProps } = this.props.form
    const telephoneProps = getFieldProps('telephone', {
      initialValue: telephone,
      rules: [
        {validator: this.checkTelephone}
      ]
    })
    const codeProps = getFieldProps('code', {
      rules: [
        {validator: this.checkTelephoneCode}
      ]
    })
    const noTel = !telephone
    return (
        <Form horizontal form={this.props.form} onSubmit={this.handleSubmit}>
          <FormItem
            label=''
            labelCol={{ span: 1 }}
            wrapperCol={{ span: 20 }}>
            <p className='ant-form-text' id='userName' name='userName' style={{color: '#ff0000'}}>为了让您获得优质的服务，请输入手机号激活会员，尊享活动优惠</p>
          </FormItem>
          <FormItem
            label='电话：'
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 14 }}>
            <InputGroup>
              <Input type='text' {...telephoneProps} placeholder='请输入电话' disabled={!noTel} />
              <div className='ant-input-group-wrap'>
                <Button type='primary'
                        onClick={this.getPhoneCheckCode}
                        loading={this.state.cmsloading}
                        style={{borderBottomLeftRadius: 0, borderTopLeftRadius: 0, height: '32px'}}>
                  {this.state.cmsloading ? <span>&nbsp; {this.state.btnNumber}</span> : '获取验证码'}
                </Button>
              </div>
            </InputGroup>
          </FormItem>
          <FormItem
            label='验证码：'
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 14 }}>
            <Input type='text' {...codeProps} placeholder='请输入验证码' />
          </FormItem>
          <FormItem
            wrapperCol={{ span: 14, offset: 3 }}>
            <label>
              <input type='checkbox' ref='agreement' onChange={this.setAgreement} />我已经阅读并同意 <a target='_blank' href={COMPANY.agreementLink}> {COMPANY.agreement}</a>
            </label>
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 3 }}>
            <Button type='primary' onClick={this.handleAgreeDialogOk}>提交</Button>
          </FormItem>
          {
            user.id && !user.wechat
              ? this.renderWechat()
              : ''
          }
        </Form>
    )
  },
  renderWechat () {
    const self = this
    if (!self.state.wechat) {
      return null
    }
    return (
      <div style={{position: 'absolute', right: '10px', top: 0, bottom: 0, width: '140px', height: '30%', margin: 'auto'}}>
        <img src={ self.state.wechat ? self.state.wechat : null } width='140px' height='140px'/><br/>
        关注并绑定微信号马上随机赠送推广红包
      </div>
    )
  }
})

PhoneView = Form.create()(PhoneView)

export default PhoneView
