import React, { PropTypes } from 'react'
import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import {Registerinfo} from '../../help/url'
import axios from 'axios'
import Button from 'antd/lib/button'
import message from 'antd/lib/message'
const FormItem = Form.Item
class RegisterView extends React.Component {
  handleSubmit (e) {
    e.preventDefault()
    var _this = this
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      axios.post(Registerinfo, {
        shop_id: values.shop_id,
        shop_link: values.shop_link,
        mobile: values.mobile,
        telephone: values.telephone
      }).then(function (params) {
        if (params.data.msg) {
          message.info(params.data.msg)
        } else {
          _this.props.onCancel()
          message.success('注册成功！')
        }
      }
     )
    })
  }
  render () {
    const { getFieldProps } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const shopIDprops = getFieldProps('shop_id', {
      rules: [
        {
          required: true, message: '请填写店铺ID'
        }
      ]
    })
    const shopLinkprops = getFieldProps('shop_link', {
      rules: [
        {
          required: true, message: '请填写店铺链接'
        }
      ]
    })
    const mobileprops = getFieldProps('mobile', {
      rules: [
        {
          required: true, message: '请填写手机号'
        }
      ]
    })
    const telprops = getFieldProps('telephone', {
      rules: [
        {
          required: false, message: '请填写座机'
        }
      ]
    })
    return (
      <Modal title = {this.props.title}
             visible = {this.props.visible}
             onOk = {this.props.onOk}
             onCancel = {this.props.onCancel}
             ref = 'modal'
             footer={null} style={{textAlign: 'center'}}>
            <Form horizontal form={this.props.form}>
              <FormItem label='店铺ID' {...formItemLayout}>
                 <Input type='text' placeholder='店铺ID' {...shopIDprops}/>
              </FormItem>
              <FormItem label='店铺链接' {...formItemLayout}>
                 <Input type='text' placeholder='店铺链接' {...shopLinkprops}/>
              </FormItem>
              <FormItem label='手机号' {...formItemLayout}>
                 <Input type='text' placeholder='手机号' {...mobileprops}/>
              </FormItem>
              <FormItem label='座机' {...formItemLayout}>
                 <Input type='text' placeholder='座机' {...telprops}/>
              </FormItem>
              <FormItem wrapperCol={{ span: 8, offset: 8 }} style={{ marginTop: 24 }}>
               <Button type='primary' onClick={this.handleSubmit.bind(this)}>确定</Button>
             </FormItem>
            </Form>
      </Modal>
    )
  }
}
RegisterView.propTypes = {
  form: PropTypes.object,
  title: PropTypes.string,
  visible: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}
const y = Form.create({})(RegisterView)
export default y
