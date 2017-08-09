/**
 * Created by CY on 2016/7/21.
 */
import React, { Component, PropTypes } from 'react'
import Modal from 'antd/lib/modal'
import Tooltip from 'antd/lib/tooltip'
import Icon from 'antd/lib/icon'

const createImageUrl = (file) => {
  if (window.URL) {
    return window.URL.createObjectURL(file)
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(file)
  } else {
    return null
  }
}

class EditItemModalView extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    data: PropTypes.object.isRequired,
    modItem: PropTypes.func,
    toggle: PropTypes.func
  };
  constructor () {
    super()
    this.state = {
      imgUrl: null,
      imgError: null
    }
  }
  handleDialogCancel () {
    this.props.toggle()
  }
  handleDialogOk () {
    const self = this
    let obj = {}
    obj.price = this.refs.price.value
    obj.title = this.refs.title.value
    obj.cid = this.refs.cid.value
    obj.id = this.refs.itemId.value
    obj.file = this.refs.imgfile.files[0]
    this.props.modItem(obj).then(() => {
      self.props.toggle()
    })
  }
  checkImgHandler () {
    var file = this.refs.imgfile.files[0]
    const isJPG = file.type === 'image/jpeg'
    if (file === null || file === undefined) {
      return false
    }
    if (file.type.indexOf('image') === -1) {
      return false
    }
    if (!isJPG) {
      return false
    }
    var size = Math.floor(file.size / 1024)
    if (size > 1024) {
      return false
    }
    this.checkImageSize(file)
  }
  checkImageSize (file) {
    const self = this
    var image = new Image()
    var width
    var height
    var size = 300
    var url = createImageUrl(file)
    image.onload = function () {
      width = this.width
      height = this.height
      var err = false
      if (width !== height) {
        err = true
      }
      if (width < size || height < size) {
        err = true
      }
      err ? self.setState({imgError: true}) : self.setState({imgError: false, imgUrl: url})
    }
    image.src = url
  }
  rendPrevImg (pic_url) {
    const self = this
    return (
      <img src={pic_url || self.state.imgUrl} style={{width: '100%', height: '100%'}}/>
    )
  }
  render () {
    const self = this
    const item = self.props.data
    return (
      <Modal title='优化创意' visible={this.props.visible}
             onOk={self.handleDialogOk.bind(self)} onCancel={self.handleDialogCancel.bind(self)}>
        <form>
          <div className='ant-form-item clearfix'>
            <label className='col-6'>标题 &nbsp;
              <Tooltip placement='topLeft' title={'宝贝标题对多30个字'}>
                <Icon type='question-circle-o' style={{verticalAlign: 'text-top'}} />
              </Tooltip>
            </label>
            <div className='col-18'>
              <div className='ant-form-item-control '>
                <span className='ant-input-wrapper'>
                  <input type='text' ref='title' defaultValue={item.title} placeholder='标题' className='ant-input ant-input-lg' />
                </span>
                <div className=''></div>
              </div>
            </div>
          </div>
          <div className='ant-form-item clearfix'>
            <label className='col-6'>折后价&nbsp;
              <Tooltip placement='topLeft' title={'打折价格不得高于原价'}>
                <Icon type='question-circle-o' style={{verticalAlign: 'text-top'}} />
              </Tooltip>
            </label>
            <div className='col-10'>
              <div className='ant-form-item-control '>
                <span className='ant-input-wrapper'>
                  <input type='text' ref='price' defaultValue={item.price} name='price' placeholder={ '原价' + item.price } data-y={item.price} className='ant-input ant-input-lg' />
                  <input type='hidden' name='item_id' ref='cid' defaultValue={item.cid}/>
                  <input type='hidden' name='item_id' ref='itemId' defaultValue={item.id}/>
                </span>
                <div className=''></div>
              </div>
            </div>
          </div>
          <div className='ant-form-item clearfix' style={{marginBottom: '5px'}}>
            <div className='col-12 col-offset-7'>
              <div style={{width: '60px', height: '60px', border: 'solid 1px #ddd'}}>
                {this.rendPrevImg(this.state.imgUrl || item.pic_url)}
              </div>
            </div>
          </div>
          <div className='ant-form-item clearfix'>
            <label className='col-6'>推广图&nbsp;
              <Tooltip placement='topLeft' title={'图片尺寸必须为正方形，最低300*300像素，文件大小不得大于1兆'}>
                <Icon type='question-circle-o' style={{verticalAlign: 'text-top'}} />
              </Tooltip>
            </label>
            <div className='col-14'>
              <div className='ant-form-item-control '>
                <span className='ant-input-wrapper'>
                  <input type='file' name='price' ref='imgfile' className='ant-input ant-input-lg' onChange={self.checkImgHandler.bind(self)}/>
                </span>
                <div className=''></div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    )
  }
}

export default EditItemModalView
