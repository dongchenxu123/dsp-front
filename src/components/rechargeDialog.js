/**
 * Created by CY on 2016/8/17.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Alert from 'antd/lib/alert'
import ReachargeContentView from '../views/recharge/rechargeContentView'
import {actions as loginactions} from '../redux/user/userAction'

const mapStateToProps = (state) => ({
  auth: state.auth
})

class UserRechargeView extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    loginAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  constructor () {
    super()
    this.state = {
      visible: true
    }
  }
  handleCancel () {
    this.props.toggle()
  }
  render () {
    var auth = this.props.auth
    return (
      <Modal
        width={800}
        title='您的余额不足，请充值'
        visible={this.props.visible}
        onCancel={this.handleCancel.bind(this)}
        footer={[
          <Button key='back' type='ghost' size='large' onClick={this.handleCancel.bind(this)}>关 闭</Button>
        ]}
      >
        {
          auth.user && auth.user.is_xb_agent === true
          ? <Alert message='温馨提示'
                   description='余额不足，请联系您的代理商进行充值续费'
                   type='info'
                   showIcon/>
          : <ReachargeContentView />
        }
      </Modal>
    )
  }
}


export default connect(mapStateToProps, loginactions)(UserRechargeView)
