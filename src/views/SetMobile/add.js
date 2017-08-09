/**
 * Created by CY on 2016/2/3.
 */
import React from 'react'

import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import Cascader from 'antd/lib/cascader'

const createForm = Form.create
const FormItem = Form.Item
const createImageUrl = (file) => {
  if (window.URL) {
    return window.URL.createObjectURL(file)
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(file)
  } else {
    return null
  }
}


class AddItemView extends React.Component {
  static propTypes = {
    option: React.PropTypes.object,
    trans: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.object
    ]),
    form: React.PropTypes.object
  };
  constructor () {
    super()
    this.state = {
      imgError: false,
      file: false,
      editTrans: false
    }
  }
/*componentWillMount () {
    console.log(this.props.trans)
    if (this.props.trans) {
      this.setState({
        editTrans: this.props.trans
      })
    }
  }*/
  componentDidMount () {
    const transCats = this.props.option.transCats
    if (transCats.data.length === 0) {
      this.props.option.getTransCats()
    }
  }
  handleReset (e) {
    e.preventDefault()
    this.props.option.hideAdd()
  }
  handleSubmit (e) {
    e.preventDefault()
    const self = this
    this.props.form.validateFields((errors, values) => {
      const file = self.state.file

      if (self.props.trans) {
        values.pid = self.props.trans.pid
        values.file = file
        self.props.option.editTrans(values)
        return null
      }
      /*eslint-disable no-extra-boolean-cast */
      if (!file || self.state.imgError) {
        return null
      }
      if (!!errors) {
        console.log('Errors in form!!!')
        return null
      }
      values.file = file
      values.cid = values.cid[values.cid.length - 1]
      values.creative_type = 0//self.props.option.creativeType
      this.props.option.addTrans(values)
    })
    //this.props.option.addTrans(values)
  }
  handleSelect (value) {
    this.setState({
      cid: value
    })
  }
  checkImgHandler () {
    var file = this.refs.imgfile.files[0]
    if (file === null || file === undefined) {
      return false
    }
    if (file.type.indexOf('image') === -1) {
      return false
    }
    var size = Math.floor(file.size / 1024)
    if (size > 5000) {
      return false
    }
    //console.log(file.naturalWidth, file.naturalHeight)
    this.setState({
      file: file
    })
    this.checkImageSize(file)
  }
  checkImageSize (file) {
    const self = this
    var image = new Image()
    var width
    var height
    var sizeArr = self.props.option.transSize
    image.onload = function () {
      width = this.width
      height = this.height
      var sizeStr = width + 'x' + height
      //var err = false
      var index = sizeArr.indexOf(sizeStr)
      if (index < 0) {
        self.setState({imgError: '请上传正确尺寸的图片'})
      } else {
        self.setState({imgError: false})
      }
    }
    image.src = createImageUrl(file)
  }
  onCascaderChange (value, selectedOptions) {
    console.log(value, selectedOptions)
    this.setState({
      inputValue: selectedOptions
    })
  }
  loadCatsData (selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    const totalData = this.props.option.transCats.data
    let index = 0
    for (var i = 0; i < totalData.length; i++) {
      if (totalData[i].value === targetOption.value) {
        index = i
        break
      }
    }
    if (totalData[index].children && totalData[index].children.length > 0) {
      return
    }
    this.props.option.getTransCats(targetOption.value)
  }
  handleLogoUpload (file, loader) {
    //const self = this
    this.checkImageSize(file)
    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = function () {
      this.setState({
        file: file
      })
    }.bind(this)
    return false
  }
  handleUploadImg (info) {
    let currentFile = info.file
    if (currentFile.status === 'done' || currentFile.status === 'remove') {
      if (!currentFile.response) {
        return false
      }
      if (currentFile.response.msg) {
        //message.error(currentFile.response.msg)
        info.fileList.splice(-1, 1)
      }
      currentFile.url = currentFile.response.res
      this.setState({
        filelist: info.fileList
      })
    }
  }
  rendPrevImg () {
    const self = this
    let renderImg = function () {
      if (self.state.file) {
        return <img ref='previmg' src={createImageUrl(self.state.file)} style={{maxHeight: '100%', maxWidth: '100%', border: 'solid 1px #ddd', 'bottom': 0}}/>
      }
      if (self.props.trans) {
        return <img src={self.props.trans.creatives[0].pic} style={{maxHeight: '100%', maxWidth: '100%', border: 'solid 1px #ddd', 'bottom': 0}}/>
      }
      return null
    }
    //this.state.file || this.props.trans ?
    return (
        <div className='clearfix' style={{height: '90px', padding: '8px 0', marginTop: '5px', overflow: 'hidden', border: 'solid 1px #ddd'}}>
          { renderImg() }
        </div>
    )
  }
  getValidateStatus (field) {
    const { isFieldValidating, getFieldError, getFieldValue } = this.props.form

    if (isFieldValidating(field)) {
      return 'validating'
      /*eslint-disable no-extra-boolean-cast */
    } else if (!!getFieldError(field)) {
      return 'error'
    } else if (getFieldValue(field)) {
      return 'success'
    }
  }
  render () {
    const self = this
    const { getFieldProps } = this.props.form
    const cidOption = {
      rules: [
        { required: true, message: '请选择类目', type: 'array' }
      ]
    }
    const titleOption = {
      rules: [
        { required: true, min: 3, message: '推广至少为 3 个字符' }
      ],
      trigger: ['onBlur', 'onChange']
    }
    const urlOption = {
      validate: [{
        rules: [
          { required: true, message: '推广链接地址为必填项' }
        ],
        trigger: ['onBlur', 'onChange']
      }]
    }
    //initialValue: self.state.editTrans && self.state.editTrans.title,
    const cidProps = getFieldProps('cid', self.props.trans ? Object.assign({}, cidOption, {initialValue: [self.props.trans.parent_id, self.props.trans.cid]}) : cidOption)
    const titleProps = getFieldProps('title', self.props.trans ? Object.assign({}, titleOption, {initialValue: self.props.trans.title}) : titleOption)
    const urlProps = getFieldProps('url', self.props.trans ? Object.assign({}, urlOption, {initialValue: self.props.trans.url}) : urlOption)
    const picProps = getFieldProps('file', {
      onChange: this.handleUploadImg.bind(this),
      valuePropName: 'fileList',
      action: '/trans?do=upload-pic',
      normalize: this.normFile
    })
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 }
    }
    return (
      <Form horizontal form={this.props.form}>
        <FormItem
          {...formItemLayout}
          label='推广类目：'>
          <Cascader style={{width: '80%'}} {...cidProps} loadData={this.loadCatsData.bind(this)} options={this.props.option.transCats.data} placeholder='推广类目' />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='推广标题：'
          hasFeedback>
          <Input {...titleProps} placeholder='推广标题' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='推广地址：'
          hasFeedback>
          <Input {...urlProps} type='text' placeholder='推广链接' />
        </FormItem>
        <FormItem
          label='素材图：'
          {...formItemLayout}
          validateStatus={this.state.imgError ? 'error' : 'success'}
          help={this.state.imgError}>
          <Upload name='logo'
                  accept='image/gif, image/jpeg, image/png'
                  beforeUpload={this.handleLogoUpload.bind(this)}
                  defaultFileList={this.state.fileList}
                  listType='picture'
            {...picProps}
          >
            <Button type='ghost'>
              <Icon type='upload' /> 点击上传
            </Button>
          </Upload>
          {
            this.state.file || this.props.trans ? this.rendPrevImg() : null
          }
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <div className='clearfix' style={{padding: '8px 0', overflow: 'hidden'}}>
            支持的尺寸: {this.props.option.transSize.join(', ')}
          </div>
        </FormItem>
        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <Button type='primary' loading={this.props.trans ? this.props.option.editFetching : this.props.option.addFetching} onClick={this.handleSubmit.bind(this)}>确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type='ghost' onClick={this.handleReset.bind(this)}>关闭</Button>
        </FormItem>
      </Form>
    )
  }
}
//export default Form.create({})(AddItemView)
let AddItemViewPack = createForm()(AddItemView)
export default AddItemViewPack
