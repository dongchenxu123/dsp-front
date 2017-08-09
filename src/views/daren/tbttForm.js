/**
 * Created by CY on 2016/6/28.
 */
import React, { PropTypes } from 'react'

import {FormateNum} from 'help/formate'

import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Upload from 'antd/lib/upload'
import DatePicker from 'antd/lib/date-picker'
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'

import { NoBalanceCode } from 'help/ajaxErrorCode'
import RechargeView from 'components/rechargeDialog'

const FormItem = Form.Item

class BuyItem extends React.Component {
  static propTypes = {
    data: PropTypes.object
  };
  render () {
    const data = this.props.data
    return (
      <div style={{display: 'inline-block', margin: '0 8px'}}>
        <div className='media'>
          <div className='media-left '>
            <img className='media-object img-circle' src={data.portrait} width='60px' height='60px'/>
          </div>
          <div className='media-body' style={{padding: '10px 0 0 10px'}}>
            <h4 className='media-heading'>{data.nick}</h4>
            <div>
                发布价： ¥{FormateNum(data.price)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ToutiaoForm extends React.Component {
  constructor () {
    super()
    this.state = {
      uploading: false,
      showRechargeModal: false,
      pic1List: [],
      pic2List: []
    }
  }
  handleSubmit () {
    const self = this
    const select = this.props.select
    const selectId = select.map((item) => item.id)
    this.props.form.validateFields((errors, values) => {
      /*eslint-disable no-extra-boolean-cast */
      if (!!errors) {
        console.log('Errors in form!!!')
        return
      }
      const sendObj = {
        title: values.title,
        m_type: 1,
        start_date: values.start_date.getFullYear() + '-' + (values.start_date.getMonth() + 1) + '-' + (values.start_date.getDate()),
        end_date: values.end_date.getFullYear() + '-' + (values.end_date.getMonth() + 1) + '-' + (values.end_date.getDate()),
        mid: selectId.join(','),
        content: [
          {'pic': self.state.pic1List[0].url, 'link': values.link1},
          {'pic': self.state.pic2List[0].url, 'link': values.link2}
        ]
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
  handleUploadImg (info, type) {
    let fileList = info.fileList
    fileList = fileList.slice(-1)
    fileList = fileList.map((file) => {
      if (file.response) {
        //组件会将 file.url 作为链接进行展示
        file.url = file.response.res
      }
      return file
    })
    this.setState({
      [type + 'List']: fileList
    })
  }
  render () {
    const self = this
    const { getFieldProps } = this.props.form
    const titleProps = getFieldProps('title', {
      rules: [
        {
          required: true, min: 2, max: 14, message: '活动名称为 2到14 个字符'
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
    const linkProps = getFieldProps('link1', {
      rules: [
        {
          required: true, min: 2, message: '请添加推广宝贝链接'
        }
      ]
    })
    const linkProps2 = getFieldProps('link2', {
      rules: [
        {
          required: true, min: 2, message: '请添加推广宝贝链接'
        }
      ]
    })
    const upload = {
      name: 'file',
      accept: 'image/gif, image/jpeg, image/png',
      action: '/fans?do=upload'
    }
    const picProps = {
      rules: [
        {
          required: true, type: 'object', message: '请上传宝贝图片'
        }
      ]
    }
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 }
    }
    const pic1Upload = Object.assign({}, upload, {fileList: self.state.pic1List})
    const pic2Upload = Object.assign({}, upload, {fileList: self.state.pic2List})
    const pic1Props = Object.assign({}, picProps, {
      valuePropName: 'pic1',
      normalize: this.normFile,
      onChange: (info) => { this.handleUploadImg(info, 'pic1') }
    })
    const pic2Props = Object.assign({}, picProps, {
      valuePropName: 'pic2',
      normalize: this.normFile,
      onChange: (info) => { this.handleUploadImg(info, 'pic2') }
    })
    return (
      <Modal
        width={700}
        title='创建头条达人推广活动'
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
        <Form horizontal form={this.props.form}>
          <FormItem
            label='发布平台'
            {...formItemLayout}
          >
            <p className='ant-form-text' id='static' name='static'>淘宝头条</p>
          </FormItem>
          <FormItem
            label='活动名称'
            {...formItemLayout}
          >
            <Input defaultValue='' {...titleProps} placeholder='方便活动管理，请勿超过14个字' />
          </FormItem>

          <FormItem
            label='上传素材'
            {...formItemLayout}
          >
            <div style={{float: 'left'}}>
              <FormItem>
                <Upload listType='picture' {...pic1Upload}
                  {...getFieldProps('pic1', pic1Props)}
                  >
                  <Button type='ghost'>
                    <Icon type='upload' /> 上传推广宝贝图片
                  </Button>
                </Upload>
              </FormItem>
            </div>
            <div style={{float: 'left'}}>&nbsp;-&nbsp;</div>
            <div style={{float: 'left', width: '40%'}}>
              <FormItem>
                <Input {...linkProps} placeholder='推广宝贝链接' />
              </FormItem>
            </div>
          </FormItem>

          <FormItem wrapperCol={{ span: 16, offset: 4 }}>
            <div style={{float: 'left'}}>
              <FormItem>
              <Upload
                listType='picture'
                accept='image/gif, image/jpeg, image/png'
                {...pic2Upload}
                {...getFieldProps('pic2', pic2Props)}
              >
                <Button type='ghost'>
                  <Icon type='upload' /> 上传推广宝贝图片
                </Button>
              </Upload>
                </FormItem>
            </div>
            <div style={{float: 'left'}}>&nbsp;-&nbsp;</div>
            <div style={{float: 'left', width: '40%'}}>
              <FormItem>
                <Input {...linkProps2} placeholder='推广宝贝链接' />
              </FormItem>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='计划发布日期'
          >
            <div style={{float: 'left'}}>
              <FormItem><DatePicker {...startDateProps} style={{width: '150px'}} format='yyyy-MM-dd' /></FormItem>
            </div>
            <div style={{float: 'left'}}>&nbsp;-&nbsp;</div>
            <div style={{float: 'left'}}>
              <FormItem><DatePicker {...endDateProps} style={{width: '150px'}}/></FormItem>
            </div>
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
      total = total + price
    }
    return FormateNum(total)
  }
  renderListItem () {
    const select = this.props.select
    return select.map((item) => <BuyItem key={'list' + item.id} data={item}/>)
  }
}
ToutiaoForm.propTypes = {
  form: PropTypes.object,
  visible: PropTypes.bool,
  select: PropTypes.array,
  onClose: PropTypes.func
}
const x = Form.create({})(ToutiaoForm)
export default x
