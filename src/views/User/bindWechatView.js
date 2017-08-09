/**
 * Created by CY on 2016/3/10.
 */
import React, { PropTypes } from 'react'

import Modal from 'antd/lib/modal'

class BindWechatView extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    wechatPic: PropTypes.string.isRequired,
    showWechat: PropTypes.bool.isRequired
  };
  constructor () {
    super()
    this.state = {
      wechat: false
    }
  }
  componentDidMount () {
  }
  render () {
    return (
      <Modal title='绑定微信'
             visible={this.props.showWechat}
             maskClosable={false}
             onOk={this.handleOk}
             onCancel={this.props.onCancel}>
        <div className='text-center'>
          <img src={this.props.wechatPic} />
          <div>关注并绑定微信号马上随机赠送推广红包</div>
        </div>
        </Modal>
    )
  }
}
export default BindWechatView
