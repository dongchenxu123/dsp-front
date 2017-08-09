/**
 * Created by CY on 2016/3/11.
 */
import React, {PropTypes} from 'react'
//import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'

const createForm = Form.create
const FormItem = Form.Item

function noop () {
  return false
}

let SetPassWordView = React.createClass({
  propTypes: {
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    sendValue: PropTypes.func.isRequired,
    showPwdModal: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
  },
  getInitialState () {
    return {
      passBarShow: false,
      rePassBarShow: false,
      passStrength: 'L',
      rePassStrength: 'L'
    }
  },

  handleSubmit () {
    const self = this
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!')
        return
      }
      this.props.sendValue(values)
      .then((data) => {
        self.props.onCancel()
        self.setState({
          passBarShow: false,
          rePassBarShow: false,
          passStrength: 'L',
          rePassStrength: 'L'
        })
        self.props.form.resetFields()
      })
    })
  },

  getPassStrenth (value, type) {
    if (value) {
      let strength
      if (value.length < 6) {
        strength = 'L'
      } else if (value.length <= 9) {
        strength = 'M'
      } else {
        strength = 'H'
      }
      if (type === 'password') {
        this.setState({ passBarShow: true, passStrength: strength })
      } else {
        this.setState({ rePassBarShow: true, rePassStrength: strength })
      }
    } else {
      if (type === 'password') {
        this.setState({ passBarShow: false })
      } else {
        this.setState({ rePassBarShow: false })
      }
    }
  },

  checkPass (rule, value, callback) {
    const form = this.props.form
    this.getPassStrenth(value, 'password')

    if (form.getFieldValue('password')) {
      form.validateFields(['rePass'], { force: true })
    }

    callback()
  },

  checkPass2 (rule, value, callback) {
    const form = this.props.form
    this.getPassStrenth(value, 'rePass')

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致！')
    } else {
      callback()
    }
  },

  renderPassStrengthBar (type) {
    const strength = type === 'password' ? this.state.passStrength : this.state.rePassStrength
    let classSet = () => {
      let str = 'low'
      if (strength === 'L') {
        str = 'low'
      } else if (strength === 'M') {
        str = 'medium'
      } else if (strength === 'H') {
        str = 'high'
      }
      return ('ant-pwd-strength ant-pwd-strength-' + str)
    }
    const level = {
      L: '低',
      M: '中',
      H: '高'
    }

    return (
      <div>
        <ul className={classSet()}>
          <li className='ant-pwd-strength-item ant-pwd-strength-item-1'></li>
          <li className='ant-pwd-strength-item ant-pwd-strength-item-2'></li>
          <li className='ant-pwd-strength-item ant-pwd-strength-item-3'></li>
          <span className='ant-form-text'>
            {level[strength]}
          </span>
        </ul>
      </div>
    )
  },

  render () {
    const { getFieldProps } = this.props.form
    const passProps = getFieldProps('password', {
      rules: [
        { required: true, whitespace: true, message: '请填写密码' },
        { validator: this.checkPass }
      ]
    })
    const rePassProps = getFieldProps('rePass', {
      rules: [{
        required: true,
        whitespace: true,
        message: '请再次输入密码'
      }, {
        validator: this.checkPass2
      }]
    })
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    return (
      <Modal title='设置登录密码'
             visible={this.props.showPwdModal}
             maskClosable={false}
             onCancel={this.props.onCancel}
             footer={[
               <Button key='back' type='ghost' size='large' onClick={this.props.onCancel}>返 回</Button>,
               <Button key='submit' type='primary' size='large' loading={this.props.loading} onClick={this.handleSubmit}>
                 提 交
               </Button>
             ]}
      >
        <div>
            <Form horizontal form={this.props.form}>
              <Row>
                <Col span='18'>
                  <FormItem
                    {...formItemLayout}
                    label='密码：'>
                    <Input {...passProps} type='password'
                                          onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                          autoComplete='off' id='pass' />
                  </FormItem>
                </Col>
                <Col span='6'>
                  {this.state.passBarShow ? this.renderPassStrengthBar('pass') : null}
                </Col>
              </Row>

              <Row>
                <Col span='18'>
                  <FormItem
                    {...formItemLayout}
                    label='确认密码：'>
                    <Input {...rePassProps} type='password'
                                            onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                            autoComplete='off' id='rePass' />
                  </FormItem>
                </Col>
                <Col span='6'>
                  {this.state.rePassBarShow ? this.renderPassStrengthBar('rePass') : null}
                </Col>
              </Row>
            </Form>
        </div>
      </Modal>
    )
  }
})

SetPassWordView = createForm()(SetPassWordView)

export default SetPassWordView
