/**
 * Created by CY on 2016/8/17.
 */
import React, { Component, PropTypes } from 'react'
//import { connect } from 'react-redux'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import XbsReachargeContentView from '../views/recharge/xbsRechargeContentView'
//import {actions as loginactions} from '../redux/user/userAction'


class UserRechargeView extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    showXbsRecharge: PropTypes.bool.isRequired
  };
  handleCancel () {
    this.props.onCancel()
  }
  render () {
    return (
      <Modal
        width={800}
        title='充值 (支持方式：支付宝、银联、微信)'
        visible={this.props.showXbsRecharge}
        onCancel={this.handleCancel.bind(this)}
        footer={[
          <Button key='back' type='ghost' size='large' onClick={this.handleCancel.bind(this)}>关 闭</Button>
        ]}
      >
        <XbsReachargeContentView />
      </Modal>
    )
  }
}


export default UserRechargeView
