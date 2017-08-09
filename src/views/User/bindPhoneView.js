/**
 * Created by CY on 2016/3/10.
 */
import React, { PropTypes } from 'react'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'

const FormItem = Form.Item
const InputGroup = Input.Group
let Timer = null
let BindPhoneView = React.createClass({
  propTypes: {
    form: PropTypes.object.isRequired,
    getSMSCode: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    sendPhone: PropTypes.func.isRequired,
    showPhone: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
  },
  getInitialState () {
    return {
      cmsloading: false,
      telephoneError: 'no',
      btnNumber: 60
    }
  },
  componentWillUnmount () {
    if (Timer) {
      clearInterval(Timer)
    }
  },
  checkTelphone (rule, value, callback) {
    if (!value) {
      callback(new Error('请填写手机号'))
    } else {
      callback()
    }
    /*if (value) {
      validateFields(['code'])
    } else {
      callback()
    }*/
  },
  handleSubmit (e) {
    e.preventDefault()
    console.log('收到表单值：', this.props.form.getFieldsValue())
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
  handleGetSMSCode (e) {
    e.preventDefault()
    const self = this
    const values = this.props.form.getFieldsValue()
    if (!values.telephone) {
      Modal.error({
        title: '提示',
        content: '请填写电话号码'
      })
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
    this.props.getSMSCode(values.telephone)
    this.renderGetCodeBtnTxt()
  },
  handleOk () {
    const values = this.props.form.getFieldsValue()
    if (!values.telephone || !values.code) {
      Modal.error({
        title: '提示',
        content: '请填写电话号码和验证码'
      })
      return
    }
    this.props.sendPhone(values)
  },
  render () {
    const { getFieldProps } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const telphoneProps = getFieldProps('telephone', {
      rules: [{ validator: this.checkTelphone }]
    })
    return (
      <Modal title='绑定手机号'
             visible={this.props.showPhone}
             maskClosable={false}
             onOk={this.handleOk}
             confirmLoading={this.props.loading}
             onCancel={this.props.onCancel}>
        <Form horizontal form={this.props.form}>

          <FormItem
            {...formItemLayout}
            label='手机号：'
          >
            <InputGroup className='ant-search-input' >
              <Input {...telphoneProps} type='number' id='telephone' style={{borderBottomRightRadius: 0, borderTopRightRadius: 0}} placeholder='请输入手机号'/>
              <div className='ant-input-group-wrap'>
                <Button
                  type='primary'
                  loading={this.state.cmsloading}
                  style={{borderBottomLeftRadius: 0, borderTopLeftRadius: 0, height: '32px', zIndex: '99999', position: 'relative', left: 4, top: '-2px'}}
                  onClick={this.handleGetSMSCode}
                >{this.state.cmsloading ? <span>&nbsp; {this.state.btnNumber}</span> : '获取验证码'}</Button>
              </div>
            </InputGroup>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='验证码：'>
            <Input type='text' {...getFieldProps('code')} placeholder='请输入验证码' />
          </FormItem>
        </Form>
        </Modal>
    )
  }
})

BindPhoneView = Form.create()(BindPhoneView)

export default BindPhoneView
