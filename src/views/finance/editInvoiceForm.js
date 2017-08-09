/**
 * Created by CY on 2016/4/11.
 */
import React, {PropTypes} from 'react'

import Radio from 'antd/lib/radio'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Upload from 'antd/lib/upload'
import Form from 'antd/lib/form'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'

const createForm = Form.create
const FormItem = Form.Item
const RadioGroup = Radio.Group

let EditInvoiceFormView = React.createClass({
  propTypes: {
    data: PropTypes.object,
    editMode: PropTypes.bool,
    visible: PropTypes.bool,
    form: PropTypes.object.isRequired,
    adding: PropTypes.bool.isRequired,
    addInvoiceAct: PropTypes.func.isRequired,
    editInvoiceAct: PropTypes.func.isRequired,
    handleFormShow: PropTypes.func
  },
  getInitialState () {
    return {
      taxType: 0,
      open_license_picList: [],
      qualification_picList: [],
      tax_cert_picList: [],
      license_picList: []
    }
  },
  componentWillMount () {
    const editData = this.props.data
    if (this.props.editMode) {
      let openLicensePic = [{
        uid: -1,
        name: '开户许可证.jpg',
        status: 'done',
        url: editData.open_license_pic,
        thumbUrl: editData.open_license_pic
      }]
      let qualificationPic = [{
        uid: -1,
        name: '一般纳税人资格认证.jpg',
        status: 'done',
        url: editData.qualification_pic,
        thumbUrl: editData.qualification_pic
      }]
      if (editData.is_company === '1' && editData.is_three_certis === '0') {
        this.setState({
          open_license_picList: openLicensePic,
          qualification_picList: qualificationPic,
          tax_cert_picList: [{
            uid: -1,
            name: '税务登记证.jpg',
            status: 'done',
            url: editData.tax_cert_pic,
            thumbUrl: editData.tax_cert_pic
          }]
        })
      }
      if (editData.is_company === '1' && editData.is_three_certis === '1') {
        this.setState({
          open_license_picList: openLicensePic,
          qualification_picList: qualificationPic,
          license_picList: [{
            uid: -1,
            name: '营业执照.jpg',
            status: 'done',
            url: editData.license_pic,
            thumbUrl: editData.license_pic
          }]
        })
      }
    }
  },
  handleReset (e) {
    e.preventDefault()
    this.props.form.resetFields()
  },
  handleFormCancel () {
    this.props.handleFormShow()
  },
  handleFormSubmit () {
    const state = this.state
    this.props.form.validateFieldsAndScroll((errors, values) => {
      /*eslint-disable no-extra-boolean-cast */
      if (!!errors) {
        console.log('Errors in form!!!')
        return
      }
      if (values.is_company) {
        values.open_license_pic = state.open_license_picList[0].url
        values.qualification_pic = state.qualification_picList[0].url
        if (!values.open_license_pic) {
          message.error('请上传开户许可证')
          return
        }
        if (!values.qualification_pic) {
          message.error('一般纳税人资格认证扫描件不能为空')
          return
        }
        if (values.is_three_certis === '0') {
          if (state.tax_cert_picList.length === 0) {
            message.error('请上传税务登记证扫描件')
            return
          }
          values.tax_cert_pic = state.tax_cert_picList[0].url
        }
        if (values.is_three_certis === '1') {
          if (state.license_picList.length === 0) {
            message.error('请上传营业执照扫描件')
            return
          }
          values.license_pic = state.license_picList[0].url
        }
      }
      if (this.props.editMode) {
        values.id = this.props.data.id
        this.props.editInvoiceAct(values).then((data) => {
          if (data.msg) {
            Modal.error({
              title: '提示',
              content: data.msg
            })
            return
          }
          this.props.form.resetFields()
          this.props.handleFormShow()
        }).catch()
        return
      }
      this.props.addInvoiceAct(values).then((data) => {
        if (data.msg) {
          Modal.error({
            title: '错误',
            content: data.msg
          })
          return
        }
        this.props.form.resetFields()
        this.props.handleFormShow()
      }).catch()
    })
  },
  handleUploadImg (info, type) {
    let fileList = info.fileList
    fileList = fileList.slice(-1)
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.res
      }
      return file
    })
    this.setState({
      [type + 'List']: fileList
    })
  },
  render () {
    const editItem = this.props.data
    const {getFieldProps} = this.props.form
    const isCompanyProps = getFieldProps('is_company', {
      rules: [
        { required: true, message: '请选择用途' }
      ],
      initialValue: this.props.editMode ? parseInt(editItem.is_company, 10) : 0
    })
    const taxType = this.props.form.getFieldProps('is_company').value
    const titleProps = getFieldProps('title', {
      rules: [
        { required: true, min: 2, message: '请填写发票抬头' }
      ],
      initialValue: this.props.editMode ? editItem.title : null
    })

    const isThreeCertis = getFieldProps('is_three_certis', {
      rules: [
        { required: taxType !== 0, message: '请选择是否三证合一' }
      ],
      initialValue: this.props.editMode ? editItem.is_three_certis : '0'
    })
    const registerNumProps = getFieldProps('register_number', {
      rules: [
        { required: taxType !== 0, min: 3, message: '统一社会信用代码/税务登记号' }
      ],
      initialValue: this.props.editMode ? editItem.register_number : null
    })
    const bankProps = getFieldProps('bank', {
      rules: [
        { required: taxType !== 0, min: 3, message: '请填写开户银行' }
      ],
      initialValue: this.props.editMode ? editItem.bank : null
    })
    const bankAccountProps = getFieldProps('bank_account', {
      rules: [
        { required: taxType !== 0, min: 3, message: '请填写开户银行账号' }
      ],
      initialValue: this.props.editMode ? editItem.bank_account : null
    })
    const phoneProps = getFieldProps('phone', {
      rules: [
        { required: taxType !== 0, min: 6, message: '请填写营业电话' },
        { validator: this.userExists }
      ],
      initialValue: this.props.editMode ? editItem.phone : null
    })
    const addressProps = getFieldProps('address', {
      rules: [{ required: taxType !== 0, message: '请填写详细营业地址' }],
      initialValue: this.props.editMode ? editItem.address : null
    })
    const upLoadProps = {
      name: 'file',
      action: '/taxpayers?do=upload-pic',
      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          message.error('只能上传 JPG 文件哦！')
          return false
        }
      }
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 }
    }
    const qualificationUpload = Object.assign({}, upLoadProps, {fileList: this.state.qualification_picList})
    const openLicenseUpload = Object.assign({}, upLoadProps, {fileList: this.state.open_license_picList})
    return (
      <Modal
        title={this.props.editMode ? '编辑发票信息' : '添加发票信息'}
        visible={this.props.visible}
        width={650}
        onOk={this.handleFormSubmit}
        onCancel={this.handleFormCancel}
        confirmLoading={this.props.adding}
      >
            <div>添加开票信息</div>
            <Form horizontal form={this.props.form}>
              <FormItem
                {...formItemLayout}
                label='用途：'>
                <RadioGroup {...isCompanyProps}>
                  <Radio value={0}>普通发票</Radio>
                  <Radio value={1}>增值税发票</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label='发票抬头：'
                hasFeedback>
                <Input {...titleProps} placeholder='发票抬头' />
              </FormItem>
              {
                taxType === 0
                  ? null
                  : <div>
                  <FormItem
                    {...formItemLayout}
                    label='是否三证合一：'
                    >
                    <RadioGroup {...isThreeCertis}>
                      <Radio value={'0'}>否</Radio>
                      <Radio value={'1'}>是</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label='统一社会信用代码/税务登记号：'
                    hasFeedback>
                    <Input {...registerNumProps} placeholder='统一社会信用代码/税务登记号' />
                  </FormItem>
                  <FormItem
                    label='开户许可证：'
                    {...formItemLayout}
                    help=''>
                    <Upload listType='picture'
                      {...openLicenseUpload}
                      {...getFieldProps('open_license_pic', {
                        valuePropName: 'open_license_pic',
                        normalize: this.normFile,
                        onChange: (info) => {
                          this.handleUploadImg(info, 'open_license_pic')
                        }
                      })}
                    >
                      <Button type='ghost'>
                        <Icon type='upload' /> 点击上传
                      </Button>
                    </Upload>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                      label='开户银行：'
                      hasFeedback>
                  <Input {...bankProps} placeholder='开户银行' />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                      label='开户银行账号：'
                      hasFeedback>
                  <Input {...bankAccountProps} placeholder='开户银行账号' />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                      label='营业电话：'
                      hasFeedback>
                  <Input {...phoneProps} placeholder='营业电话' />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label='营业地址：'
                    hasFeedback>
                  <Input {...addressProps} type='textarea' placeholder='营业地址' autosize={{ minRows: 1, maxRows: 3 }} />
                  </FormItem>
                  { this.renderOption() }
                  <FormItem
                    {...formItemLayout}
                      label='一般纳税人资格认证扫描件：'
                      hasFeedback>
                      <Upload listType='picture'
                        {...qualificationUpload}
                        {...getFieldProps('qualification_pic', {
                          valuePropName: 'qualification_pic',
                          normalize: this.normFile,
                          onChange: (info) => { this.handleUploadImg(info, 'qualification_pic') }
                        })}
                      >
                        <Button type='ghost'>
                        <Icon type='upload' /> 点击上传
                        </Button>
                      </Upload>
                  </FormItem>
                </div>
              }
            </Form>
      </Modal>
    )
  },
  renderOption () {
    const self = this
    const {getFieldProps} = this.props.form
    const formItemLayout = {labelCol: { span: 6 }, wrapperCol: { span: 12 }}
    const isThreeCertis = parseInt(this.props.form.getFieldProps('is_three_certis').value, 10)
    const upLoadProps = {
      name: 'file',
      action: '/taxpayers?do=upload-pic',
      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          message.error('只能上传 JPG 文件哦！')
          return false
        }
      },
      onChange: this.handleUploadImg
    }
    if (isThreeCertis === 0) {
      let taxLicenseUpload = Object.assign({}, upLoadProps, {fileList: this.state.tax_cert_picList})
      return (
        <FormItem
          label='税务登记证扫描件：'
          {...formItemLayout}
          help='请上传加盖国家税务局章的税务登记扫描件'>
          <Upload name='logo' listType='picture'
                  onChange={this.handleUpload}
            {...taxLicenseUpload}
            {...getFieldProps('tax_cert_pic', {
              valuePropName: 'tax_cert_pic',
              normalize: this.normFile,
              onChange: (info) => { self.handleUploadImg(info, 'tax_cert_pic') }
            })}
          >
            <Button type='ghost'>
              <Icon type='upload' /> 点击上传
            </Button>
          </Upload>
        </FormItem>
      )
    }
    const LicenseUpload = Object.assign({}, upLoadProps, {fileList: this.state.license_picList})
    return (
      <span>
        <FormItem
          label='营业执照：'
          {...formItemLayout}
          help=''>
          <Upload name='logo' listType='picture'
                  onChange={this.handleUpload}
            {...LicenseUpload}
            {...getFieldProps('license_pic', {
              valuePropName: 'license_pic',
              normalize: this.normFile,
              onChange: (info) => { self.handleUploadImg(info, 'license_pic') }
            })}
          >
            <Button type='ghost'>
              <Icon type='upload' /> 点击上传
            </Button>
          </Upload>
        </FormItem>
      </span>
    )
  }
})

EditInvoiceFormView = createForm()(EditInvoiceFormView)
export default EditInvoiceFormView
